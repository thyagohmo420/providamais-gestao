import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Schedule } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SchedulesState {
  schedules: Schedule[];
  filteredSchedules: Schedule[];
  currentSchedule: Schedule | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  
  // Ações
  fetchSchedules: (page?: number, limit?: number) => Promise<void>;
  getSchedule: (id: string) => Promise<void>;
  createSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  
  // Filtros
  filterSchedules: (filters: ScheduleFilters) => void;
  clearFilters: () => void;
  
  // Relatórios
  generateReport: (format: 'pdf' | 'excel' | 'csv', dateRange: DateRange) => Promise<string>;
  
  // Candidaturas
  applyCandidacy: (scheduleId: string, userId: string) => Promise<void>;
  approveCandidacy: (candidacyId: string) => Promise<void>;
  rejectCandidacy: (candidacyId: string) => Promise<void>;
  
  // Check-in/Check-out
  registerCheckIn: (scheduleId: string, time: string, observations?: string) => Promise<void>;
  registerCheckOut: (scheduleId: string, time: string, observations?: string) => Promise<void>;
  
  // Notificações
  sendNotifications: (scheduleIds: string[]) => Promise<void>;
}

export interface ScheduleFilters {
  userId?: string;
  department?: string;
  shift?: string;
  status?: string;
  dateRange?: DateRange;
  location?: string;
  sector?: 'presencial' | 'telemedicina';
}

export type DateRange = 
  | '24h' 
  | '7d' 
  | '30d' 
  | '60d' 
  | '90d' 
  | 'custom';

