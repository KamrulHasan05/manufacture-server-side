const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB}:${process.env.PASSWORD}@cluster0.eivzb.mongodb.net/?retryWrites=true&w=majority`;
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
        // add parts
        app.post('/addproduct', async (req, res) => {
            const product = req.body;
            const result = await partsCollection.insertOne(product);
            res.send(result);
        })
        //  all parts get
        app.get('/parts', async (req, res) => {
            const parts = await partsCollection.find().toArray();
            res.send(parts);
        })
        // parts get by id
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await partsCollection.findOne(query);
            res.send(result);
        })
        // parts delete by id
        app.delete('/deleteParts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await partsCollection.deleteOne(filter);
            res.send(result);
        })

        // set review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })
        // get review
        app.get('/review', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })
        // post orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })
        // get orders by user
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const filter = { email }
            const result = await ordersCollection.find(filter).toArray();
            res.send(result);
        })
        // get orders by id for payment
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await ordersCollection.findOne(filter);
            res.send(result);
        })
        // update payment
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId
                }
            }

            const result = await paymentCollection.insertOne(payment);
            const updatedBooking = await ordersCollection.updateOne(filter, updatedDoc);
            res.send(updatedBooking);
        })
        // get all orders
        app.get('/allorders', async (req, res) => {
            const result = await ordersCollection.find().toArray();
            res.send(result);
        })
        // delete/ cancel order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
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