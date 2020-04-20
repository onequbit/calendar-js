"use strict";

// 2012 Federal Pay Period 1 : 20120101
    
function main(event) 
{
    console.log(event);

    const calendarObj = new Calendar("calendar");
    
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

    configureElement("btnShowWeeks", (showWeeksButton) =>
    {            
        showWeeksButton.onclick = (event) =>
        {
            calendarObj.toggleWeeks();
            if (calendarObj.showWeeks)
            {
                showWeeksButton.classList.add('active');
                configureElement("spinnerWeekOffset", (spinner) =>
                {
                    spinner.style.visibility = 'visible';
                });
            }
            else
            {
                showWeeksButton.classList.remove('active');
                configureElement("spinnerWeekOffset", (spinner) =>
                {
                    spinner.style.visibility = 'hidden';
                }); 
            }                
        };
    });

    configureElement("btnShowHolidays", (showHolidaysButton) =>
    {            
        showHolidaysButton.onclick = (event) =>
        {
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

    configureElement("ppOffset", function(ppOffset)
    {            
        
        ppOffset.onchange = (event) =>
        {
            let value = event.target.valueAsNumber;
            calendarObj.markWeeks(value);
        };
    });

    configureElement("btnShowPayPeriods", (showPayPeriodsButton) =>
    {            
        showPayPeriodsButton.onclick = (event) =>
        {
            calendarObj.togglePayPeriods();
            if (calendarObj.showPayPeriods)
            {
                showPayPeriodsButton.classList.add('active');
            }
            else
            {
                showPayPeriodsButton.classList.remove('active');
            }
        };
    });
}

window.addEventListener("DOMContentLoaded", (event) =>
{ 
    main();
});
