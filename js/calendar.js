// class Day
// {
//     name = "";
//     date = 0;
//     calendarDate = Date();
//     weekIndex = 0;
//     constructor(someDate)
//     {
//         this.calendarDate = new Date(someDate);
//         this.name = Date.WEEKDAYS[this.calendarDate.getDay()];
//         this.weekIndex = Date.getWeek(this.calendarDate.getFullYear());
//     }
// }



class Calendar
{
    DEFAULTSPAN = 365;
    DEFAULTSTART = Date.NewYears();
    DEFAULTEND = Date.NewYears().addDaysOffset(this.DEFAULTSPAN);
    startDate = this.DEFAULTSTART;
    endDate = this.DEFAULTEND;
    showWeeks = true;
    showHolidays = false;
    weekOffset = 0;
    // showPayPeriods = false;
    dateSpan = this.DEFAULTSPAN;

    constructor(divId, start = this.DEFAULTSTART, end = this.DEFAULTEND, showHolidays = false)
                // showWeeks = false, , weekOffset = 0, showPayPeriods = false)
    {        
        this.myDivId = divId;    
        this.div = document.getElementById(this.myDivId);
      
        let startDate = getUrlParameter("start", new Date(start).toISODate());
        this.startDate = Date.fromISODate(startDate);
        let endDate = getUrlParameter("end", new Date(end).toISODate());
        this.endDate = Date.fromISODate(endDate);        
        this.dateSpan = Date.getDaysOffset(this.startDate, this.endDate);

        // this.weekOffset = parseInt(getUrlParameter("weekOffset", weekOffset));
        // this.showWeeks = getUrlParameter("showWeeks", showWeeks);
        this.showHolidays = getUrlParameter("showHolidays", showHolidays);
        //this.showPayPeriods = getUrlParameter("showPayPeriods", showPayPeriods);
        
        Object.defineProperty( this, 'DEFAULTSPAN', { writable: false } );
        Object.defineProperty( this, 'DEFAULTSTART', { writable: false } );
        Object.defineProperty( this, 'DEFAULTEND', { writable: false } );        

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

    fromUrlParameters()
    {
        
        return this;
    }

    insertDay(someDate)
    {            
        let day = document.createElement("div");
        day.id = someDate.toISODate();
        day.innerText = this.getCalendarStr(someDate);        
        day.classList.add("date");  

        if (someDate.isBackdate)
        {
            day.classList.add("backdate");                
        }
        else
        {                
            if (someDate.isWeekend) 
            {
                day.classList.add("weekend");                    
            }
            if (someDate.isSaturday) 
            {
                day.classList.add("saturday");  
            }
            if (someDate.isSunday) 
            {
                day.classList.add("sunday");
            }
        }
                    
        if (someDate.isSunday) 
        {
            let bump = document.createElement("div");
            bump.classList.add("week");

            if (this.showWeeks)
                bump.style.display = "block";
            else
                bump.style.display = "none";
            
            bump.setAttribute('date-week', Date.getWeek(someDate));
            bump.setAttribute('date-payperiod', Date.getPayPeriod(someDate));
            this.div.appendChild(bump);
        }

        if (someDate.isNewYears)
        {
            day.setAttribute('date-newyears', true);
            // if (someDate.isSunday) 
            //     day.setAttribute('date-week', 1);
        }
        
        day.setAttribute('date-year', someDate.getFullYear() );
        day.setAttribute('date-month', someDate.getMonthStr() );
        day.setAttribute('date-date', someDate.getDate() );

        this.div.appendChild(day);
        if (someDate.isSaturday)
        {
            let EOL = document.createElement("div");
            EOL.classList.add("EOL");
            this.div.appendChild(EOL);
            this.div.appendChild(document.createElement("br"));
            
        }
    }

    toggleWeeks()
    {
        this.showWeeks = !this.showWeeks;
            
        forElementClass("week", (week) =>
        {
            if (this.showWeeks)
                week.style.display = "initial";
            else
                week.style.display = "none";
        });            
    }

    markWeeks()
    {
        // forElementClass("week", (week) =>
        // {
        //     week.innerText = "";
            
        //     let weeknumber = week.getAttribute('date-week') | 0;                         
        //     let name = "week" + weeknumber.toDigits(2);
        //     week.classList.add(name);
        //     week.innerText = name;                
            
        // });
        forElementClass("week", (week) =>
        {
            week.innerText = "";            
            let payperiod = week.getAttribute('date-payperiod') | 0;                         
            let name = "PP" + payperiod.toDigits(2);
            week.classList.add(name);
            week.innerText = name;                                
        });            
    }          

    toggleHolidays()
    {
        this.showHolidays = !this.showHolidays;
        
        if (this.showHolidays)
        {
            Date.getFederalHolidays(this.startDate).forEach( (date) =>
            {
                configureElement(date.toISODate(), (calendarDate) =>
                {
                    calendarDate.classList.add("holiday");
                    calendarDate.setAttribute('data-oldInnerText', calendarDate.innerText);                    
                    calendarDate.innerText = calendarDate.innerText + " " + date.holidayName;                
                });                    
            });
        }
        else
        {
            forElementClass("date", (date) => 
            {
                if (date.classList.contains("holiday"))
                {
                    date.classList.remove("holiday");
                    date.innerText = date.getAttribute('data-oldInnerText');
                }
            }); 
        }          
    }


    draw()
    {
        this.div.innerHTML = "";
        let offset = this.startDate.getDay();
        if (offset != 0)
        {
            let offsetStart = new Date(this.startDate).nextDate(-offset);
            let offsetEnd = new Date(this.startDate).nextDate(-1);         
            for (let day of Date.getDaysInSpan(offsetStart, offsetEnd))
            {
                day.isBackdate = true;                
                this.insertDay(day);
            }
        }            
        for (let day of Date.getDaysInSpan(this.startDate, this.endDate))
        {                
            this.insertDay(day);
        }            

        this.markWeeks(this.weekOffset);                        
    }

    getCalendarStr(date)
    {
        if (date.holidayName == null) date.holidayName = "";
        let calendarStr = date.weekDay + " " + date.getMonthStr() + " " + date.getDate() + ", " + date.getFullYear();
        return calendarStr;
    }
    
    toUrlParameters()
    {
        var params = [
            "start=" + this.startDate.toISODate(),
            "end=" + this.endDate.toISODate(),
            "showHolidays=" + this.showHolidays
            // "weekOffset=" + this.weekOffset,
            // "showWeeks=" + this.showWeeks,            
            // "showPayPeriods=" + this.showPayPeriods
        ];
        return params.join('&');
    }

    setNewMonth(newMonth)
    {        
        this.startDate = new Date(this.startDate.getFullYear(),newMonth,1);
        this.endDate = new Date(this.startDate.nextDate(this.dateSpan));
    }

    setLastYear()
    {
        this.startDate = this.startDate.lastYear(); 
        this.endDate = new Date(this.startDate.nextDate(this.dateSpan));
    }

    setNextYear()
    {
        this.startDate = this.startDate.nextYear();
        this.endDate = new Date(this.startDate.nextDate(this.dateSpan));
    }

    static testfunc(arg1, arg2, arg3)
    {
        // var info = inspectFunction(this);
        // console.log("testfunc -> inspectFunction info: ", info);
        // var args = getFunctionArgs(this, arguments);
        // console.log("testfunc -> args:", args);
        return this.testfunc.debug(arguments);
    }

    testfunc(arg1, arg2, arg3)
    {
        // var info = inspectFunction(this);
        // console.log("testfunc -> inspectFunction info: ", info);
        // var args = getFunctionArgs(this, arguments);
        // console.log("testfunc -> args:", args);
        return this.testfunc.debug(arguments);
    }
}

// module.exports.Calendar = Calendar;
