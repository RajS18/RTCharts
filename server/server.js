const express = require('express');
const soc_io = require('socket.io');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = soc_io(server,{
    cors:{
        origin:"http://localhost:3000",  //react host url
        methods:['PUT','GET']
    }
})
let lprice = Math.random()*100+50;
let day=0;
io.on('connection',(socket)=>{
    const periodic_function = setInterval(()=>{
        const percentageChange = 2*Math.random();
        let priceChange = lprice * (percentageChange/100);
        priceChange *= Math.floor(Math.random()*2)===1?1:-1;
        lprice+=priceChange;
        socket.emit('stockData',{price:lprice,day : ++day});
    },100)
    socket.on('disconnect',()=>{
        clearInterval(periodic_function);
    });
})

const PORT = 4000;
server.listen(PORT,()=>{
    console.log(`Listening to port number: ${PORT}`);
})