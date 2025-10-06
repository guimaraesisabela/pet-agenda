import { theme } from "@/components/theme/theme";
import { useState } from "react";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["pt"] = {
  monthNames: [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ],
  monthNamesShort: [
    "Jan","Fev","Mar","Abr","Mai","Jun",
    "Jul","Ago","Set","Out","Nov","Dez"
  ],
  dayNames: [
    "Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"
  ],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt";

type CalendarPickerProps = {
  onDateSelect: (date: string) => void;
};

export function CalendarPicker({ onDateSelect }: CalendarPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
  };

  return (
    <Calendar
      onDayPress={handleDayPress}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: theme.colors.primary },
      }}
      firstDay={1} 
      theme={{
        todayTextColor: theme.colors.primary,
        arrowColor: theme.colors.primary,
        monthTextColor: theme.colors.text,
        textSectionTitleColor: theme.colors.text,
      }}
    />
  );
}
