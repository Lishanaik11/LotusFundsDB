require("dotenv").config();
const express = require("express");
const { getResearchCalls } = require("./db"); // your DB module
const { processData } = require("./processor");
const { sendToMultipleUsers } = require("./telegram");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Browser endpoint: view research calls
app.get("/", async (req, res) => {
  try {
    const data = await getResearchCalls();
    if (!data || data.length === 0) return res.send("No research calls found");

    const message = processData(data);
    res.send(`<pre>${message}</pre>`); // nicely formatted in browser
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Endpoint to send report to Telegram users
app.get("/send-report", async (req, res) => {
  try {
    const data = await getResearchCalls();
    if (!data || data.length === 0)
      return res.status(200).json({ message: "No research calls found" });

    const message = processData(data);

    // Get chat IDs from .env and send messages
    const chatIds = process.env.USER_IDS.split(",");
    await sendToMultipleUsers(chatIds, message);

    res.status(200).json({
      message: "Messages sent successfully",
      totalCalls: data.length,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Error sending messages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});