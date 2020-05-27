"use strict";

// 2012 Federal Pay Period 1 : 20120101
    
function main(event) 
{
    if (event) console.log(event);

    window.calendarObj = new Calendar("calendar");    
    
    configureElement("selectMonth", (selectMonth) => 
    {
        selectMonth = new Date.MonthDropDown("selectMonth", calendarObj.startDate.getMonth(), (event) =>
        {            
            let month = event.target.selectedIndex;
            calendarObj.setNewMonth(month);                                         
            doRedirect(calendarObj.toUrlParameters());
        });    
    });

    document.getElementById("currentYear").innerText = calendarObj.startDate.toISODateStr();

    configureElement("btnLastYear", (lastYearButton) =>
    {                
        lastYearButton.innerText = calendarObj.startDate.lastYear().toISODateStr();
        lastYearButton.onclick = () =>
        {
            calendarObj.setLastYear();
            doRedirect(calendarObj.toUrlParameters());
        }
    });
    
    configureElement("btnNextYear", (nextYearButton) =>
    {

        nextYearButton.innerText = calendarObj.startDate.nextYear().toISODateStr();
        nextYearButton.onclick = (event) =>
        {
            calendarObj.setNextYear();
            doRedirect(calendarObj.toUrlParameters());
        };
    });

    document.getElementById("btnShowHolidays").classList.add('active');

    configureElement("btnShowHolidays", (showHolidaysButton) =>
    {       
        showHolidaysButton.onclick = (event) =>
        {
            console.log("holidays button clicked");
            calendarObj.toggleHolidays();
            if (calendarObj.showHolidays)
            {
                showHolidaysButton.classList.add('active');
            }
            else
            {
                showHolidaysButton.classList.remove('active');
            }
        };
    });
    
}

window.addEventListener("DOMContentLoaded", (event) =>
{ 
    main();
});
