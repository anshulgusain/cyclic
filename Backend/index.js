const express=require("express")

const { connection } = require("./connection/db")
const { UserModel } = require("./models/Usermodel")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { BlogModel } = require("./models/Blogmodel");
const {authenticate}=require("./middleware/authenticate")

const app=express()
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("This is Base Api")
})

app.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body;
   
 
        bcrypt.genSalt(3, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
        const newUser=new UserModel({
            email,
            password,
            name
        })

         await newUser.save()
         res.send("Signed Up")
        });
    });
    
})
    


app.post("/login",async(req,res)=>{
    const{email,password}=req.body
   const user=await UserModel.findOne({email:email})
   if(user){
    const password=user.password
    bcrypt.compare("B4c0/\/", password, function(err, res) {
        // res === true
        if(res){
            const token = jwt.sign({userID:user._id }, 'shhhhh');
            res.send({msg:"Logged in succesfully",token: token})
        }
        else{
            res.send("Login failed")
        }

    });
   }
    res.send("This is Base Api")
})

app.use(authenticate)


app.get("/blogs",async(req,res)=>{
   try{
    const blogs=await BlogModel.find()
    res.send({blogs})
   }
   catch(err){
    console.log(err)
    res.send("Please try again ")
   }
})


app.post("/blogs/create",async(req,res)=>{
   const {title,category,author,content}=req.body
   const new_blog=new BlogModel({
    title,
    category,
    author,
    content
   })
   try{
    await new_blog.save()
    return res.send("Added Succesfully")
   }catch(err){
    console.log(err)
    res.send("Not added")
   }
 })

 app.put("/:blogID",async(req,res)=>{
    const {title,category,author,content}=req.body
    const {blogID}=req.params
    try{
        const newBlog=await BlogModel.findByIdAndUpdate(blogID,{
            title,
            category,
            author,
            content
        })
        res.json(newBlog)}
        catch(err){
res.send("Not Updated")
        }
    
 })


 app.delete("/:blogID",async(req,res)=>{
   
    const {blogID}=req.params
    try{
        const delBlog=await BlogModel.findByIdAndDelete(blogID)
     if(!delBlog){
        res.send("Not deleted")
     }
     else{
        res.send("Blog Delted")
     }
    }catch(err){
        res.send("Error")
    }
 })



app.listen(2000,async()=>{
    try{
        await connection
        console.log("Connected to mongo atlas")

    }
    catch(error){
        console.log(err)
        console.log("Connection failed")
    }
    console.log("Listening")
})