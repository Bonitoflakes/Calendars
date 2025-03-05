import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SWIPE_THRESHOLD = 50;

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth((current) => addMonths(current, 1));
  }, []);

  const previousMonth = useCallback(() => {
    setCurrentMonth((current) => subMonths(current, 1));
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onFinalize((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(previousMonth)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(nextMonth)();
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Swipe left or right to change months</Text>
        </View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Pressable onPress={previousMonth} style={styles.navigationButton}>
                <ChevronLeft size={24} color="#007AFF" />
              </Pressable>
              <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.monthText}>
                {format(currentMonth, "MMMM yyyy")}
              </Animated.Text>
              <Pressable onPress={nextMonth} style={styles.navigationButton}>
                <ChevronRight size={24} color="#007AFF" />
              </Pressable>
            </View>

            <View style={styles.weekDays}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendar}>
              {days.map((date) => (
                <CalendarDay
                  key={date.toISOString()}
                  date={date}
                  isSelected={isSameDay(date, selectedDate)}
                  isCurrentMonth={isSameMonth(date, currentMonth)}
                  onSelect={handleDateSelect}
                />
              ))}
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            Selected: {format(selectedDate, "MMMM do, yyyy")}
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function CalendarDay({
  date,
  isSelected,
  isCurrentMonth,
  onSelect,
}: {
  date: Date;
  isSelected: boolean;
  isCurrentMonth: boolean;
  onSelect: (date: Date) => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    if (isSelected) {
      console.log("IsSelected", isSelected);
      return {
        // backgroundColor: withSpring(isSelected ? "blue" : "transparent"),
        backgroundColor: "blue",
      };
    }
    return {
      transform: [{ scale: 1 }],
      backgroundColor: "transparent",
    };
  }, [isSelected]);

  return (
    <AnimatedPressable onPress={() => onSelect(date)} style={[styles.day, animatedStyle]}>
      <Text
        style={[
          styles.dayText,
          !isCurrentMonth && styles.otherMonthDay,
          isSelected && styles.selectedDayText,
        ]}
      >
        {format(date, "d")}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navigationButton: {
    padding: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
  },
  day: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  otherMonthDay: {
    color: "#ccc",
  },
  selectedDayText: {
    color: "#fff",
  },
  selectedDateContainer: {
    padding: 20,
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
});
