const mongoose=require('mongoose');


const orderSchema=new mongoose.Schema({
   orderNumber:{
       type:String,
       unique:true,
       
    },
    itemId:{
        type:mongoose.Schema.Types.ObjectId
       
    },
    price:{
        type:Number,
        
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId
        
    },
    deliveryVehicleId:{
        type:mongoose.Schema.Types.ObjectId
       
    },
    invoiceId:{
        type:mongoose.Schema.Types.ObjectId
    },
    isDelivered:{
        type:Boolean,
        default:false
    }
})

// const counterSchema=new mongoose.Schema({
   
//     seqNum:{
//         type:Number,
//         default:0
//     }
// })
// const orderCount=mongoose.model('orderCount',counterSchema);
// orderCount.create({seqNum:0});
// let count=1;
// orderSchema.pre('save',function(next){
//    this.orderNumber=count;
//    count+=1;
//    next()

// })


//let arr=[]
//new orderCount({seqNum:0}).save();
// let count;
//  let counter=n.find();
//  if(counter===undefined||counter===null){
//       count=0;
//  }
//  else{
//      count=counter.seqNum;
//  }
 let count=1;
orderSchema.pre(`save`,async function(next){    
  //   console.log(orderCount.findOne({seqNum:120}));
     if(count<10 )
     {
         this.orderNumber= "000"+count.toString();
         count+=1;
  //       await orderCount.updateOne({$inc:{seqNum:1}});   
        }
     else if(count>=10&&count<100){
         this.orderNumber="00"+count.toString();
         count+=1;
    //     await orderCount.updateOne({$inc:{seqNum:1}});
    
     }
     else if(count>=100&&count<1000){
         this.orderNumber="0"+count.toString();
         count+=1;
      //   await orderCount.updateOne({$inc:{seqNum:1}});
     }
  
     else
     {
        
        this.orderNumber=count.toString();
        count+=1;
        //await orderCount.updateOne({$inc:{seqNum:1}});
         }
 
    next()
})

module.exports=mongoose.model('orders',orderSchema);