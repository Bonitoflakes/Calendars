import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";

import { View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { addMonths, subMonths } from "date-fns";
import { CalendarListDemo } from "./list";

const today = toDateId(new Date());
const SWIPE_THRESHOLD = 50;

const FlashCalendar = () => {
  return <CalendarListDemo />;
};

const DemoOne = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  const nextMonth = useCallback(() => {
    setSelectedDate((current) => toDateId(addMonths(current, 1)));
  }, []);

  const previousMonth = useCallback(() => {
    setSelectedDate((current) => toDateId(subMonths(current, 1)));
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onFinalize((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        console.log("Running finalize");
        runOnJS(previousMonth)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(nextMonth)();
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <View className="grow bg-white">
          <Calendar.List
            // horizontal
            calendarActiveDateRanges={[
              {
                startId: selectedDate,
                endId: selectedDate,
              },
            ]}
            calendarInitialMonthId={selectedDate}
            // calendarMonthId={selectedDate}
            onCalendarDayPress={setSelectedDate}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default FlashCalendar;
