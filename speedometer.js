const {spawn} = require('child_process');
module.exports = {
    listen(cb){
        setInterval(()=>{
            const python = spawn('python3',['../adxl_node.py']);
            python.stdout.on('data', data => {
                cb(JSON.parse(data))
            } )

        }, 300);
    }
}
