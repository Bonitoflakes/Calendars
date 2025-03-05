import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { buildCalendar } from "@marceloterreiro/flash-calendar";
import React, { useMemo } from "react";
import { CalendarDayMetadata } from "@marceloterreiro/flash-calendar";

import { View, Text, FlatList } from 'react-native'

const Horizontal = () => {
    const monthsList = useMemo(() => {
  const temp = [];
  for (let i = 0; i <= monthsToRender; i++) {
    const calendarMonthId = toDateId(addMonths(minDate || new Date(), i));
    temp.push(calendarMonthId);
  }
  return temp;
}, [monthsToRender, minDate]);

const calendarData = useMemo(
  () =>
    monthsList.map((calendarMonthId) => {
      const { calendarRowMonth, weekDaysList, weeksList } = buildCalendar({
        calendarMonthId,
        calendarFirstDayOfWeek: "monday",
      });

      return {
        calendarRowMonth,
        weekDaysList,
        weeksList,
      };
    }),
  [monthsList]
);

type TCalendarItem = {
  calendarRowMonth: string;
  weekDaysList: string[];
  weeksList: CalendarDayMetadata[][];
};

const renderItem = ({ item }: { item: TCalendarItem }) => {
  return <CalendarMonthItem item={item}  />;
};

const CalendarMonthItem = ({item}) => {
    return(


   <View >
        {item.weeksList.map(week, i) => {
              <Calendar.Row.Week 
                  theme={{
                      //play around
                  }}>
                 {week.map((day, nestedI) => {
                  <Calendar.Item.Day.Container 
                    //manyProps to play here
                  >
                      {Your Day Tile component}
                 </Calendar.Item.Day.Container>
                 })}
              </Calendar.Row.Week>
        }}
   </View>)
}

  return (
  <FlatList
    horizontal
    pagingEnabled
    bounces={false}
    windowSize={3}
    data={calendarData}
    renderItem={renderItem}
    getItemLayout={getItemLayout}
    showsHorizontalScrollIndicator={false}
    {...otherProps}
  />
)
}

export default Horizontal