require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware Connections
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Content management app is running')
})
//connect mongodb
const uri = `mongodb+srv://enan99:UYcH6xsA0yYDoPSm@cluster0.gjuz4pd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// Routes
async function run() {
    try {
        await client.connect();
        const blogsCollection = client.db('contentManagement').collection('blogs');
        app.get('/blogs', async (req, res) => {
            const result = await blogsCollection.find({}).toArray();
            res.send(result)
        });

        app.post('/blogs', async (req, res) => {
            const data = req.body;
            const result = await blogsCollection.insertOne(data);
            res.send(result);
        });

        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(filter);
            res.send(result)
        });

        app.put('blogs/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: data
            };
            const options = { upsert: true };
            const result = await blogsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir);

// Connection
app.listen(port, () => {
    console.log('App running in port: ' + port)
})