import React, {useEffect, useState} from 'react'

//component
import DayBox from "./DayBox/DayBox"

//classes
import classes from "./MainCalendar.css"


//the only date format throughtout the application
//"DD MM YYYY" - all string
const MainCalendar = (props) => {

    const [DateData, setDateData] = useState(null)
    const [previewData, setPreviewData] = useState(null)

    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(() => {

        let date = new Date()
        let year = date.getFullYear() 
        let month = date.getMonth() //Jan is 0 & december is 11
        
        setDateData({
            type: "date",
            data: {
                year: year,
                month: month,
                events: []
            }
        })

    }, [])

    

    useEffect(()=>{

        if(DateData){
            if(DateData.type === "date"){

                let firstDate = new Date(DateData.data.year, DateData.data.month, 1)

                let dateArray = []
                let starting_date = firstDate

                if(firstDate[0] !== 0){
                    //first day is not sunday
                    starting_date = new Date(DateData.data.year, DateData.data.month, 1-firstDate.getDay())
                }

                for(let i=0; i<42; i++){

                  let searchDateFormat = `${GET_DATE_IN_ARRAY(starting_date)[1]}-${GET_DATE_IN_ARRAY(starting_date)[2]}-${GET_DATE_IN_ARRAY(starting_date)[3]}`
                    dateArray.push({
                        status: [],   //current, selected
                        // date: starting_date,
                        date: GET_DATE_IN_ARRAY(starting_date),
                        event: false,
                    })

                    //going to next day
                    starting_date.setDate(starting_date.getDate()+1, starting_date.getMonth(), starting_date.getFullYear())
                }
                

                setPreviewData({
                    type: DateData.type,
                    current_month_index: firstDate.getMonth(), //index from 0
                    date_data: dateArray
                })

                // type: 
                // current_month_index :
                // date_data: [
                //     {date, event},
                //     {date, event}
                // ]
                
            }else if(DateData.type === "month"){

              setPreviewData({
                  type: DateData.type,
                  current_year_index: DateData.data.year,
              })

              // type: 
              // current_year_index :
              
          }else if(DateData.type === "year"){
          
            setPreviewData({
              type: DateData.type,
              current_year_range: {
                starting: DateData.data.yearStart,
                ending: DateData.data.yearEnd,
                event: [],
              },
              yearArray: Array(DateData.data.yearEnd - DateData.data.yearStart + 1).fill().map((_, idx) => DateData.data.yearStart + idx)
          })

              // type: 
              // current_year_index :
              
          }
        }

    }, [DateData, props.Event])

    const ChangeHandler = (direction) => {
      
      if(DateData.type === "date")
      setDateData((prev) => {
        let Year = prev.data.year;
        let Month = prev.data.month;

        if (direction === "back") {
          if (Month === 0) {
            Year--;
            Month = 11;
          } else {
            Month--;
          }
        } else if (direction === "next") {
          if (Month === 11) {
            Year++;
            Month = 0;
          } else {
            Month++;
          }
        }
        return {
          type: "date",
          data: {
            year: Year,
            month: Month,
            events: [],
          },
        };
      })
      else if(DateData.type === "month")
      setDateData((prev) => {
        let Year = prev.data.year;

        if (direction === "back") {
            Year--;
        } else if (direction === "next") {
            Year++;          
        }
        return {
          type: "month",
          data: {
            year: Year,
            events: [],
          },
        };
      })
      else if(DateData.type === "year")
        setDateData((prev) => {
          let Year = prev.middle_year;
          if (direction === "back") {
              Year = Year-12;
          } else if (direction === "next") {
              Year = Year+12;          
          }
          return {
            type: "year",
            middle_year: Year,
            data: {
                yearStart: Year-5,
                yearEnd: Year+6 ,
                events: []
            }
          };
        })
    };

    const switchHandler = () => {
      if(DateData.type === "date"){
        setDateData(prev=>({
            type: "month",
            data: {
                year: prev.data.year,
                events: []
            }
        }))

      }else if(DateData.type === "month"){
        setDateData({
            type: "year",
            middle_year: DateData.data.year,
            data: {
                yearStart: DateData.data.year-5,
                yearEnd: DateData.data.year+6 ,
                events: []
            }
        })

      }
    }

    /// select specifif date or month or year
    const selectHandler = (dateArray) => {
      if(DateData.type === "date"){
        setSelectedDate(dateArray)
        props.selectDateHandler(dateArray)
      }
      else if(DateData.type === "month"){
        setDateData(prev=>({
            type: "date",
            data: {
                year: DateData.data.year,
                month: dateArray[1],
                events: []
            }
        }))
      }
      else if(DateData.type === "year"){
        setDateData(prev=>({
            type: "month",
            data: {
                year: dateArray[1],
                events: []
            }
        }))
      }
    }

    let DateSequence = "";
    let current_date = GET_DATE_IN_ARRAY(new Date()) // to test the current date
    if(previewData && previewData.type === "date"){


        DateSequence = (
          <div className={classes.dateValue}>
            {previewData &&
              previewData.date_data.map((data, index) => {
                return (
                  <DayBox
                    key={index}
                    dateValue={data.date}
                    fade={
                      (data.date[2] === previewData.current_month_index) ? false : true //comparing month
                    }
                    current={
                      current_date[1] === data.date[1] &&
                      current_date[2] === data.date[2] &&
                      current_date[3] === data.date[3]
                    }
                    selected={
                      selectedDate && (
                      selectedDate[1] === data.date[1] &&
                      selectedDate[2] === data.date[2] &&
                      selectedDate[3] === data.date[3])
                    }
                    event={data.event}
                    selectClick={selectHandler}
                  />
                );
              })}
          </div>
        )
    }else if(previewData && previewData.type === "month"){

      DateSequence = <div className={classes.monthValue}>
          {previewData &&
            Array(12).fill(0).map((data, index) => {
              return (
                <DayBox
                  key={index}
                  dateValue={[previewData.current_year_index, index]}
                  Month
                  current={
                    current_date[2] === index &&
                    current_date[3] === previewData.current_year_index
                  }
                  selectClick={selectHandler}
                />
              );
            })}
        </div>
    }else if(previewData && previewData.type === "year"){
      DateSequence = <div className={classes.yearValue}>
          {previewData &&
            previewData.yearArray.map((data, index) => {
              return (
                <DayBox
                  key={index}
                  dateValue={[index, data]}
                  Year
                  current={
                    current_date[3] === data
                  }
                  selectClick={selectHandler}
                />
              );
            })}
        </div>
    }

    return (
        
        <div className={classes.MainCalendar}> 
            <div className={classes.controller}>
                <button className={classes.skip} onClick={()=>ChangeHandler("back")}> <i className="fas fa-caret-left" ></i> </button>
                {DateData && <div className={classes.type} onClick={switchHandler}> {`${DateData.type === "date" ? (`${GET_FULL_MONTH(DateData.data.month)}, ${DateData.data.year}`) : (`${DateData.type === "month" ? (`${DateData.data.year}`) : (`${DateData.data.yearStart}-${DateData.data.yearEnd}`)}`)}`} </div>}
                <button className={classes.skip} onClick={()=>ChangeHandler("next")}> <i className="fas fa-caret-right" ></i> </button>
            </div>
            <div className={classes.datePart}>
                {DateData && DateData.type === "date" && 
                <div className={classes.dayPart}>
                    <ul>
                        <li>SUN</li>
                        <li>MON</li>
                        <li>TUE</li>
                        <li>WED</li>
                        <li>THU</li>
                        <li>FRI</li>
                        <li>SAT</li>
                    </ul>
                </div>}
                {DateData && DateSequence}
            </div>
        </div>
    )
}

export default MainCalendar


export const GET_DATE_IN_ARRAY = (date) => {
    //date format 
    //Tue Aug 31 2021 00:00:00 GMT+0530 (India Standard Time)
    // [0/sun, 0/jan, full normal]
    return [date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()];
}

export const GET_DATE_IN_OBJ = (array) => {
    //get [year, month, day] --> object
    return new Date(array[3], array[2], array[1])
}

export const GET_FULL_DAY = (day_index) => {
    switch(day_index){
        case 0:
            return "SUN";            
        case 1:
            return "MON";
        case 2:
            return "TUE";
        case 3:
            return "WED";
        case 4:
            return "THU";
        case 5:
            return "FRI";
        case 6:
            return "SAT";
    }
}
export const GET_FULL_MONTH = (month_index) => {
    switch (month_index) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
}