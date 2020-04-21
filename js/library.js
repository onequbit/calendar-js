    "use strict";

    String.prototype.stripNewLines = function()
    {
        let parts = this.split('\n');
        parts.forEach( (str, i) => {
            parts[i] = str.trim();            
        });
        return parts.join('');
    }

    function getCallStack()
    {        
        var stack = new Error().stack.split('\n');
        stack.shift();
        stack.map((str, i)=> 
        {             
            stack[i] = str.trim().split(' ')[1];            
        });
        stack.pop();        
        return stack;        
    }

    function getFunctionArgs(func) {        
        let argsString = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];        
        let names = argsString.split(',');
        let args = {};
        names.forEach( function(name, i) 
        {
            var trimmed = name.replace(/\/\*.*\*\//, '').trim();
            var parameter = trimmed.split('=');
            var paramName = parameter[0];
            if (!func.arguments[i] && parameter.length > 1)
                args[paramName] = parameter[1];
            else
                args[paramName] = func.arguments[i];
        });
        return args;
    }

    function inspectFunction(obj)
    {
        function getClassMethodName(obj)
        {
            var info = { className: "", functionName: "", parent: obj };
            var name = getCallStack().pop();
            if (name.indexOf('.') > 0)
            {
                [info.className, info.functionName] = name.split('.');            
            }
            else
            {
                [info.className, info.functionName] = [obj.name, name];  
            }
            if (info.className == "Function" && obj && obj.name)
            {
                info.className = obj.name;            
            }        
            return info;
        }

        let info = getClassMethodName(obj || this || window);        
        if (info.className == "")
        {
            info["definition"] = eval(info.functionName).toString();
        } 
        else
        {
            let staticFunc = eval(info.className + "." + info.functionName);
            let instanceFunc = eval(info.className + ".prototype." + info.functionName);
            let definition = staticFunc || instanceFunc;
            let definitionStr = definition.toString();            
            info["definition"] = definitionStr.stripNewLines();
            let isInstance = (instanceFunc && true) || false;
            let isStatic = (staticFunc && true) || false;
            info["isInstanceMethod"] = isInstance;
            info["isStaticMethod"] = isStatic;
        }

        info["args"] = getFunctionArgs(info.definition);

        return info;
    }
    
    function attachConstant( someObj, constantName, constantValue, prototype = true )
    {        
        var attributes = {
            value: constantValue,
            writable: false,
            enumerable: true,
            configurable: true
        };
        if (prototype)
            Object.defineProperty( someObj.prototype, constantName, attributes );
        else
            Object.defineProperty( someObj, constantName, attributes );            
    }

    function makeReadonly( someObj, propertyName, prototype = true  )
    {        
        var attributes = {
            value: someObj[propertyName],
            writable: false,
            enumerable: true,
            configurable: true
        };
        if (prototype)
            Object.defineProperty( someObj.prototype, propertyName, attributes );
        else
            Object.defineProperty( someObj, propertyName, attributes );        
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

    HTMLCollection.prototype.forEach = Array.prototype.forEach;

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

