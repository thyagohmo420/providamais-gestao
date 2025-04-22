import React, { useEffect, useState } from 'react';
import { Schedule, HealthUnit, ProfessionalType } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useForm } from '../../hooks/useForm';
import { supabase } from '../../lib/supabase';
import { Clock, DollarSign, MapPin, Stethoscope, Users, MessageCircle, CheckSquare } from 'lucide-react';

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: Omit<Schedule, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface UserOption {
  value: string;
  label: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([]);
  const [professionalTypes, setProfessionalTypes] = useState<ProfessionalType[]>([]);
  const [showCandidacyOptions, setShowCandidacyOptions] = useState(false);
  const [candidacyGroups, setCandidacyGroups] = useState<string[]>([]);

  const initialValues = schedule
    ? { ...schedule }
    : {
        userId: '',
        date: new Date().toISOString().split('T')[0],
        shift: 'morning',
        department: '',
        status: 'scheduled',
        startTime: '08:00',
        endTime: '14:00',
        duration: 6,
        value: 0,
        location: '',
        sector: 'presencial',
        professionalType: 'pj',
        specialty: '',
        isFixed: false,
        isCoverage: false,
        observations: '',
        internalComments: '',
        candidacyEnabled: false,
        candidacyGroups: [],
      };

  const validationRules = {
    userId: {
      required: true,
      message: 'Profissional é obrigatório',
    },
    date: {
      required: true,
      message: 'Data é obrigatória',
    },
    department: {
      required: true,
      message: 'Departamento é obrigatório',
    },
    startTime: {
      required: true,
      message: 'Horário de início é obrigatório',
    },
    endTime: {
      required: true,
      message: 'Horário de término é obrigatório',
    },
    value: {
      required: true,
      message: 'Valor do plantão é obrigatório',
    },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setValues,
  } = useForm(initialValues, validationRules);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, role, specialization')
          .order('name');
        
        if (error) throw error;
        
        const options = data.map(user => ({
          value: user.id,
          label: `${user.name} (${user.role === 'doctor' ? 'Médico' : 
                                  user.role === 'nurse' ? 'Enfermeiro' : 
                                  user.role === 'staff' ? 'Funcionário' : 'Admin'})${user.specialization ? ' - ' + user.specialization : ''}`
        }));
        
        setUserOptions(options);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchHealthUnits = async () => {
      try {
        // Em um ambiente real, isso viria do banco de dados
        // Simulando dados para demonstração
        setHealthUnits([
          { id: '1', name: 'UMS Juquitiba', address: 'Rua A, 123', city: 'Juquitiba', state: 'SP', sectors: ['presencial', 'telemedicina'], isActive: true },
          { id: '2', name: 'UMS São Paulo', address: 'Av B, 456', city: 'São Paulo', state: 'SP', sectors: ['presencial'], isActive: true },
          { id: '3', name: 'UMS Campinas', address: 'Rua C, 789', city: 'Campinas', state: 'SP', sectors: ['presencial', 'telemedicina'], isActive: true },
        ]);
      } catch (error) {
        console.error('Erro ao carregar unidades de saúde:', error);
      }
    };

    const fetchProfessionalTypes = async () => {
      try {
        // Em um ambiente real, isso viria do banco de dados
        // Simulando dados para demonstração
        setProfessionalTypes([
          { id: '1', name: 'PJ - Clínica Geral', contractType: 'pj', specialty: 'Clínica Geral' },
          { id: '2', name: 'CLT - Enfermagem', contractType: 'clt', specialty: 'Enfermagem' },
          { id: '3', name: 'PJ - Cardiologia', contractType: 'pj', specialty: 'Cardiologia' },
          { id: '4', name: 'Autônomo - Pediatria', contractType: 'autonomo', specialty: 'Pediatria' },
        ]);
      } catch (error) {
        console.error('Erro ao carregar tipos profissionais:', error);
      }
    };
    
    fetchUsers();
    fetchHealthUnits();
    fetchProfessionalTypes();
  }, []);

  useEffect(() => {
    // Calcular duração quando horário de início ou término mudar
    if (values.startTime && values.endTime) {
      const start = new Date(`2000-01-01T${values.startTime}`);
      const end = new Date(`2000-01-01T${values.endTime}`);
      
      // Se o horário de término for menor que o de início, assumimos que passa para o dia seguinte
      let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration < 0) {
        duration += 24;
      }
      
      setValues({ ...values, duration });
    }
  }, [values.startTime, values.endTime]);

  const handleCandidacyGroupChange = (group: string) => {
    const updatedGroups = candidacyGroups.includes(group)
      ? candidacyGroups.filter(g => g !== group)
      : [...candidacyGroups, group];
    
    setCandidacyGroups(updatedGroups);
    setValues({ ...values, candidacyGroups: updatedGroups });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Informações Básicas */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Informações Básicas</h3>
        </div>

        <Select
          label="Unidade de Saúde"
          name="location"
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.location ? errors.location : ''}
          options={[
            { value: '', label: 'Selecione uma unidade' },
            ...healthUnits.map(unit => ({ value: unit.id, label: unit.name }))
          ]}
          required
        />

        <Select
          label="Setor"
          name="sector"
          value={values.sector}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'presencial', label: 'Atendimento Presencial' },
            { value: 'telemedicina', label: 'Telemedicina' },
          ]}
        />

        <Select
          label="Tipo de Profissional"
          name="professionalType"
          value={values.professionalType}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: '', label: 'Selecione um tipo' },
            ...professionalTypes.map(type => ({ 
              value: type.id, 
              label: type.name 
            }))
          ]}
        />

        <Select
          label="Especialidade"
          name="specialty"
          value={values.specialty}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: '', label: 'Selecione uma especialidade' },
            { value: 'clinica_geral', label: 'Clínica Geral' },
            { value: 'cardiologia', label: 'Cardiologia' },
            { value: 'pediatria', label: 'Pediatria' },
            { value: 'ortopedia', label: 'Ortopedia' },
            { value: 'enfermagem', label: 'Enfermagem' },
          ]}
        />

        <Input
          label="Data"
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.date ? errors.date : ''}
          required
        />

        <Select
          label="Turno"
          name="shift"
          value={values.shift}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'morning', label: 'Manhã (07:00 - 13:00)' },
            { value: 'afternoon', label: 'Tarde (13:00 - 19:00)' },
            { value: 'night', label: 'Noite (19:00 - 07:00)' },
          ]}
        />

        {/* Seção de Horários e Valor */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Horários e Valor</h3>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="flex-1">
            <Input
              label="Horário de Início"
              name="startTime"
              type="time"
              value={values.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.startTime ? errors.startTime : ''}
              icon={<Clock size={20} className="text-gray-400" />}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label="Horário de Término"
              name="endTime"
              type="time"
              value={values.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.endTime ? errors.endTime : ''}
              icon={<Clock size={20} className="text-gray-400" />}
              required
            />
          </div>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="flex-1">
            <Input
              label="Duração (horas)"
              name="duration"
              type="number"
              value={values.duration?.toString() || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            />
          </div>
          <div className="flex-1">
            <Input
              label="Valor do Plantão (R$)"
              name="value"
              type="number"
              value={values.value?.toString() || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.value ? errors.value : ''}
              icon={<DollarSign size={20} className="text-gray-400" />}
              required
            />
          </div>
        </div>

        {/* Seção de Profissionais */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Profissionais</h3>
        </div>

        <Select
          label="Profissional"
          name="userId"
          value={values.userId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.userId ? errors.userId : ''}
          options={[
            { value: '', label: 'Selecione um profissional' },
            ...userOptions
          ]}
          disabled={loadingUsers}
          required
        />

        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFixed"
              name="isFixed"
              checked={values.isFixed}
              onChange={(e) => setValues({ ...values, isFixed: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFixed" className="ml-2 block text-sm text-gray-700">
              Profissional Fixo
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCoverage"
              name="isCoverage"
              checked={values.isCoverage}
              onChange={(e) => setValues({ ...values, isCoverage: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCoverage" className="ml-2 block text-sm text-gray-700">
              Cobertura
            </label>
          </div>
        </div>

        {/* Seção de Candidatura */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Configuração de Candidatura</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="candidacyEnabled"
              name="candidacyEnabled"
              checked={values.candidacyEnabled}
              onChange={(e) => {
                setValues({ ...values, candidacyEnabled: e.target.checked });
                setShowCandidacyOptions(e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="candidacyEnabled" className="ml-2 block text-sm text-gray-700">
              Permitir candidatura para este plantão
            </label>
          </div>
        </div>

        {showCandidacyOptions && (
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Grupos que podem se candidatar:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="group-doctors"
                  checked={candidacyGroups.includes('doctors')}
                  onChange={() => handleCandidacyGroupChange('doctors')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="group-doctors" className="ml-2 block text-sm text-gray-700">
                  Médicos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="group-nurses"
                  checked={candidacyGroups.includes('nurses')}
                  onChange={() => handleCandidacyGroupChange('nurses')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="group-nurses" className="ml-2 block text-sm text-gray-700">
                  Enfermeiros
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="group-specialists"
                  checked={candidacyGroups.includes('specialists')}
                  onChange={() => handleCandidacyGroupChange('specialists')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="group-specialists" className="ml-2 block text-sm text-gray-700">
                  Especialistas
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="group-staff"
                  checked={candidacyGroups.includes('staff')}
                  onChange={() => handleCandidacyGroupChange('staff')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="group-staff" className="ml-2 block text-sm text-gray-700">
                  Funcionários
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Observações */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Observações</h3>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
            Observações do Profissional
          </label>
          <textarea
            id="observations"
            name="observations"
            rows={3}
            value={values.observations}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Observações visíveis para o profissional"
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="internalComments" className="block text-sm font-medium text-gray-700 mb-1">
            Comentários Internos
          </label>
          <textarea
            id="internalComments"
            name="internalComments"
            rows={3}
            value={values.internalComments}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Comentários visíveis apenas para coordenadores e empresas"
          ></textarea>
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
          {schedule ? 'Atualizar Escala' : 'Cadastrar Escala'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm;