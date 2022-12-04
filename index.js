const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//... middleware ...//
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8l0k6oj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const userCollection = client.db('wildzyReview').collection('usersReview');
        const servicesCollection = client.db('wildzyReview').collection('services');

        //---JWT TOKEN---//
        app.post('/jwt', (req, res) => {
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
            res.send({token});
        })
        
        //---home page services api---//
        app.get('/services', async(req, res) => {
            const query = {};
            console.log(query)
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            const latestData = services.reverse().slice(0, 3);
            res.send(latestData);
        })

        //---all services api---//
        app.get('/allServices', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        //--- add new service---//
        app.post('/allServices', async(req, res) => {
            const service = req.body;
            const addService = await servicesCollection.insertOne(service);
            res.send(addService)
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

        //---by serviceId---//
        app.get('/userReview/:serviceId', async(req, res) => {
            const serviceId = req.params.serviceId;
            const query = {serviceId}
            const cursor = userCollection.find(query);
            const userReview = await cursor.toArray();
            res.send(userReview);
        })

        //--- api by email for my review---//
        app.get('/userReview', async(req, res) => {
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = userCollection.find(query);
            const userReviewByEmail = await cursor.toArray();
            res.send(userReviewByEmail);
        })

        //---edit review 2nd way---//
        app.put("/userReview/:id",  async (req, res) => {
            const id = req.params.id;
            const review = req.body.editedReview;
            // const review = req.body?.review;
            console.log(review)
            const query = { _id: ObjectId(id) };
            const updateDoc = {
              $set: {
                review: review,
              },
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.send(result);
          });



        //--- api by email for my review---//
        app.delete('/userReview/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })



        

        // app.patch("/reviews/:id",  async (req, res) => {
        //     const id = req.params.id;
        //     const rating = req.body?.rating;
        //     const review = req.body?.review;
        //     const query = { _id: ObjectId(id) };
        //     const updateDoc = {
        //       $set: {
        //         rating: rating,
        //         review: review,
        //       },
        //     };
        //     const result = await reviewsCollection.updateOne(query, updateDoc);
        //     res.send(result);
        //   });





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