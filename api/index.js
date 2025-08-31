module.exports = (req, res) => {
  res.status(200).send("✅ API is running. Use POST /api/ingestTelemetry");
};