/*
* This file is responsible for reading the python based velocity of the accelerometer
*
* In this scenario, python is run by a nodeJS child process
* */
const {spawn} = require('child_process');
const debugMode = JSON.parse(process.env.DEBUG_MODE);
console.log('Debug mode:', process.env.DEBUG_MODE, typeof process.env.DEBUG_MODE);
module.exports = {
    // callback listener
    listen(cb){
        let debugStepper = 0;
        // interval listening
        // execution of python script every x milliseconds (x being 400ms)
        setInterval(()=>{
            // execute python script
            if(!debugMode){
                // adxl_node.py reads x,y,z axis acceleration
                const python = spawn('python3',['../adxl_node.py']);
                python.stdout.on('data', data => {
                    // call listener's callback function
                    cb(JSON.parse(data))
                } )

            } else {
                // debugging: serving fake data
                const steps = [0,-0.11,-.21,-1];
                cb({x:steps[debugStepper],y:1,z:1})
                // debugStepper = typeof steps[debugStepper+1] === 'undefined' ? 0 : debugStepper+1;
                debugStepper = 0;
            }

        }, 400);
    }
}
