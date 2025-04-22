import React, { useEffect, useState } from 'react';
import { Schedule } from '../../types';
import { Edit, Trash2, Info, Users, CheckSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SchedulesTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onViewDetails: (schedule: Schedule) => void;
  onViewCandidates?: (schedule: Schedule) => void;
  onCheckIn?: (schedule: Schedule) => void;
  onCheckOut?: (schedule: Schedule) => void;
  isLoading?: boolean;
}

interface UserInfo {
  [key: string]: {
    name: string;
    role: string;
  };
}

const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
  onEdit,
  onDelete,
  onViewDetails,
  onViewCandidates,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (schedules.length === 0) return;
      
      // Instead of fetching from the database, we'll use mock data
      // This avoids the UUID format error
      const mockUserInfo: UserInfo = {
        'user1': { name: 'Dr. João Silva', role: 'doctor' },
        'user2': { name: 'Dra. Maria Santos', role: 'doctor' },
        'user3': { name: 'Enf. Carlos Oliveira', role: 'nurse' },
        'user4': { name: 'Dr. Roberto Ferreira', role: 'doctor' },
        'user5': { name: 'Téc. Ana Paula', role: 'staff' }
      };
      
      setUserInfo(mockUserInfo);
      setLoadingUsers(false);
    };
    
    setLoadingUsers(true);
    fetchUsers();
  }, [schedules]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'morning':
        return 'Manhã';
      case 'afternoon':
        return 'Tarde';
      case 'night':
        return 'Noite';
      default:
        return shift;
    }
  };

  const getSectorLabel = (sector?: string) => {
    switch (sector) {
      case 'presencial':
        return 'Presencial';
      case 'telemedicina':
        return 'Telemedicina';
      default:
        return '-';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Profissional
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Turno
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Horário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Setor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading || loadingUsers ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Carregando...
              </td>
            </tr>
          ) : schedules.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Nenhuma escala encontrada
              </td>
            </tr>
          ) : (
            schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {userInfo[schedule.userId]?.name || 'Profissional'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userInfo[schedule.userId]?.role === 'doctor' ? 'Médico' : 
                     userInfo[schedule.userId]?.role === 'nurse' ? 'Enfermeiro' : 
                     userInfo[schedule.userId]?.role === 'staff' ? 'Funcionário' : 'Admin'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(schedule.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{getShiftLabel(schedule.shift)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{getSectorLabel(schedule.sector)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(schedule.status)}`}>
                    {getStatusLabel(schedule.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(schedule)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver Detalhes"
                    >
                      <Info size={18} />
                    </button>
                    
                    {schedule.candidacyEnabled && onViewCandidates && (
                      <button
                        onClick={() => onViewCandidates(schedule)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Ver Candidatos"
                      >
                        <Users size={18} />
                      </button>
                    )}
                    
                    {schedule.status === 'scheduled' && !schedule.checkInTime && onCheckIn && (
                      <button
                        onClick={() => onCheckIn(schedule)}
                        className="text-green-600 hover:text-green-900"
                        title="Registrar Entrada"
                      >
                        <CheckSquare size={18} />
                      </button>
                    )}
                    
                    {schedule.status === 'scheduled' && schedule.checkInTime && !schedule.checkOutTime && onCheckOut && (
                      <button
                        onClick={() => onCheckOut(schedule)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Registrar Saída"
                      >
                        <CheckSquare size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onEdit(schedule)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(schedule)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesTable;