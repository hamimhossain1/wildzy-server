const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//... middleware ...//
app.use(cors());
app.use(express.json());

// name: wildzy
// password: neK9x6cwKHY45XLL


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8l0k6oj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const userCollection = client.db('wildzyReview').collection('usersReview');
        const servicesCollection = client.db('wildzyReview').collection('services');
        // const user = {name: 'Hamim Hossain', email: 'hamim@gmail.com', age: 77, subject: 'computer science'}

        // const userTwo ={name: 'Habil Hasan ', email: 'habil@gmail.com', age: 88, subjext: 'Bangla, english'}

        // const result = await userCollection.insertOne(user);
        // const result2 = await userCollection.insertOne(userTwo);
        // console.log(result, result2);
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find.query;
            const services = await cursor.toArray();
            res.send(services)
        })

    }
    finally{

    }
}
run().catch(err => console.error(err))








app.get('/', (req, res) => {
    res.send('Hello from Wildzy server...!')
})


app.listen(port, () => {
    console.log(`This app is listening on port ${port} ...!`)
})