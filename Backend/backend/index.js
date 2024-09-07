const express=require("express")
const connection=require("./connection/connect")
const bcrypt = require('bcrypt');
const { UserModel } = require("./models/UserModel");
var jwt = require('jsonwebtoken');
const { authenticate } = require("./middlewares/authenticate");

const cors = require('cors');
const { BlogModel } = require("./models/BlogModel");
require('dotenv').config()


const app=express()
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    res.send("Base api")
})

// Login and Signup

app.post("/signup",async(req,res)=>{
    const {name,email,mobile,password}=req.body
    // console.log(password)
     bcrypt.hash(password, 5, async function(err, hash) {
       await  UserModel.create({name,email,mobile,password:hash,})
       res.send("Signed up Succesfully")
    });

   
})


app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await UserModel.findOne({email})
  
    
    if(user){
        const hash=user.password
        // console.log(password)
        bcrypt.compare(password, hash, async function(err, result) {
            // result == true
            
            if(result){
                var token = jwt.sign({ userid:user._id }, 'shhhhh');
               
                res.send({msg:"Logged in Succesfully",token:token})
            }
            else{
                res.send({msg:"Wrong password"})
            }
        });
    }else{
        res.send({msg:"Sign up first"})
    }
  
})

// Crud api part
app.get("/blog",async (req,res)=>{
    const data=await BlogModel.find(req.query)
        res.send({data})
    })

app.use(authenticate)




app.post("/blog/add",async (req,res)=>{
    const {title,image,author,blog}=req.body
    const userid=req.userid
    console.log(userid)
    try{
await BlogModel.create({title,image,author,blog,userid})
res.send("Blog Created Sucessfully")
    }catch(err){
        console.log(err)
        res.send("Error in Creating")
    }

})

app.put("/blog/edit/:id",async (req,res)=>{
  const {id}=req.params
  userid=req.userid
 const user= await BlogModel.find({userid:id})
const checkid=user[0].userid
  const newid=user[0]._id.toString()
  console.log(userid)
  console.log(checkid)
 const {title,image,author,blog}=req.body
//  console.log(status)
 try{
    if(userid===checkid){
       
await BlogModel.findByIdAndUpdate(newid,{title,image,author,blog})
res.send("Edited Succesfully")

    }else{
        res.send({msg:"Not Authorised"})
        console.log("NOt authori")
    }
 }catch(err){
    console.log(err)
    res.send("Not edited")
 }

})


app.delete("/blog/:id",async (req,res)=>{
    const {id}=req.params
    const user= await BlogModel.find({_id:id})
    const userid=req.userid
    const checkid=user[0].userid
    console.log(userid)
    console.log(checkid)
   try{
      if(checkid===userid){
  await BlogModel.findByIdAndDelete(id)
  res.send("Deleted Succesfully")
  
      }else{
          res.send({msg:"Not Authorised"})
      }
   }catch(err){
      console.log(err)
      res.send("Not Deleted")
   }
  
  })

app.listen(8080,async()=>{
try{
await connection
console.log("Listening to port 8080")
}catch(err){
    console.log(err)
    console.log("Unable to connect")
}
})