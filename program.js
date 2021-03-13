require('dotenv').config();
const express = require('express')
const socket = require('socket.io')


const speedometer = require('./speedometer');




const app = express();
const server = require('http').createServer(app);
const io = socket.listen(server);

app.use('/images',express.static(__dirname + '/images'))

/*const images = [{
    cid: 0,
    images:['bird.png']
}];*/


app.get('/', (req, res) => {

    res.sendFile(__dirname+ '/view.html');
})

app.get('/image/:cid', (req, res) => {
    if(parseInt(req.params.cid) >= 0 && parseInt(req.params.cid) <= 12){
        res.json({src:'Flying_Bird/Bird' + (Number(req.params.cid) +1) + '.png'});
    } else {
        res.json({src:'nan'})
    }

   /* let image = images.find(i => i.cid === Number(req.params.cid));
    if(image){
        res.json({src:image.images[0]});
    } else {
        res.json({src:'nan'})
    }*/

})

const allClients = [];

io.on('connection', client =>{
    allClients.push(client);
    client.emit("connect",{any:'thing'})

})

let threshold;

speedometer.listen(speed => {
	//console.log(speed);
    allClients.forEach(c => {
        c.emit("changeImage",{speed})
    })

})

/*
io.on('connection', iPad => {

    console.log('one')
})*/

server.listen(4008, () => {
    console.log('http://localhost:4008')
})
