import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types';
import { ChevronLeft, ChevronRight, Calendar, Filter, Search } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';

interface ScheduleCalendarViewProps {
  schedules: Schedule[];
  onSelectSchedule: (schedule: Schedule) => void;
}

const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  schedules,
  onSelectSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>(schedules);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  useEffect(() => {
    filterSchedules();
  }, [schedules, departmentFilter, sectorFilter, statusFilter, searchTerm]);

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

  const filterSchedules = () => {
    let filtered = [...schedules];
    
    if (departmentFilter) {
      filtered = filtered.filter(s => s.department === departmentFilter);
    }
    
    if (sectorFilter) {
      filtered = filtered.filter(s => s.sector === sectorFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.department?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term)
      );
    }
    
    setFilteredSchedules(filtered);
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
    return filteredSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'afternoon':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar escala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="secondary"
              icon={<Filter size={20} />}
              onClick={filterSchedules}
            >
              Filtrar
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Departamentos' },
                { value: 'Cardiologia', label: 'Cardiologia' },
                { value: 'Ortopedia', label: 'Ortopedia' },
                { value: 'Clínica Geral', label: 'Clínica Geral' },
                { value: 'UTI', label: 'UTI' },
                { value: 'Emergência', label: 'Emergência' },
              ]}
              className="w-48"
            />
            
            <Select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Setores' },
                { value: 'presencial', label: 'Presencial' },
                { value: 'telemedicina', label: 'Telemedicina' },
              ]}
              className="w-48"
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'scheduled', label: 'Agendado' },
                { value: 'completed', label: 'Concluído' },
                { value: 'cancelled', label: 'Cancelado' },
              ]}
              className="w-48"
            />
          </div>
        </div>
        
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
                className={`
                  min-h-[100px] p-1 border border-gray-100 rounded-md
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
                  {daySchedules.slice(0, 3).map((schedule, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectSchedule(schedule)}
                      className={`
                        text-xs p-1 rounded truncate border cursor-pointer
                        ${getShiftColor(schedule.shift)}
                        ${getStatusColor(schedule.status)}
                      `}
                    >
                      {schedule.startTime} - {schedule.department || 'Plantão'}
                    </div>
                  ))}
                  {daySchedules.length > 3 && (
                    <div className="text-xs text-center bg-gray-100 rounded p-1 cursor-pointer">
                      +{daySchedules.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-200"></div>
            <span className="text-sm">Manhã</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div>
            <span className="text-sm">Tarde</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-100 border border-purple-200"></div>
            <span className="text-sm">Noite</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Hoje</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendarView;