require("dotenv").config();
const axios = require("axios");

// Bot token from .env
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Simple delay to avoid hitting Telegram rate limits
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Send message to ONE Telegram user
 */
const sendMessage = async (chatId, message) => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
    console.log(`✅ Message sent to ${chatId}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to send message to ${chatId}:`,
      error.response?.data || error.message
    );
  }
};

/**
 * Send a long message in chunks (<4000 chars)
 */
const sendMessageSplit = async (chatId, message) => {
  const chunks = message.match(/(.|[\r\n]){1,4000}/g); // split into <=4000 chars
  for (const chunk of chunks) {
    await sendMessage(chatId, chunk);
    await delay(500); // prevent rate limiting
  }
};

/**
 * Send message to multiple users (chat IDs array)
 */
const sendToMultipleUsers = async (chatIds, message) => {
  for (const id of chatIds) {
    if (!id) continue;

    // Wrap in try-catch to prevent one failure from stopping others
    try {
      await sendMessageSplit(id.trim(), message);
    } catch (err) {
      console.error(`❌ Error sending to ${id}:`, err.message);
    }
  }
};

module.exports = { sendMessage, sendToMultipleUsers };