const processData = (data) => {
  let message = "📊 *Stock Research Calls*\n\n";

  data.forEach((row, index) => {
    message += `#${index + 1}\n`;
    message += `Symbol: ${row.symbol}\n`;
    message += `Name: ${row.display_name}\n`;
    message += `Action: ${row.action}\n`;
    message += `Call Type: ${row.call_type}\n`;
    message += `Entry Price: ${row.entry_price}\n`;
    message += `Target: ${row.target_price}\n`;
    message += `Stop Loss: ${row.stop_loss}\n`;
    message += `Exchange: ${row.exchange_type}\n`;
    message += `Created At: ${row.created_at}\n\n`;
  });

  message += "✅ End of Report";
  return message;
};

module.exports = { processData };