import { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getTodayDate: () => string;
  goToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
}

const DateContext = createContext<DateContextType>({
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: () => {},
  getTodayDate: () => new Date().toISOString().split('T')[0],
  goToToday: () => {},
  goToPreviousDay: () => {},
  goToNextDay: () => {},
});

export function useDate() {
  return useContext(DateContext);
}

interface DateProviderProps {
  children: ReactNode;
}

export function DateProvider({ children }: DateProviderProps) {
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const goToToday = () => {
    setSelectedDate(getTodayDate());
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    const today = getTodayDate();
    const nextDay = date.toISOString().split('T')[0];
    if (nextDay <= today) {
      setSelectedDate(nextDay);
    }
  };

  return (
    <DateContext.Provider value={{
      selectedDate,
      setSelectedDate,
      getTodayDate,
      goToToday,
      goToPreviousDay,
      goToNextDay,
    }}>
      {children}
    </DateContext.Provider>
  );
}
