import { View, Text } from "react-native";
import React from "react";
import { Calendar } from "@marceloterreiro/flash-calendar";

const NormalCalendar = () => {
  return (
    <View>
      <Calendar>
        <Calendar.Row.Month height={20}>Hello World</Calendar.Row.Month>
        <Calendar.Row.Week>
          <Calendar.Item.WeekName height={20}>Hi</Calendar.Item.WeekName>
        </Calendar.Row.Week>
      </Calendar>
    </View>
  );
};

export default NormalCalendar;
