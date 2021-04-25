const express=require('express');
const router=express.Router();
const Admin=require('../models/adminSchema');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv/config');
router.post('/new',async(req,res)=>{
    const checkEmail=await Admin.findOne({email:req.body.email});
    if(checkEmail){
        return res.json("Email already exists");
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    const admin=new Admin({email:req.body.email,password:hashedPassword});
    try{
        if(!admin.error)
        {
            await admin.save();
            res.json(admin);
        }
        else{
            res.json("Couldn't create new admin");
        }
    }catch(e){
        res.json({msg:e});
    }
})


router.post('/login',async(req,res)=>{
    const admin=await Admin.findOne({email:req.body.email});
    if(!admin){
        return  res.status(400).json("Invalid email or password");
    }
    const checkPass=await bcrypt.compare(req.body.password,admin.password);
    if(!checkPass){
       return res.status(400).json("Invalid email or password");
    }

    const token=jwt.sign({_id:admin._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token);
    res.json("Logged In !!");
})

module.exports=router;