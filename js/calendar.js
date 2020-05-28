
class Calendar
{
    constructor(divId, start, end, showHolidays = true)                
    {   
        this.myDivId = divId;    
        this.div = document.getElementById(this.myDivId);

        this.DEFAULTSTART = Date.NewYears();
        this.DEFAULTEND = Date.NewYears().nextYear();
        this.DEFAULTSPAN = 365;                
                
        this.startDate = Date.fromISODate(getUrlParameter("start", start || this.DEFAULTSTART.toISODate()));                
        this.endDate = Date.fromISODate(getUrlParameter("end", end || this.DEFAULTEND.toISODate()));        
        this.dateSpan = Date.getDaysOffset(this.startDate, this.endDate);        
        
        this.showHolidays = showHolidays || getUrlParameter("showHolidays", true);

        this.focusDate = this.getPayPeriodFocus();
        
        Object.defineProperty( this, 'DEFAULTSPAN', { writable: false } );
        Object.defineProperty( this, 'DEFAULTSTART', { writable: false } );
        Object.defineProperty( this, 'DEFAULTEND', { writable: false } );        

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
            let payperiod = Date.getPayPeriod(someDate);
            bump.id = "PP" + payperiod;
            bump.classList.add("week");
            let weekNumber = Date.getWeek(someDate);
            if (weekNumber % 2 == 0) bump.id += "_";                    
            bump.setAttribute('date-week', weekNumber);
            bump.setAttribute('date-payperiod', payperiod);
            this.div.appendChild(bump);
        }

        if (someDate.isNewYears)
        {
            day.setAttribute('date-newyears', true);            
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

    markWeeks()
    {        
        forElementClass("week", (week) =>
        {
            week.innerText = "";            
            let payperiod = week.getAttribute('date-payperiod') | 0;                         
            let name = "PP" + payperiod.toDigits(2);
            week.classList.add(name);
            week.innerText = name;                                
        });            
    }
    
    setHolidays()
    {
        Date.getFederalHolidays(this.startDate).forEach((holiday) =>
        {
            configureElement(holiday.toISODate(), (holidayDate) =>
            {
                let marker = document.createElement("div");
                marker.classList.add("holiday");                
                marker.innerText = holiday.holidayName;
                holidayDate.innerHTML = holidayDate.innerHTML + "&nbsp;<br/>";
                holidayDate.appendChild(marker);
            });                    
        });
    }

    toggleHolidays()
    {
        this.showHolidays = !(this.showHolidays);
        forElementClass("holiday", (holiday) =>
        {            
            if (this.showHolidays)
                holiday.style.display = "block";
            else
                holiday.style.display = "none";            
        });        
        
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
        this.markWeeks();                        
        this.setHolidays();        
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

    getPayPeriodFocus()
    {
        return "PP" + Date.getPayPeriod(new Date()).toDigits(2);
    }
}
