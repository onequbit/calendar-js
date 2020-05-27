Array.prototype.trim = function()
{
    return this.map( (element) => { return element.toString().trim(); });
}

String.prototype.toStr = function()
{
    return this.split('\n').trim().join('');
}

Object.prototype.toStr = function()
{
    return this.toString().toStr();
}


Function.prototype.getCallStack = function()
{
    var stack = new Error().stack.split('\n').trim();    
    stack.shift(); // drop Error line    
    stack.forEach((str, i)=> 
    {
        // grab only the source name for this stack entry
        stack[i] = str.trim().split(' ')[1]; 
    });
    var check = stack.pop();
    if (check == 'async')
    {
        var [module, file] = [stack.pop(), stack.pop()];
        module = file = null;
    }
    // console.log('getCallStack -> stack:', stack);    
    return stack;
}

Function.prototype.getClassMethodName = function(obj)
{
    var info = { className: "", functionName: "", parent: obj, definition: obj.toStr() }; 
    
    var callstack = this.getCallStack();
    var name = callstack.pop();      
    if (name.indexOf('.') > 0)
    {    
        [info.className, info.functionName] = name.split('.');            
    }
    else
    {        
        [info.className, info.functionName] = [obj.name, name];
        if (obj.name == name) info.className = "";  
    }
    if (info.className == "Function" && obj && obj.name)
    {
        info.className = obj.name;            
    }        
    return info;
}

Function.prototype.debug = function(args)
{
    var info = this.getClassMethodName(this);    
    info.args = getFunctionArgs(info.definition, args);
    return info;
}

function getFunctionArgs(funcStr, funcArgs) 
{        
   
    let args = {};    
    let argsString = funcStr.match(/function\s.*?\(([^)]*)\)/) || funcStr.match(/\(([^)]*)\)/);
    if (!argsString || argsString.length == 0)
    {           
        console.log("getFunctionArgs -> funcStr:", funcStr);        
        console.log("getFunctionArgs -> argsString:", argsString);
        throw "error parsing function definition string";     
    }    
    argsString = argsString[1];
    
    if (!argsString || argsString.length == 0) return args;
    let names = argsString.split(',').map( (s) => { return s.trim(); });    
    names.forEach( function(name, i) 
    {        
        var trimmed = name.replace(/\/\*.*\*\//, '').trim();        
        var parameter = trimmed.split('=');
        var paramName = parameter[0];
        
        if (parameter.length > 1)
            args[paramName] = parameter[1];
        else
        {
            if (!funcArgs || !funcArgs[i]) args[paramName] = undefined;
            else args[paramName] = funcArgs[i];
        }
    });
    return args;
}

Number.prototype.toDigits = function(len)
{
    let str = this + '';
    while (str.length < len)
        str = '0' + str;
    return str;
}

function doRedirect(params)
{
    let url = window.location.href.split('?')[0] + "?" + params;
    window.location.href = url;
}

function getUrlParameters()
{
    let urlStr = window.location.search.substring(1) || null;
    if (urlStr == null) return {};
    let params = {};
    urlStr.split('&').forEach( (param) =>
    {
        try
        {
            let [key, value] = param.split('=');                
            params[key] = value;
        } 
        catch(e)
        {
            console.log(e);
        }
    });        
    return params;
}

function getUrlParameter(parameterName, alternateValue)
{    
    let params = getUrlParameters();
    if (params.hasOwnProperty(parameterName))
        return params[parameterName];
    else
        return alternateValue;        
}

function configureElement( id, setupFunction, debug = false )
{
    let element = document.getElementById(id);        
    if (element)
    {
        setupFunction(element)
    }
    else 
    {            
        if (debug) console.log("element id: " + id + " not found");
        return;
    }        
}

try
{
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
catch(e)
{

}

function forElementClass( className, mappedFunction, debug = false )
{
    document.getElementsByClassName(className).forEach( function(element)
    {
        if (element)
        {
            mappedFunction(element)
        }
        else 
        {            
            if (debug) console.log("element class: " + id + " not found");
            return;
        }     
    })
}

function debuglog()
{   
    console.log(JSON.stringify(arguments));     
}
