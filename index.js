// initialize my requirements
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// routes 

const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const authRoutes = require('./routes/auth');
// initialize server

const app = express();

app.use(bodyParser.json())//application/json
app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

})
// auth routes
app.use('/auth',authRoutes);
// products routes
app.use('/products',productsRoute); 
// categories routes
app.use('/categories',categoriesRoute);

app.use((error,req,res,next)=>{

    const status  = error.statusCode || 500;
    const message = error.message;
    

    res.status(status).json({message:message});

});

// listen 
app.listen(3000,(req,res)=>{
    console.log("App Is running on http://localhost:3000");
});