export const useSchedulesStore = create<SchedulesState>((set, get) => ({
  schedules: [],
  filteredSchedules: [],
  currentSchedule: null,
  loading: false,
  error: null,
  totalCount: 0,

  fetchSchedules: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      // Primeiro, obter a contagem total
      const { count, error: countError } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Depois, obter as escalas com paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .range(from, to)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Se não houver dados, criar alguns dados de exemplo
      let scheduleData = data;
      if (!data || data.length === 0) {
        // Dados de exemplo para demonstração
        scheduleData = [
          {
            id: '1',
            userId: 'user1',
            date: new Date().toISOString().split('T')[0],
            shift: 'morning',
            department: 'Cardiologia',
            status: 'scheduled',
            startTime: '07:00',
            endTime: '13:00',
            duration: 6,
            value: 800,
            location: '1', // UMS Juquitiba
            sector: 'presencial',
            professionalType: '1', // PJ - Clínica Geral
            specialty: 'clinica_geral',
            isFixed: true,
            candidacyEnabled: false
          },
          {
            id: '2',
            userId: 'user2',
            date: new Date().toISOString().split('T')[0],
            shift: 'afternoon',
            department: 'Ortopedia',
            status: 'scheduled',
            startTime: '13:00',
            endTime: '19:00',
            duration: 6,
            value: 800,
            location: '1', // UMS Juquitiba
            sector: 'telemedicina',
            professionalType: '3', // PJ - Cardiologia
            specialty: 'cardiologia',
            isFixed: false,
            candidacyEnabled: true,
            candidacyGroups: ['doctors', 'specialists']
          },
          {
            id: '3',
            userId: 'user3',
            date: new Date().toISOString().split('T')[0],
            shift: 'night',
            department: 'UTI',
            status: 'scheduled',
            startTime: '19:00',
            endTime: '07:00',
            duration: 12,
            value: 1200,
            location: '2', // UMS São Paulo
            sector: 'presencial',
            professionalType: '2', // CLT - Enfermagem
            specialty: 'enfermagem',
            isFixed: true,
            candidacyEnabled: false
          },
          {
            id: '4',
            userId: 'user4',
            date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            shift: 'morning',
            department: 'Emergência',
            status: 'scheduled',
            startTime: '07:00',
            endTime: '13:00',
            duration: 6,
            value: 900,
            location: '3', // UMS Campinas
            sector: 'presencial',
            professionalType: '4', // Autônomo - Pediatria
            specialty: 'pediatria',
            isFixed: false,
            candidacyEnabled: true,
            candidacyGroups: ['doctors']
          },
          {
            id: '5',
            userId: 'user5',
            date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
            shift: 'afternoon',
            department: 'Clínica Geral',
            status: 'completed',
            startTime: '13:00',
            endTime: '19:00',
            duration: 6,
            value: 750,
            location: '2', // UMS São Paulo
            sector: 'telemedicina',
            professionalType: '1', // PJ - Clínica Geral
            specialty: 'clinica_geral',
            isFixed: true,
            checkInTime: '13:05',
            checkOutTime: '19:10',
            candidacyEnabled: false
          }
        ];
      }
      
      set({ 
        schedules: scheduleData as Schedule[], 
        filteredSchedules: scheduleData as Schedule[],
        totalCount: count || scheduleData.length,
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getSchedule: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentSchedule: data as Schedule, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createSchedule: async (schedule) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert([schedule])
        .select();
      
      if (error) throw error;
      
      const newSchedule = data[0] as Schedule;
      set(state => ({ 
        schedules: [newSchedule, ...state.schedules],
        filteredSchedules: [newSchedule, ...state.filteredSchedules],
        loading: false,
        totalCount: state.totalCount + 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateSchedule: async (id, schedule) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(schedule)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      const updatedSchedule = data[0] as Schedule;
      set(state => ({
        schedules: state.schedules.map(s => s.id === id ? updatedSchedule : s),
        filteredSchedules: state.filteredSchedules.map(s => s.id === id ? updatedSchedule : s),
        currentSchedule: state.currentSchedule?.id === id ? updatedSchedule : state.currentSchedule,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        schedules: state.schedules.filter(s => s.id !== id),
        filteredSchedules: state.filteredSchedules.filter(s => s.id !== id),
        currentSchedule: state.currentSchedule?.id === id ? null : state.currentSchedule,
        loading: false,
        totalCount: state.totalCount - 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  filterSchedules: (filters) => {
    const { schedules } = get();
    let filtered = [...schedules];
    
    // Filtro por usuário
    if (filters.userId) {
      filtered = filtered.filter(s => s.userId === filters.userId);
    }
    
    // Filtro por departamento
    if (filters.department) {
      filtered = filtered.filter(s => s.department === filters.department);
    }
    
    // Filtro por turno
    if (filters.shift) {
      filtered = filtered.filter(s => s.shift === filters.shift);
    }
    
    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    
    // Filtro por localização (unidade de saúde)
    if (filters.location) {
      filtered = filtered.filter(s => s.location === filters.location);
    }
    
    // Filtro por setor
    if (filters.sector) {
      filtered = filtered.filter(s => s.sector === filters.sector);
    }
    
    // Filtro por data
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.dateRange) {
        case '24h':
          startDate = new Date(now.setHours(now.getHours() - 24));
          break;
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '60d':
          startDate = new Date(now.setDate(now.getDate() - 60));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          startDate = new Date(0); // Data mínima
      }
      
      filtered = filtered.filter(s => {
        const scheduleDate = s.date ? new Date(s.date) : null;
        return scheduleDate && scheduleDate >= startDate;
      });
    }
    
    set({ filteredSchedules: filtered });
  },

  clearFilters: () => {
    const { schedules } = get();
    set({ filteredSchedules: schedules });
  },

  generateReport: async (format, dateRange) => {
    set({ loading: true, error: null });
    try {
      // Aqui seria a lógica para gerar o relatório no formato especificado
      // Por enquanto, vamos simular um atraso e retornar uma URL fictícia
      
      // Aplicar filtro de data
      const { schedules } = get();
      let filtered = [...schedules];
      
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case '24h':
          startDate = new Date(now.setHours(now.getHours() - 24));
          break;
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '60d':
          startDate = new Date(now.setDate(now.getDate() - 60));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          startDate = new Date(0); // Data mínima
      }
      
      filtered = filtered.filter(s => {
        const scheduleDate = s.date ? new Date(s.date) : null;
        return scheduleDate && scheduleDate >= startDate;
      });
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: ptBR });
      const fileName = `relatorio_escalas_${timestamp}.${format}`;
      
      set({ loading: false });
      
      // Em uma implementação real, retornaríamos a URL para download do arquivo
      return `/reports/${fileName}`;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return '';
    }
  },
  
  applyCandidacy: async (scheduleId, userId) => {
    set({ loading: true, error: null });
    try {
      // Simulação de candidatura
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  approveCandidacy: async (candidacyId) => {
    set({ loading: true, error: null });
    try {
      // Simulação de aprovação
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  rejectCandidacy: async (candidacyId) => {
    set({ loading: true, error: null });
    try {
      // Simulação de rejeição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  registerCheckIn: async (scheduleId, time, observations) => {
    set({ loading: true, error: null });
    try {
      const { schedules } = get();
      const schedule = schedules.find(s => s.id === scheduleId);
      
      if (!schedule) throw new Error('Escala não encontrada');
      
      const updatedSchedule = {
        ...schedule,
        checkInTime: time,
        observations: observations ? 
          (schedule.observations || '') + '\n\nCheck-in: ' + observations : 
          schedule.observations
      };
      
      await get().updateSchedule(scheduleId, updatedSchedule);
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  registerCheckOut: async (scheduleId, time, observations) => {
    set({ loading: true, error: null });
    try {
      const { schedules } = get();
      const schedule = schedules.find(s => s.id === scheduleId);
      
      if (!schedule) throw new Error('Escala não encontrada');
      
      const updatedSchedule = {
        ...schedule,
        checkOutTime: time,
        status: 'completed',
        observations: observations ? 
          (schedule.observations || '') + '\n\nCheck-out: ' + observations : 
          schedule.observations
      };
      
      await get().updateSchedule(scheduleId, updatedSchedule);
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  sendNotifications: async (scheduleIds) => {
    set({ loading: true, error: null });
    try {
      // Simulação de envio de notificações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));