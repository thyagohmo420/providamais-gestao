import React from 'react';
import { Schedule, User } from '../../types';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  MapPin, 
  User as UserIcon, 
  Briefcase, 
  MessageCircle, 
  CheckSquare, 
  AlertCircle 
} from 'lucide-react';
import Button from '../ui/Button';

interface ScheduleDetailsProps {
  schedule: Schedule;
  user?: User;
  onClose: () => void;
  onEdit?: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onApplyCandidacy?: () => void;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  schedule,
  user,
  onClose,
  onEdit,
  onCheckIn,
  onCheckOut,
  onApplyCandidacy
}) => {
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

  const getSectorLabel = (sector?: string) => {
    switch (sector) {
      case 'presencial':
        return 'Atendimento Presencial';
      case 'telemedicina':
        return 'Telemedicina';
      default:
        return 'Não especificado';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return timeString;
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const canCheckIn = !schedule.checkInTime && schedule.status === 'scheduled';
  const canCheckOut = schedule.checkInTime && !schedule.checkOutTime && schedule.status === 'scheduled';
  const canApply = schedule.candidacyEnabled && user?.role === 'doctor';

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Informações do Plantão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Calendar className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-500">Data</p>
              <p className="text-base">{formatDate(schedule.date)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-500">Turno</p>
              <p className="text-base">{getShiftLabel(schedule.shift)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-500">Unidade</p>
              <p className="text-base">{schedule.location || 'Não especificado'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Briefcase className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-500">Setor</p>
              <p className="text-base">{getSectorLabel(schedule.sector)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Horários</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Início:</p>
              <p className="text-base">{formatTime(schedule.startTime)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Término:</p>
              <p className="text-base">{formatTime(schedule.endTime)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Duração:</p>
              <p className="text-base">{schedule.duration} horas</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Valor:</p>
              <p className="text-base font-semibold text-green-600">{formatCurrency(schedule.value)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Situação:</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getStatusLabel(schedule.status)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Check-in:</p>
              <p className="text-base">{schedule.checkInTime || 'Não realizado'}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Check-out:</p>
              <p className="text-base">{schedule.checkOutTime || 'Não realizado'}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Tipo de Profissional:</p>
              <p className="text-base">{schedule.professionalType || 'Não especificado'}</p>
            </div>
          </div>
        </div>
      </div>

      {schedule.observations && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="text-gray-600" size={18} />
            <h3 className="text-lg font-semibold text-gray-800">Observações</h3>
          </div>
          <p className="text-sm text-gray-600">{schedule.observations}</p>
        </div>
      )}

      {schedule.internalComments && user?.role === 'admin' && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="text-yellow-600" size={18} />
            <h3 className="text-lg font-semibold text-yellow-800">Comentários Internos</h3>
          </div>
          <p className="text-sm text-yellow-600">{schedule.internalComments}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {canCheckIn && onCheckIn && (
          <Button
            onClick={onCheckIn}
            variant="secondary"
            icon={<CheckSquare size={18} />}
          >
            Registrar Entrada
          </Button>
        )}
        
        {canCheckOut && onCheckOut && (
          <Button
            onClick={onCheckOut}
            variant="secondary"
            icon={<CheckSquare size={18} />}
          >
            Registrar Saída
          </Button>
        )}
        
        {canApply && onApplyCandidacy && (
          <Button
            onClick={onApplyCandidacy}
            variant="primary"
            icon={<UserIcon size={18} />}
          >
            Candidatar-se
          </Button>
        )}
        
        {onEdit && user?.role === 'admin' && (
          <Button
            onClick={onEdit}
            variant="secondary"
          >
            Editar
          </Button>
        )}
        
        <Button onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default ScheduleDetails;