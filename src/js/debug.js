// Script that will handle all debug stuff
// TODO: - Draw gizmos
//       - Draw on screen (little debug UI)

function DebugLog(string, script_name = "", script_function = "") {
    console.log(script_name + "::" + script_function + "->" + string);
}