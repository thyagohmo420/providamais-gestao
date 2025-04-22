import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onSelectDate: (date: Date) => void;
  onSelectSchedule: (schedule: Schedule) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  onSelectDate,
  onSelectSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Array para armazenar todos os dias do calendário
    const days: Date[] = [];
    
    // Adicionar dias do mês anterior para completar a primeira semana
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const prevMonthDay = new Date(year, month, 1 - i);
      days.push(prevMonthDay);
    }
    
    // Adicionar todos os dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentMonthDay = new Date(year, month, i);
      days.push(currentMonthDay);
    }
    
    // Adicionar dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push(nextMonthDay);
    }
    
    setCalendarDays(days);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const getSchedulesForDay = (date: Date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
  };

  const handleDayClick = (date: Date) => {
    onSelectDate(date);
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2" size={20} />
          {formatMonthYear(currentDate)}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={goToPreviousMonth}
            className="p-1"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="secondary"
            onClick={goToToday}
            className="px-3 py-1 text-sm"
          >
            Hoje
          </Button>
          <Button
            variant="secondary"
            onClick={goToNextMonth}
            className="p-1"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center py-2 font-medium text-gray-500 text-sm"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const daySchedules = getSchedulesForDay(day);
          const hasSchedules = daySchedules.length > 0;
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[80px] p-1 border border-gray-100 rounded-md cursor-pointer
                ${isCurrentMonth(day) ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                ${isToday(day) ? 'border-blue-500' : ''}
                hover:bg-blue-50 transition-colors
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center
                  ${isToday(day) ? 'bg-blue-500 text-white' : ''}
                `}>
                  {day.getDate()}
                </span>
                {hasSchedules && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    {daySchedules.length}
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1">
                {daySchedules.slice(0, 2).map((schedule, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSchedule(schedule);
                    }}
                    className={`
                      text-xs p-1 rounded truncate
                      ${schedule.shift === 'morning' ? 'bg-yellow-100 text-yellow-800' :
                        schedule.shift === 'afternoon' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'}
                    `}
                  >
                    {schedule.startTime} - {schedule.department}
                  </div>
                ))}
                {daySchedules.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{daySchedules.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCalendar;