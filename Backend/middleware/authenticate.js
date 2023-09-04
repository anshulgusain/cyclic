const jwt=require("jsonwebtoken")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.send("Please Login")

    }
    jwt.verify(token, 'shhhhh', function(err, decoded) {
       if(err){
        return res.send("Wrong Token")

       }
       else{
        const{userID}=decoded
        req.userID=userID
        next()
       }
      });
}

module.exports={
    authenticate
}