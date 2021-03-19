const {spawn} = require('child_process');
module.exports = {
    // callback listener
    listen(cb){
        let debugStepper = 0;
        // interval listening
        setInterval(()=>{

            if(!process.env.DEBUG_MODE){
                // execute python script
                const python = spawn('python3',['../adxl_node.py']);
                python.stdout.on('data', data => {
                    // call listener's callback function
                    cb(JSON.parse(data))
                } )

            } else {
                // debugging: serving fake data
                const steps = [0,-0.11,-.21,-1];
                cb({x:steps[debugStepper],y:1,z:1})
                debugStepper = typeof steps[debugStepper+1] === 'undefined' ? 0 : debugStepper+1;
            }

        }, 200);
    }
}
