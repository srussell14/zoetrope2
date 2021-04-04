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

    // attach cId (iPad identifier) to socket-client
    client.on("cId", p => {
        client.cId = p.cId;
    })
    // listen to "leaving canvas event"
    client.on("leave", payload => {
        const newPayload = {cId: payload.cId+1, y: payload.y};

        if(!allClients.find(c => c.cId === newPayload.cId)){
            newPayload.cId = allClients[0].cId;
        }
        // tell all iPads about possible entry into their canvas
        allClients.forEach(c =>{
            c.emit("enter",newPayload)
        })
    })
})


let threshold;
// attach ADXL listener
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


// open port
server.listen(4008, () => {
    console.log('http://localhost:4008')
})
