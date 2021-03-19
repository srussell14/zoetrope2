const {spawn} = require('child_process');
const debugMode = JSON.parse(process.env.DEBUG_MODE);
console.log('Debug mode:', process.env.DEBUG_MODE, typeof process.env.DEBUG_MODE);
module.exports = {
    listen(cb){
        let debugStepper = 0;
        setInterval(()=>{
            if(!debugMode){
                const python = spawn('python3',['../adxl_node.py']);
                python.stdout.on('data', data => {
                    cb(JSON.parse(data))
                } )
            } else {
                const steps = [0,-0.11,-.21,-1];
                cb({x:steps[debugStepper],y:1,z:1})
                debugStepper = typeof steps[debugStepper+1] === 'undefined' ? 0 : debugStepper+1;
            }

        }, 200);
    }
}
