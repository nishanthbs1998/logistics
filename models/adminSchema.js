const mongoose=require('mongoose');
const val=require('validator');
const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        validate(value){
            if(!val.isEmail(value)){
                throw new Error("Please enter a valid Email");
            }
        }
    },
    password:{
        type:String,
        min:6,
        required:true
    }

})

module.exports=mongoose.model('admin',adminSchema);