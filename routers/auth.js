const express=require('express');
const router=express.Router();
const customer=require('../models/customerSchema');
const items=require('../models/itemSchema');
const dVehicle=require('../models/vehicleSchema');
const order=require('../models/orderSchema');
const invoice=require('../models/invoiceSchema');
require('mongoose');
const verify=require('./verifyToken');

//Get all customers in the DB
router.get('/customer/all',verify,async(req,res)=>{
    const allCust=await customer.find();
    try{
        res.json(allCust);
    }catch(e){
        res.json(e);
    }
})

//Get an individual customer
router.get('/customer/:id',verify,async(req,res)=>{
    const getCust=await customer.findOne({_id:req.params.id});
    try{
        res.json(getCust);
    }catch(e){
        res.json(e);
    }
})

//Create a new customer
router.post('/customer/new',verify,async(req,res)=>{
    const cust=await new customer(req.body);
    try{
        await cust.save();
        res.json(cust);
    } catch(e){
        res.json({msg:e});
    }
})

//Update an existing customer
router.put('/customer/:id',verify,async(req,res)=>{
  
    const cust=await customer.updateOne({_id:req.params.id},{$set:{name:req.body.name,city:req.body.city}},{useFindAndModify:false});
    try{
   
        res.json(cust);
    }catch(e){
        res.json({msg:e});
    }

})

//Get all items in the DB
router.get('/items/all',verify,async(req,res)=>{
    const allItems=await items.find();
    try{
        res.json(allItems);
    }catch(e){
        res.json(e);
    }
})

//Get an individual item
router.get('/items/:id',verify,async(req,res)=>{
    const getItem=await items.findOne({_id:req.params.id});
    try{
        res.json(getItem);
    }catch(e){
        res.json(e);
    }
})

//Create a new item
router.post('/items/new',verify,async(req,res)=>{
    const newItem=await new items(req.body);
    try{
        await newItem.save();
        res.json(newItem);
    }catch(e){
        res.json({msg:e})
    }
})

//Update an exisitng item
router.put('/items/:id',verify,async(req,res)=>{
    const item=await items.updateOne({_id:req.params.id},{$set:{name:req.body.name,price:req.body.price}},{useFindAndModify:false});
    try{
     //   item.save();
        res.json(item);
    }catch(e){
        res.json({msg:e});
    }

})

//Get all delivery vehicles in the DB
router.get('/deliveryVehicles/all',verify,async(req,res)=>{
    const allVehicles=await dVehicle.find();
    try{
        res.json(allVehicles);
    }catch(e){
        res.json(e);
    }
})

//Get an individual delivery vehicle
router.get('/deliveryVehicles/:id',verify,async(req,res)=>{
    const getVehicle=await dVehicle.findOne({_id:req.params.id});
    try{
        res.json(getVehicle);
    }catch(e){
        res.json(e);
    }
})

//Create a new delivery vehicle
router.post('/deliveryVehicles/new',verify,async(req,res)=>{
    
    const regNum=await req.body.registrationNumber;
    const newVehicle=await new dVehicle(req.body);
    try{
     

       
        let checkRegNum, i, len,numCount=0,alphaCount=0;
      
        for (i = 0, len = regNum.length; i < len; i++) {

            checkRegNum = await regNum.charCodeAt(i);
            if ((checkRegNum > 47 && checkRegNum < 58)){             
                numCount+=1;
            } 
            
            if((checkRegNum > 64 && checkRegNum < 91)||(checkRegNum > 96 && checkRegNum < 123)){ 
                
                alphaCount+=1;
                    
            }
        }

        if(numCount===0||alphaCount===0||numCount+alphaCount!==regNum.length){
           res.json('Registration number should be alphanumeric.');
        }
        
        else{
            await newVehicle.save();
            res.json(newVehicle);
        }
        
        
    }catch(e){
        res.json({msg:e});
    }
})

//Update an existing delivery vehicle
router.put('/deliveryVehicles/:id',verify,async(req,res)=>{
    const delVehicles=await dVehicle.updateOne({_id:req.params.id},{$set:{registrationNumber:req.body.registrationNumber,city:req.body.city,vehicleType:req.body.vehicleType}});
    try{
      
        res.json(delVehicles);
    }catch(e){
        res.json({msg:e});
    }

})

//Get all orders in the DB
router.get('/order/all',verify,async(req,res)=>{
    const allOrders=await order.find();
    try{
        res.json(allOrders);
    }catch(e){
        res.json({msg:e});
    }
})


//Create a new order 
router.post('/order/new',verify,async(req,res)=>{
   
    const getItem=await items.findOne({_id:req.body.itemId});
    const getCust=await customer.findOne({_id:req.body.customerId});
    
    
    const check=await dVehicle.findOne({city:getCust.city,vehicleType:"truck",activeOrdersCount:{$lt:2}});

    if(check){
        
        const genInvoice=await new invoice({customerName:getCust.name,itemName:getItem.name,price:getItem.price});
        const newOrder=await new order({itemId:getItem._id,price:getItem.price,customerId:getCust._id,deliveryVehicleId:check._id,invoiceId:genInvoice._id});
       
        await check.update({$inc:{activeOrdersCount:1}});
        await genInvoice.save();
        await newOrder.save();
        res.json(newOrder);
  
    }
    else{
        res.json("Order cannot be placed.");
    }
    
})

//Route to deliver order
router.put('/deliverOrder/:id',verify,async(req,res)=>{
    try{
        const ord=await order.findOne({_id:req.params.id});
        await ord.updateOne({isDelivered:true});
        const update=await dVehicle.findOne({_id:ord.deliveryVehicleId});
        await update.updateOne({isDelivered:true,$inc:{activeOrdersCount:-1}})
        await update.save();
        res.json({ord,update}); 
    }catch(e){
        res.json({msg:e});
    }
})

//Get all invoice in the DB
router.get('/invoice/all',verify,async(req,res)=>{
    const allInvoice=await invoice.find();
    try{
        res.json(allInvoice);
    }
    catch(e){
        res.json({msg:e});
    }
})

//Get a specific invoice
router.get('/invoice/:id',verify,async(req,res)=>{
    const getInvoice=await invoice.findOne({_id:req.params.id});
    try{
        res.json(getInvoice);
    }
    catch(e){
        res.json({msg:e});
    }
})

module.exports=router;