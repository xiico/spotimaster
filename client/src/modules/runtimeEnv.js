// Capture environment as module variable to allow testing.
var compileTimeEnv;

try {
    compileTimeEnv = process.env;
} catch (error) {
    compileTimeEnv = {};
    console.log('`process.env` is not defined. ' + 'Compile-time environment will be empty.');
} // This template tag should be rendered/replaced with the environment in production.
// Padded to 4KB so that the data can be inserted without offsetting character 
// indexes of the bundle (avoids breaking source maps).


var runtimeEnv = '{{REACT_APP_VARS_AS_JSON______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________}}'; // A function returning the runtime environment, so that 
// JSON parsing & errors occur at runtime instead of load time.

function loadRuntimeEnv() {
    var env;

    //   if (compileTimeEnv.NODE_ENV === 'production') {
    //     try {
    //       env = JSON.parse(runtimeEnv);
    //     } catch (error) {
    //       env = {};
    //       var overflowsMessage = runtimeEnv.slice(32, 33) != null;
    //       console.error('Runtime env vars cannot be parsed. ' + 'Content is `' + runtimeEnv.slice(0, 31) + (overflowsMessage ? '…' : '') + '`');
    //     }
    //   } else {
    //     env = compileTimeEnv;
    //   }
    env = compileTimeEnv;

    return env;
}

module.exports = loadRuntimeEnv;