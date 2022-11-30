const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        
        //---home page services api---//
        app.get('/services', async(req, res) => {
            const query = {};
            console.log(query)
            const cursor = servicesCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        //---all services api---//
        app.get('/allServices', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        
        //---service dynamic with id api---//
        app.get('/allServices/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        //---user review api---//
        app.post('/userReview', async(req, res) => {
            const review = req.body;
            const result = await userCollection.insertOne(review);
            res.send(result);
        })

        // app.get('/userReview', async(req, res) => {
        //     const query = {};
        //     const cursor = userCollection.find(query);
        //     const userReview = await cursor.toArray();
        //     res.send(userReview);
        // })


        //---by serviceId---//
        app.get('/userReview/:serviceId', async(req, res) => {
            const serviceId = req.params.serviceId;
            const query = {serviceId}
            const cursor = userCollection.find(query);
            const userReview = await cursor.toArray();
            res.send(userReview);
        })

        //---by email---//
        // app.get('/userReview/:email', async(req, res) => {
        //     const userEmail = req.params.email;
        //     const query = {userEmail};
        //     const cursor = userCollection.find(query);
        //     const findByEmail = await cursor.toArray();
        //     res.send(findByEmail);
        // })



        //---by email---//
        app.get('/userReview', async(req, res) => {
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            console.log(res.query)
            const cursor = userCollection.find(query);
            const userReviewByEmail = await cursor.toArray();
            res.send(userReviewByEmail);
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