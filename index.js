const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://freelance-marketplace:f2j2XS9UlpBXp18G@cluster0.zyhkinn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
    try{
        await client.connect();

        const db = client.db('freelance_db');
        const jobsCollection = db.collection('jobs');
        const usersCollection = db.collection('users');

        app.post('/users', async (req, res) => {
    console.log('Got user from frontend:', req.body);
    try {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).send({ message: 'User insert failed' });
    }
});



        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob);
            res.send(result); 
        })

        app.get('/jobs/:id', async (req, res) =>  {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.delete('/jobs/:id', async (req, res) =>  {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await jobsCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/jobs/:id', async (req, res) =>  {
            const id = req.params.id;
            const updateJob = req.body;
            const query = {_id: new ObjectId(id)}
            const update = {
                $set: {
                    userEmail: updateJob.userEmail
                }
            }
            const result = await jobsCollection.updateOne(query, update);
            res.send(result);
        })

        await client.db('admin').command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Freelance MarketPlace Server is Running');
})

app.listen(port, () => {
    console.log(`Freelance MarketPlace Server is Running on Port : ${port}`);
})