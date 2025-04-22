import React from 'react';
import { Equipment } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useForm } from '../../hooks/useForm';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: Omit<Equipment, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const initialValues = equipment
    ? { ...equipment }
    : {
        name: '',
        type: 'medical',
        status: 'available',
        location: '',
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      };

  const validationRules = {
    name: {
      required: true,
      message: 'Nome do equipamento é obrigatório',
    },
    location: {
      required: true,
      message: 'Localização é obrigatória',
    },
    lastMaintenance: {
      required: true,
      message: 'Data da última manutenção é obrigatória',
    },
    nextMaintenance: {
      required: true,
      message: 'Data da próxima manutenção é obrigatória',
    },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
  } = useForm(initialValues, validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome do Equipamento"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : ''}
          required
        />

        <Select
          label="Tipo"
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'medical', label: 'Médico' },
            { value: 'general', label: 'Geral' },
          ]}
        />

        <Select
          label="Status"
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'available', label: 'Disponível' },
            { value: 'in-use', label: 'Em Uso' },
            { value: 'maintenance', label: 'Em Manutenção' },
          ]}
        />

        <Input
          label="Localização"
          name="location"
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.location ? errors.location : ''}
          required
        />

        <Input
          label="Última Manutenção"
          name="lastMaintenance"
          type="date"
          value={values.lastMaintenance ? values.lastMaintenance.split('T')[0] : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastMaintenance ? errors.lastMaintenance : ''}
          required
        />

        <Input
          label="Próxima Manutenção"
          name="nextMaintenance"
          type="date"
          value={values.nextMaintenance ? values.nextMaintenance.split('T')[0] : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nextMaintenance ? errors.nextMaintenance : ''}
          required
        />
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
          {equipment ? 'Atualizar Equipamento' : 'Cadastrar Equipamento'}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;