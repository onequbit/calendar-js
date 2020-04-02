    "use strict";
    
    (function() {
        var CONSTANTS = {
            SUNDAY : 0,
            MONDAY : 1,
            TUESDAY : 2,
            WEDNESDAY : 3,
            THURSDAY : 4,
            FRIDAY : 5,
            SATURDAY : 6,
            JANUARY : 0,
            FEBRUARY : 1,
            MARCH : 2,
            APRIL : 3,
            MAY : 4,
            JUNE : 5,
            JULY : 6,
            AUGUST : 7,
            SEPTEMBER : 8,
            OCTOBER : 9,
            NOVEMBER : 10,
            DECEMBER : 11,
            MONTHS : ["January","February","March","April","May","June","July","August","September","October","November","December"],
            WEEKDAYS : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            DAY : 86400000,
            WEEK : 604800000,
            BIWEEK : 1209600000,
            YEAR : 31536000000
        };

        for (var key in CONSTANTS)
        {            
            attachConstant(Date, key, CONSTANTS[key], false);
        }

    })();

    Date.thisYear = function()
    {
        return new Date().getFullYear();
    }

    Date.prototype.lastYear = function()
    {
        let newDate = new Date(this);
        newDate.setFullYear(this.getFullYear() - 1);
        return new Date(newDate);
    }

    Date.prototype.nextYear = function()
    {
        let newDate = new Date(this);
        newDate.setFullYear(this.getFullYear() + 1);
        return new Date(newDate);
    }

    Date.prototype.getWeekDay = function()
    {        
        return Date.WEEKDAYS[this.getDay()];
    }

    Date.prototype.nextDate = function(days = 1)
    {
        let newDate = new Date(this);
        newDate.setDate(this.getDate()+days);
        return newDate;        
    }
    
    Date.daysInMonth = function*(year = Date.thisYear(), month)
    {
        let day = new Date(year, month, 1);
        while (day.getMonth() == month)
        {            
            yield day;
            day = day.nextDate();
        }        
    }

    Date.nthDayOfMonth = function(count, day, month, year = Date.thisYear(), name = "")
    {
        let counter = 0;
        for (let date of Date.daysInMonth(year, month))
        {
            if (date.getWeekDay() == Date.WEEKDAYS[day]) counter++;
            if (counter == count) return date;
        }        
    }

    Date.lastDayOfMonth = function(day, month, year = Date.thisYear(), name = "")
    {
        let list = [];
        for (let date of Date.daysInMonth(year, month))
        {
            if (date.getWeekDay() == Date.WEEKDAYS[day]) list.push(date);            
        }
        let date = list.pop();
        date.holidayName = name;
        return date;
    }
    
    Date.findSetHoliday = function(month, date, year = Date.thisYear(), name = "")
    {        
        let holiday = new Date(year, month, date);
        if (holiday.getDay() == Date.SATURDAY)
        {
            holiday = holiday.nextDate(-1);            
        }
        else if (holiday.getDay() == Date.SUNDAY)
        {
            holiday = holiday.nextDate();
        }
        holiday.holidayName = name;
        return holiday; 
    }

    Date.NewYears = function(year = Date.thisYear())
    {
        let newDate = new Date(year, Date.JANUARY, 1);        
        newDate.holidayName = "New Year's Day"
        return newDate;        
    }
    
    Date.getFederalHolidays = function(startDate = Date.NewYears())
    {
        let calendarYear = (month) => 
        {
            if (month < startDate.getMonth()) 
                return startDate.getFullYear() + 1;
            else
                return startDate.getFullYear();
        }

        return [
            Date.NewYears( calendarYear( Date.JANUARY )),
            Date.nthDayOfMonth( 3, Date.MONDAY, Date.JANUARY, calendarYear(Date.JANUARY), "Martin Luther King's Birthday"),
            Date.nthDayOfMonth( 3, Date.MONDAY, Date.FEBRUARY, calendarYear(Date.FEBRUARY), "President's Day"),
            Date.lastDayOfMonth( Date.MONDAY, Date.MAY, calendarYear(Date.MAY), "Memorial Day"),
            Date.findSetHoliday( Date.JULY, 4, calendarYear(Date.JULY), "Independence Day"),
            Date.nthDayOfMonth( 1, Date.MONDAY, Date.SEPTEMBER, calendarYear(Date.SEPTEMBER), "Labor Day"),
            Date.nthDayOfMonth( 2, Date.MONDAY, Date.OCTOBER, calendarYear(Date.OCTOBER), "Columbus Day"),
            Date.findSetHoliday( Date.NOVEMBER,11, calendarYear(Date.NOVEMBER), "Veteran's Day"),
            Date.nthDayOfMonth( 4, Date.THURSDAY, Date.NOVEMBER, calendarYear(Date.NOVEMBER), "Thanksgiving Day"),
            Date.findSetHoliday( Date.DECEMBER, 25, calendarYear(Date.DECEMBER), "Christmas Day")
        ];
    }

    Date.getDaysOffset = function(start, end)
    {
        return Math.round( (end - start) / Date.DAY );
    }

    Date.getDaysInSpan = function*(start, end)
    {                
        let backwards = end < start;
        if (backwards)
        {
            let day = new Date(end);
            while (day <= start)
            {            
                yield day;
                day = day.nextDate();
            }
        }
        else
        {
            let day = new Date(start);
            while (day <= end)
            {            
                yield day;
                day = day.nextDate();
            }
        }         
    }

    Date.prototype.addDaysOffset = function(days)
    {        
        return new Date(this).nextDate(days);        
    }
    
    Date.prototype.getMonthStr = function()
    {        
        return Date.MONTHS[this.getMonth()];
    }

    Date.prototype.toISODateStr = function()
    {
        return this.toISOString().split('T')[0];
    }

    Date.prototype.toISODate = function()
    {
        return this.toISODateStr().replace(/-/g,'');        
    }
    
    Date.fromISODate = function(str)
    {
        let newDate = null;
        const not_a_number = str == null || str == "" || ( /^\d+$/.test(str) === false );            
        if (not_a_number) return null;        
        try
        {
            if (str.length != 8) return null;

            let year = str.substr(0,4);
            newDate = new Date(year, Date.JANUARY,1);
            if (str.length > 4)
            {
                let month = parseInt(str.substr(4,2))-1;
                newDate.setMonth(month);
            }            
            if (str.length == 8)
            {
                let date = str.substr(6,2);
                newDate.setDate(date);
            }                 
        }
        catch (exception)
        {
            console.log(exception); 
            console.log(newDate);           
        }                
        return newDate;
    }

    Date.MonthDropDown = function(elementId, selectedIndex, onChangeFunction)
    {
        configureElement(elementId, (dropDown) =>
        {
            Date.MONTHS.forEach( (month, index) =>
            {            
                let newMonth = document.createElement("option");
                newMonth.value = index;
                newMonth.text = month;
                newMonth.classList.add("month_choice");
                dropDown.appendChild(newMonth);
            });   
            dropDown.selectedIndex = selectedIndex;

            dropDown.onchange = onChangeFunction;
        });
    }

    