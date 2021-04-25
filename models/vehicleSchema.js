const mongoose=require('mongoose');



const dvSchema=new mongoose.Schema({
    registrationNumber:{
        type:String,
        unique:true,
        required:true,
       
    },
    vehicleType:{
        type:String,
        enum:['bike','truck'],
        default:'truck'
        
    },
    city:{
        type:String,
        required:true
    },
    activeOrdersCount:{
        type:Number,
        min:0,
        max:2,
        default:0
    }
})



module.exports=mongoose.model('deliveryVehicle',dvSchema);