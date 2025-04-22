import React, { useState } from 'react';
import { Schedule } from '../../types';
import { Clock, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';

interface CheckInOutFormProps {
  schedule: Schedule;
  type: 'checkIn' | 'checkOut';
  onSubmit: (data: { time: string; observations: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CheckInOutForm: React.FC<CheckInOutFormProps> = ({
  schedule,
  type,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  const [time, setTime] = useState(currentTime);
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ time, observations });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {type === 'checkIn' ? 'Registrar Entrada' : 'Registrar Saída'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Horário
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Adicione observações se necessário"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Confirmar
        </Button>
      </div>
    </form>
  );
};

export default CheckInOutForm;