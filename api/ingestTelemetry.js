const { MongoClient } = require("mongodb");

let client;
let collection;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db("tester");           // your DB name
    collection = db.collection("telemetry");  // your collection
  }
  return collection;
}

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const collection = await connectDB();
      const doc = req.body;
      const result = await collection.insertOne(doc);
      res.status(200).json({ status: "ok", insertedId: result.insertedId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
