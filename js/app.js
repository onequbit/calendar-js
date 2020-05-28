"use strict";

// 2012 Federal Pay Period 1 : 20120101
    
function main(event) 
{
    if (event) console.log(event);

    configureElement("input_date_start", (input_date_start) =>
    {
        input_date_start.value = Date.NewYears().toISODateStr();
    });

    configureElement("input_date_end", (input_date_end) =>
    {
        input_date_end.value = Date.NewYears().nextYear().toISODateStr();
    });

    window.calendarObj = new Calendar("calendar");    
    
    configureElement("selectMonth", (selectMonth) => 
    {
        selectMonth = new Date.MonthDropDown("selectMonth", calendarObj.startDate.getMonth(), (event) =>
        {            
            let month = event.target.selectedIndex;
            calendarObj.setNewMonth(month);                                         
            calendarObj.draw(); // doRedirect(calendarObj.toUrlParameters());
        });    
    });

    document.getElementById("currentYear").innerText = calendarObj.startDate.toISODateStr();

    configureElement("btnLastYear", (lastYearButton) =>
    {                
        lastYearButton.innerText = calendarObj.startDate.lastYear().toISODateStr();
        lastYearButton.onclick = () =>
        {
            calendarObj.setLastYear();
            calendarObj.draw(); // doRedirect(calendarObj.toUrlParameters());
        }
    });
    
    configureElement("btnNextYear", (nextYearButton) =>
    {

        nextYearButton.innerText = calendarObj.startDate.nextYear().toISODateStr();
        nextYearButton.onclick = (event) =>
        {
            calendarObj.setNextYear();
            calendarObj.draw(); // doRedirect(calendarObj.toUrlParameters());
        };
    });

    configureElement("btnHome", (homeButton) =>
    {       
        homeButton.onclick = (event) =>
        {
            calendarObj.draw(); // doRedirect([""]);            
        };
    });
    
}

window.addEventListener("DOMContentLoaded", (event) =>
{ 
    main();
});
