const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("tester");          // your DB
    collection = db.collection("telemetry"); // your collection
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

// Ingest endpoint
app.post("/ingestTelemetry", async (req, res) => {
  try {
    const doc = req.body; // expecting {id, temperature, timestamp}
    const result = await collection.insertOne(doc);
    res.json({ status: "ok", insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
