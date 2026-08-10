const mongoose = require('mongoose')

const URI="mongodb+srv://mansimg2000:MongoTest123456@learnmongo.ookfesx.mongodb.net/dev-tinder"

const connectDB = async() =>{
    try{
   await mongoose.connect(URI)
    }catch{(err)=>{
        console.error("DB ERROR: ",err)
    }}
}

module.exports={connectDB}