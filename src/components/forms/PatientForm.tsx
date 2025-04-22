import React from 'react';
import { Patient } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useForm } from '../../hooks/useForm';
import { masks, unMask } from '../../utils/masks';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const initialValues = patient
    ? { ...patient }
    : {
        name: '',
        dateOfBirth: '',
        gender: 'male',
        contactNumber: '',
        address: '',
        medicalHistory: [],
        currentStatus: 'admitted',
        admissionDate: new Date().toISOString(),
        dischargeDate: '',
      };

  const validationRules = {
    name: {
      required: true,
      message: 'Nome do paciente é obrigatório',
    },
    dateOfBirth: {
      required: true,
      message: 'Data de nascimento é obrigatória',
    },
    contactNumber: {
      required: true,
      pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
      message: 'Número de telefone inválido',
    },
    address: {
      required: true,
      message: 'Endereço é obrigatório',
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedValue = masks.phone(value);
    setValues({ ...values, [name]: maskedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Converter o telefone para formato sem máscara antes de enviar
      const formattedValues = {
        ...values,
        contactNumber: unMask(values.contactNumber),
      };
      await onSubmit(formattedValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome do Paciente"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : ''}
          required
        />

        <Input
          label="Data de Nascimento"
          name="dateOfBirth"
          type="date"
          value={values.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dateOfBirth ? errors.dateOfBirth : ''}
          required
        />

        <Select
          label="Gênero"
          name="gender"
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'male', label: 'Masculino' },
            { value: 'female', label: 'Feminino' },
            { value: 'other', label: 'Outro' },
          ]}
        />

        <Input
          label="Telefone"
          name="contactNumber"
          value={values.contactNumber}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          error={touched.contactNumber ? errors.contactNumber : ''}
          placeholder="(00) 00000-0000"
          required
        />

        <Input
          label="Endereço"
          name="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.address ? errors.address : ''}
          className="md:col-span-2"
          required
        />

        <Select
          label="Status Atual"
          name="currentStatus"
          value={values.currentStatus}
          onChange={handleChange}
          options={[
            { value: 'admitted', label: 'Internado' },
            { value: 'discharged', label: 'Alta' },
            { value: 'emergency', label: 'Emergência' },
          ]}
        />

        <Input
          label="Data de Internação"
          name="admissionDate"
          type="date"
          value={values.admissionDate ? values.admissionDate.split('T')[0] : ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {values.currentStatus === 'discharged' && (
          <Input
            label="Data de Alta"
            name="dischargeDate"
            type="date"
            value={values.dischargeDate ? values.dischargeDate.split('T')[0] : ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
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
          {patient ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;