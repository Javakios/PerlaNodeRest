// initialize my requirements
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// multer
const fileStorage = multer.diskStorage({
    destination:(req,file,cd) =>{
        
        cd(null,'upload');
    },
    filename:(req,file,cd)=>{
        
        cd(null,file.originalname);
    }
})
// const fileFilter = (req,file,cb) =>{
//     if(file.mimetype )
// }
// routes 

const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const authRoutes = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');
// initialize server

const app = express();

app.use(bodyParser.json())//application/json
app.use(multer({
    storage:fileStorage
}).single('upload'))
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
// revoloute pay
app.use('/revoloute',checkoutRoutes);
app.post('/deleteImage',(req,res,next)=>{
    fs.unlinkSync("/upload/"+req.body.image_name)
})
// errors
app.use((error,req,res,next)=>{

    const status  = error.statusCode || 500;
    const message = error.message;
    

    res.status(status).json({message:message});

});

// listen 
app.listen(3000,(req,res)=>{
    console.log("App Is running on http://localhost:3000");
});