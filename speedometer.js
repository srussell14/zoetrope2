const {spawn} = require('child_process');
module.exports = {
    listen(cb){
        setInterval(()=>{
            if(!process.env.DEBUG_MODE){
                const python = spawn('python3',['../adxl_node.py']);
                python.stdout.on('data', data => {
                    cb(JSON.parse(data))
                } )
            } else {
                cb({x:1,y:1,z:1})
            }

        }, 300);
    }
}
