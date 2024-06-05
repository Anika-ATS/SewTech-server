const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Replace <password> with the actual password, ensuring it is URL-encoded if it contains special characters
const uri =
  "mongodb+srv://tabassumanika210:3Cv26o52SBmr00j5@cluster0.9hadih8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Attempting to connect to MongoDB...");
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Connect to the database and access its collection
    const teamT = client.db("teamDB");
    const tailorsCollection = teamT.collection("tailorsCollection");

    // Team members endpoint
    app.post("/membar", async (req, res) => {
      const MembarData = req.body;
      const result = await tailorsCollection.insertOne(MembarData);
      console.log(result);
      res.send(result);
    });

    app.get("/membar", async (req, res) => {
      const MembarData = tailorsCollection.find();
      const result = await MembarData.toArray();
      res.send(result);
    });

    app.get("/membar/:id", async (req, res) => {
      const id = req.params.id;
      const MembarData = await tailorsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(MembarData);
    });
    app.patch("/membar/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await tailorsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/membar/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tailorsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
