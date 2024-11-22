const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/bajaj'

mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to MongoDb server');
});

db.on('disconnected',()=>{
    console.log('MongoDb disconnected');
});

db.on('error',()=>{
    console.log('MongoDb connection error',err);
});

module.exports = db;