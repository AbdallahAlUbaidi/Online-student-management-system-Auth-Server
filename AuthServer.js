if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}
const express = require("express")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');


const app = express();
app.use(bodyParser.urlencoded({limit:"10mb" , extended:false}))
app.use(cookieParser())
app.use(express.json())


app.post('/' , async ( req , res )=>
{
    
    try
    {
        const refreshToken = req.body.refreshToken;
        const tokenInfo = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
        const accessToken = await jwt.sign({userId:tokenInfo.userId , role:tokenInfo.role} , process.env.ACCESS_TOKEN_SECRET , {expiresIn:req.body.expiresIn})
        res.status(200).json({accessToken})
    }catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
            res.status(401).json({errorMsg:err.message})
        else
            res.status(500).json({errorMsg:err.message})
    }


})





app.listen(process.env.authServerPort || 8080)