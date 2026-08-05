const express = require('express')

const app = express();


app.use("/test",(req , res)=>{
    res.send("helo form test!")
})

app.use('/',(req , res)=>{
    res.send("helo form dashboard!")
})

app.listen('3000',()=>{
    console.log("app is running ion port: 3000")
})