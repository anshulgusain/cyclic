const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
    title:{type:String,required:true},
category:{type:String,required:true},
    author:{type:String,required:true},
    constent:{type:String,required:true}
})

const BlogModel=mongoose.model("blog",blogSchema)

module.exports={
    BlogModel
}