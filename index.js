const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Baby Street Server is Running");
});

app.listen(port, () => {
  console.log(`Baby Street Server is Running on Port: ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llwcx8n.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const toyCollection = client.db("babyStreet").collection("toys");

    // reading toys info
    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    // reading category wise toys info
    app.get("/allToys/:category", async (req, res) => {
      const filter = { sub_category: req.params.category };

      const result = await toyCollection.find(filter).toArray();
      res.send(result);
    });

    // reading single toy info
    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    // inserting single toy info
    app.put("/addToy", async (req, res) => {
      const toy = req.body;

      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
