    "use strict";

    class Calendar
    {
        DEFAULTSPAN = 365;
        DEFAULTSTART = Date.NewYears();
        DEFAULTEND = Date.NewYears().addDaysOffset(this.DEFAULTSPAN);

        constructor(divId, startDate = this.DEFAULTSTART, endDate = this.DEFAULTEND)
        {        
            this.myDivId = divId;
            this.myStartDate = new Date(startDate);
            this.myEndDate = new Date(endDate);
            this.weekOffset = 0;
            this.div = document.getElementById(divId);
            console.log("drawing calendar:", this);            
            if (this.div != null)
            {
                this.draw();
            }
            else
            {
                console.log("id #" + divId + " not found");
                return;
            }
        }

        insertDay(someDate)
        {            
            let day = document.createElement("div");
            day.id = someDate.toISODate();
            day.innerText = this.getCalendarStr(someDate);        
            day.classList.add("date");  
            
            let isSunday = someDate.getDay() === Date.SUNDAY;
            let isSaturday = someDate.getDay() === Date.SATURDAY;
            let isWeekend = isSaturday || isSunday;

            if (someDate.isBackdate)
            {
                day.classList.add("backdate");                
            }
            else
            {                
                if (isWeekend) 
                {
                    day.classList.add("weekend");                    
                }
                if (isSaturday) 
                {
                    day.classList.add("saturday");  
                }
                if (isSunday) 
                {
                    day.classList.add("sunday");
                }
            }            
                        
            if (isSunday) 
            {
                let bump = document.createElement("div");
                bump.classList.add("week");                
                this.div.appendChild(bump);
            }
            this.div.appendChild(day);
        }

        markWeeks(offset = 0)
        {
            let counter = 1;                            
            document.getElementsByClassName("week").forEach( (week) =>
            {
                week.innerText = "";
                week.classList = ["week"];
                if (counter > offset)
                {
                    let weeknumber = counter - offset;
                    let name = "week" + weeknumber.toDigits(2);
                    week.classList.add(name);
                    week.innerText = name;
                    week.setAttribute('data-week', weeknumber);                    
                }
                counter++;
            });
        }  

        showHolidays()
        {            
            Date.getFederalHolidays(this.myStartDate).forEach( (date) =>
            {
                configureElement(date.toISODate(), (calendarDate) =>
                {
                    calendarDate.classList.add("holiday");                    
                    calendarDate.innerText = calendarDate.innerText + " " + date.holidayName;                
                });                    
            });
        }

        draw()
        {
            this.div.innerHTML = "";
            let offset = this.myStartDate.getDay();
            if (offset != 0)
            {
                let offsetStart = new Date(this.myStartDate).nextDate(-offset);
                let offsetEnd = new Date(this.myStartDate).nextDate(-1);         
                for (let day of Date.getDaysInSpan(offsetStart, offsetEnd))
                {
                    day.isBackdate = true;                
                    this.insertDay(day);
                }
            }            
            for (let day of Date.getDaysInSpan(this.myStartDate, this.myEndDate))
            {                
                this.insertDay(day);
            }            

            this.markWeeks(0);                        
        }

        getCalendarStr = function(date)
        {
            if (date.holidayName == null) date.holidayName = "";
            let calendarStr = date.getWeekDay() + " " + date.getMonthStr() + " " + date.getDate() + ", " + date.getFullYear();
            return calendarStr;
        }        
    }
    
    attachConstant(Calendar, "DEFAULTSPAN", 365, false);
    attachConstant(Calendar, "DEFAULTSTART", Date.NewYears(), false);
    attachConstant(Calendar, "DEFAULTEND", Date.NewYears().addDaysOffset(this.DEFAULTSPAN), false);

    // makeReadonly(Calendar, "DEFAULTSPAN");
    // makeReadonly(Calendar, "DEFAULTSTART");
    // makeReadonly(Calendar, "DEFAULTEND");
    // console.log(JSON.stringify(new Calendar()));