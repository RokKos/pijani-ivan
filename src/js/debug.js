// Script that will handle all debug stuff
// TODO: - Draw gizmos
//       - Draw on screen (little debug UI)

const DEBUG_ENABLED = false;

function DebugLog(string, script_name = "", script_function = "") {
    if (DEBUG_ENABLED){
        console.log(script_name + "::" + script_function + "->" + string);
    }
}