const {spawn} = require('child_process');
module.exports = {
    listen(cb){
        let debugStepper = 0;
        setInterval(()=>{
            if(!process.env.DEBUG_MODE){
                const python = spawn('python3',['../adxl_node.py']);
                python.stdout.on('data', data => {
                    cb(JSON.parse(data))
                } )
            } else {
                const steps = [0,-0.11,-.21,-1];
                cb({x:steps[debugStepper],y:1,z:1})
                debugStepper = typeof steps[debugStepper+1] === 'undefined' ? 0 : debugStepper+1;
            }

        }, 4000);
    }
}
