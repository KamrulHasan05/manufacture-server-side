const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB}:${process.env.PASSWORD}@cluster0.vliyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const usersCollection = client.db("users").collection("info");
        const partsCollection = client.db("processor").collection("details");
        const ordersCollection = client.db("orders").collection("details");
        const reviewsCollection = client.db("reviews").collection("details");

        // make user and send token
        app.put('/login', async (req, res) => {
            const user = req.body;
            const email = user.email;
            const filter = { email };
            const option = { upsert: true };
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '2h' })
            res.send({ token, result });
        })
        // get all users
        app.get('/allusers', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })
        // get a users
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const filter = { email };
            const result = await usersCollection.findOne(filter);
            res.send(result);
        })
        // update user info
        app.put('/users', async (req, res) => {
            const userData = req.body;
            const email = userData.email;
            const filter = { email };
            const option = { upsert: true };
            const update = {
                $set: userData
            };
            const result = await usersCollection.updateOne(filter, update, option);
            res.send(result);
        })


    }
    finally {
        //  await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})