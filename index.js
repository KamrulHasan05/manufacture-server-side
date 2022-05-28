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
        const motherboardCollection = client.db('gigabyte').collection('motherboard');


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