    "use strict";


    
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

