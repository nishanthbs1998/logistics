const mongoose=require('mongoose');

const invoiceSchema=new mongoose.Schema({
   
    customerName:{
        type:String
    },
   
    itemName:{
        type:String
    },
    price:{
        type:Number
    }
})

module.exports=mongoose.model('invoice',invoiceSchema);