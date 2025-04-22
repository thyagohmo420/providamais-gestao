import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Patient } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PatientsState {
  patients: Patient[];
  filteredPatients: Patient[];
  currentPatient: Patient | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  
  // Ações
  fetchPatients: (page?: number, limit?: number) => Promise<void>;
  getPatient: (id: string) => Promise<void>;
  createPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  
  // Filtros
  filterPatients: (filters: PatientFilters) => void;
  clearFilters: () => void;
  
  // Relatórios
  generateReport: (format: 'pdf' | 'excel' | 'csv', dateRange: DateRange) => Promise<string>;
}

export interface PatientFilters {
  name?: string;
  status?: string;
  dateRange?: DateRange;
  department?: string;
}

export type DateRange = 
  | '24h' 
  | '7d' 
  | '30d' 
  | '60d' 
  | '90d' 
  | 'custom';

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  filteredPatients: [],
  currentPatient: null,
  loading: false,
  error: null,
  totalCount: 0,

  fetchPatients: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      // Primeiro, obter a contagem total
      const { count, error: countError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Depois, obter os pacientes com paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        patients: data as Patient[], 
        filteredPatients: data as Patient[],
        totalCount: count || 0,
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getPatient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentPatient: data as Patient, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createPatient: async (patient) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select();
      
      if (error) throw error;
      
      const newPatient = data[0] as Patient;
      set(state => ({ 
        patients: [newPatient, ...state.patients],
        filteredPatients: [newPatient, ...state.filteredPatients],
        loading: false,
        totalCount: state.totalCount + 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updatePatient: async (id, patient) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(patient)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      const updatedPatient = data[0] as Patient;
      set(state => ({
        patients: state.patients.map(p => p.id === id ? updatedPatient : p),
        filteredPatients: state.filteredPatients.map(p => p.id === id ? updatedPatient : p),
        currentPatient: state.currentPatient?.id === id ? updatedPatient : state.currentPatient,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        patients: state.patients.filter(p => p.id !== id),
        filteredPatients: state.filteredPatients.filter(p => p.id !== id),
        currentPatient: state.currentPatient?.id === id ? null : state.currentPatient,
        loading: false,
        totalCount: state.totalCount - 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  filterPatients: (filters) => {
    const { patients } = get();
    let filtered = [...patients];
    
    // Filtro por nome
    if (filters.name) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(p => p.currentStatus === filters.status);
    }
    
    // Filtro por departamento (setor)
    if (filters.department) {
      // Aqui precisaríamos ter o departamento no paciente, mas como não temos,
      // estamos apenas simulando o filtro
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
      
      filtered = filtered.filter(p => {
        const admissionDate = p.admissionDate ? new Date(p.admissionDate) : null;
        return admissionDate && admissionDate >= startDate;
      });
    }
    
    set({ filteredPatients: filtered });
  },

  clearFilters: () => {
    const { patients } = get();
    set({ filteredPatients: patients });
  },

  generateReport: async (format, dateRange) => {
    set({ loading: true, error: null });
    try {
      // Aqui seria a lógica para gerar o relatório no formato especificado
      // Por enquanto, vamos simular um atraso e retornar uma URL fictícia
      
      // Aplicar filtro de data
      const { patients } = get();
      let filtered = [...patients];
      
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
      
      filtered = filtered.filter(p => {
        const admissionDate = p.admissionDate ? new Date(p.admissionDate) : null;
        return admissionDate && admissionDate >= startDate;
      });
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: ptBR });
      const fileName = `relatorio_pacientes_${timestamp}.${format}`;
      
      set({ loading: false });
      
      // Em uma implementação real, retornaríamos a URL para download do arquivo
      return `/reports/${fileName}`;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return '';
    }
  }
}));