const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors')
const dotenv = require('dotenv').config()

const app = express();

app.use(express.json()) // route parameter
app.use(express.urlencoded({extended:true})) // query parameters 

mongoose.connect(process.env.MONGODB_URI, 
    {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER, 
        pass: process.env.DB_PASS,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify:false,
        writeConcern: {
            j: true
        }
    })
    .then(()=>{
        console.log("Mongodb connected .... ")
    })
    .catch(error => {
        console.log(error.message)
    })


const ProductRoute = require('./Routes/Product.route');

app.use('/products', ProductRoute);

app.use((req, res, next)=>{
    next(createError(404, 'Not Found'))
});

//error handler
app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500, 
            message: err.message
        }
    });
});


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('server started , port ' + PORT + '...')
});

