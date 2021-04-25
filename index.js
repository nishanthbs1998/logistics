const { urlencoded } = require('express');
const express=require('express');
const app=express();
require('dotenv/config');
const mongoose=require('mongoose');
app.use(express.json());
app.use(urlencoded({extended:false}));

const adminRouter=require('./routers/adminRoute');
const route=require('./routers/auth');

app.use(route);
app.use('/admin',adminRouter);


mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true},()=>{console.log('Mongo server runnning...')});
const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{console.log(`App running on port ${PORT}`)});

