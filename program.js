require('dotenv').config();
const express = require('express')
const socket = require('socket.io')


const speedometer = require('./speedometer');



// Initiate socket & express server
const app = express();
const server = require('http').createServer(app);
const io = socket.listen(server);

// make images available
app.use('/images',express.static(__dirname + '/images'))


// resolve html-files
app.get('/', (req, res) => {
    if(typeof req.query.v !== 'undefined'){
        res.sendFile(__dirname+ '/view' + req.query.v + '.html')
    } else {
        res.sendFile(__dirname+ '/view.html');
    }
})

// resolve images as requested by the clients
app.get('/image/:cid', (req, res) => {
    if(parseInt(req.params.cid) >= 0 && parseInt(req.params.cid) <= 12){
        res.json({src:'Flying_Bird/Bird' + (Number(req.params.cid) +1) + '.png'});
    } else {
        res.json({src:'nan'})
    }


})

const allClients = [];
// initiate socket
io.on('connection', client =>{
    allClients.push(client);
    client.emit("connect",{any:'thing'})

})

let threshold;
// attach ADXL listener
speedometer.listen(speed => {
	//console.log(speed);
    allClients.forEach(c => {
        c.emit("changeImage",{speed})
    })

})


// open port
server.listen(4008, () => {
    console.log('http://localhost:4008')
})
