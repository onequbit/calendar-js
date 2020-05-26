import "./library.mjs";
import "./date_ext.mjs";
// import { Calendar } from "./calendar.mjs";

const Calendar = require("./calendar.mjs");


function test1()
{
    console.log("test1 function - plain function, no object");
    console.log(test1.debug(arguments));
}

function test2(one, two)
{
    console.log("test2 function - plain function, no object");
    console.log(test2.debug(arguments));
}

console.log("#####################################################");
test1();
console.log("#####################################################");
test2()
console.log("#####################################################");
test2(1);
console.log("#####################################################");
test2(1,2);
console.log("#####################################################");
console.log("Calendar.testfunc(1,2,3) - static method");
console.log(Calendar.testfunc(1,2,3))
console.log("#####################################################");
console.log("Calendar.testfunc(1,2) - static method");
console.log(Calendar.testfunc(1,2))
console.log("#####################################################");
console.log("Calendar.testfunc(1,null,2) - static method");
console.log(Calendar.testfunc(1,null,3))
console.log("#####################################################");
var calendarObj = new Calendar('');
console.log("calendarObj.testfunc(1,2,3) - static method");
console.log(calendarObj.testfunc(1,2,3))
console.log("#####################################################");
console.log("calendarObj.testfunc(1,2) - static method");
console.log(calendarObj.testfunc(1,2))
console.log("#####################################################");
console.log("calendarObj.testfunc(1,null,2) - static method");
console.log(calendarObj.testfunc(1,null,3))
