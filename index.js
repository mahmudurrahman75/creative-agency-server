const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7rp0m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()


app.use(cors());
app.use(bodyParser.json());


const port = 5000

console.log(process.env.DB_USER)




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("creativeAgency").collection("order");
    console.log("database connected")


    app.post('/addOrder', (req, res) => {
        const newRegister = req.body;
        orderCollection.insertOne(newRegister)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
        console.log(newRegister);
    })





    app.get('/orders', (req, res) => {
        // console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, documents) => {
          res.send(documents);
        })
    })



    app.get('/order', (req, res) => {
    
        orderCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
    })

 

    
    app.post('/isOrder', (req, res) => {
        const email = req.body.email;
        orderCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    })




});





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)