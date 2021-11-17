const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').objectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4urre.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourismRelated');
        const servicesCollection = database.collection('services');

        //get api
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get nsingle services
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: objectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // post api
        app.post('/services', async(req, res) =>{
            const service = req.body;

            console.log('hit the post api', service)
        
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:objectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running genius server');
});



app.listen(port, () => {
    console.log('running genius server on port', port);
})