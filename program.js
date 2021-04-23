/*
* This file executes the nodeJS server (using express) as well as the websocket (socket.io)
*
* Allows us to communicate with connected devices in real time
* */

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
// responsible for delivering HTML & JS to the tablets
app.get('/', (req, res) => {
    if(typeof req.query.v !== 'undefined'){
        res.sendFile(__dirname+ '/view' + req.query.v + '.html')
    } else {
        res.sendFile(__dirname+ '/view.html');
    }
})

// resolve images as requested by the clients
// responsible for delivering the appropriate image to the tablet based on cId (unique tables identifier / sequential)
app.get('/image/:cid', (req, res) => {
    if(parseInt(req.params.cid) >= 0 && parseInt(req.params.cid) <= 12){
        res.json({src:'Flying_Bird/Bird' + (Number(req.params.cid) +1) + '.png'});
    } else {
        res.json({src:'nan'})
    }


})

const allClients = [];
// initiate socket
// responsible for live-update of content based on behavior
io.on('connection', client =>{
    allClients.push(client);
    client.emit("connect",{any:'thing'})

    // attach cId (tablet identifier) to socket-client
    client.on("cId", p => {
        client.cId = p.cId;
    })
    // listen to "leaving canvas event"
    // handles transition of animation from one tablet to the next
    client.on("leave", payload => {
        const newPayload = {cId: payload.cId+1, y: payload.y};

        // reset in case last tablet triggers this event
        if(!allClients.find(c => c.cId === newPayload.cId)){
            newPayload.cId = allClients.sort((a,b)=>{ return a.cId < b.cId ? -1 : 1 })[0].cId;
        }
        // inform all tablets about targeted position of the bird as well as current/next tablet
        allClients.forEach(c =>{
            c.emit("enter",newPayload)
        })
    })
})


let threshold;
// attach accelerometer (ADXL) listener
speedometer.listen(speed => {
	//console.log(speed);
    allClients.forEach((c,i) => {
        if(!c.connected){
            allClients.splice(i,1);
        } else {
            c.emit("changeImage",{speed})
        }

    })

})


// finally, start http server for communication
server.listen(4008, () => {
    console.log('http://localhost:4008')
})
