import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Equipment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EquipmentState {
  equipment: Equipment[];
  filteredEquipment: Equipment[];
  currentEquipment: Equipment | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  
  // Ações
  fetchEquipment: (page?: number, limit?: number) => Promise<void>;
  getEquipment: (id: string) => Promise<void>;
  createEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  
  // Filtros
  filterEquipment: (filters: EquipmentFilters) => void;
  clearFilters: () => void;
  
  // Relatórios
  generateReport: (format: 'pdf' | 'excel' | 'csv', dateRange: DateRange) => Promise<string>;
}

export interface EquipmentFilters {
  name?: string;
  type?: string;
  status?: string;
  location?: string;
  dateRange?: DateRange;
}

export type DateRange = 
  | '24h' 
  | '7d' 
  | '30d' 
  | '60d' 
  | '90d' 
  | 'custom';

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  filteredEquipment: [],
  currentEquipment: null,
  loading: false,
  error: null,
  totalCount: 0,

  fetchEquipment: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      // Primeiro, obter a contagem total
      const { count, error: countError } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Depois, obter os equipamentos com paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        equipment: data as Equipment[], 
        filteredEquipment: data as Equipment[],
        totalCount: count || 0,
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getEquipment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentEquipment: data as Equipment, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createEquipment: async (equipment) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([equipment])
        .select();
      
      if (error) throw error;
      
      const newEquipment = data[0] as Equipment;
      set(state => ({ 
        equipment: [newEquipment, ...state.equipment],
        filteredEquipment: [newEquipment, ...state.filteredEquipment],
        loading: false,
        totalCount: state.totalCount + 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateEquipment: async (id, equipment) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(equipment)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      const updatedEquipment = data[0] as Equipment;
      set(state => ({
        equipment: state.equipment.map(e => e.id === id ? updatedEquipment : e),
        filteredEquipment: state.filteredEquipment.map(e => e.id === id ? updatedEquipment : e),
        currentEquipment: state.currentEquipment?.id === id ? updatedEquipment : state.currentEquipment,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteEquipment: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        equipment: state.equipment.filter(e => e.id !== id),
        filteredEquipment: state.filteredEquipment.filter(e => e.id !== id),
        currentEquipment: state.currentEquipment?.id === id ? null : state.currentEquipment,
        loading: false,
        totalCount: state.totalCount - 1
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  filterEquipment: (filters) => {
    const { equipment } = get();
    let filtered = [...equipment];
    
    // Filtro por nome
    if (filters.name) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(e => e.type === filters.type);
    }
    
    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    
    // Filtro por localização
    if (filters.location) {
      filtered = filtered.filter(e => 
        e.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
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
      
      filtered = filtered.filter(e => {
        const lastMaintenance = e.lastMaintenance ? new Date(e.lastMaintenance) : null;
        return lastMaintenance && lastMaintenance >= startDate;
      });
    }
    
    set({ filteredEquipment: filtered });
  },

  clearFilters: () => {
    const { equipment } = get();
    set({ filteredEquipment: equipment });
  },

  generateReport: async (format, dateRange) => {
    set({ loading: true, error: null });
    try {
      // Aqui seria a lógica para gerar o relatório no formato especificado
      // Por enquanto, vamos simular um atraso e retornar uma URL fictícia
      
      // Aplicar filtro de data
      const { equipment } = get();
      let filtered = [...equipment];
      
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
      
      filtered = filtered.filter(e => {
        const lastMaintenance = e.lastMaintenance ? new Date(e.lastMaintenance) : null;
        return lastMaintenance && lastMaintenance >= startDate;
      });
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: ptBR });
      const fileName = `relatorio_equipamentos_${timestamp}.${format}`;
      
      set({ loading: false });
      
      // Em uma implementação real, retornaríamos a URL para download do arquivo
      return `/reports/${fileName}`;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return '';
    }
  }
}));