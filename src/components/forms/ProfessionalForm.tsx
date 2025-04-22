import React, { useState } from 'react';
import { User, Briefcase, Upload, X, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useForm } from '../../hooks/useForm';
import { masks, unMask } from '../../utils/masks';

interface ProfessionalFormProps {
  professional?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  professional,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>(
    professional?.documentos || []
  );

  const initialValues = professional
    ? { ...professional }
    : {
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        cargo: 'Médico',
        especialidade: '',
        crm: '',
        coren: '',
        registro: '',
        turno: 'Manhã',
        status: 'Ativo',
        dataContratacao: new Date().toISOString().split('T')[0],
        documentos: [],
      };

  const validationRules = {
    nome: {
      required: true,
      message: 'Nome é obrigatório',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email inválido',
    },
    telefone: {
      required: true,
      pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
      message: 'Telefone inválido',
    },
    cargo: {
      required: true,
      message: 'Cargo é obrigatório',
    },
    especialidade: {
      required: (value: string, values: any) => 
        values.cargo === 'Médico' || values.cargo === 'Enfermeira',
      message: 'Especialidade é obrigatória',
    },
    crm: {
      required: (value: string, values: any) => values.cargo === 'Médico',
      message: 'CRM é obrigatório',
    },
    coren: {
      required: (value: string, values: any) => values.cargo === 'Enfermeira',
      message: 'COREN é obrigatório',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (index: number) => {
    setExistingFiles(existingFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar dados para envio
      const formData = { ...values };
      
      // Converter telefone para formato sem máscara
      if (formData.telefone) {
        formData.telefone = unMask(formData.telefone);
      }
      
      // Adicionar nomes dos arquivos enviados
      const newDocuments = uploadedFiles.map(file => file.name);
      formData.documentos = [...existingFiles, ...newDocuments];
      
      await onSubmit(formData);
    }
  };

  const renderRegistrationField = () => {
    if (values.cargo === 'Médico') {
      return (
        <Input
          label="CRM"
          name="crm"
          value={values.crm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.crm ? errors.crm : ''}
          placeholder="CRM/UF 000000"
          required
        />
      );
    } else if (values.cargo === 'Enfermeira') {
      return (
        <Input
          label="COREN"
          name="coren"
          value={values.coren}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.coren ? errors.coren : ''}
          placeholder="COREN/UF 000000"
          required
        />
      );
    } else {
      return (
        <Input
          label="Registro Profissional"
          name="registro"
          value={values.registro}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Opcional"
        />
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Informações Pessoais */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <User className="mr-2" size={20} />
            Informações Pessoais
          </h3>
        </div>

        <Input
          label="Nome Completo"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nome ? errors.nome : ''}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ''}
          required
        />

        <Input
          label="Telefone"
          name="telefone"
          value={values.telefone}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          error={touched.telefone ? errors.telefone : ''}
          placeholder="(00) 00000-0000"
          required
        />

        <Input
          label="Endereço"
          name="endereco"
          value={values.endereco}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.endereco ? errors.endereco : ''}
        />

        {/* Seção de Informações Profissionais */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Briefcase className="mr-2" size={20} />
            Informações Profissionais
          </h3>
        </div>

        <Select
          label="Cargo"
          name="cargo"
          value={values.cargo}
          onChange={(e) => {
            // Limpar campos de registro ao mudar o cargo
            if (e.target.value === 'Médico') {
              setValues({ ...values, cargo: e.target.value, coren: '' });
            } else if (e.target.value === 'Enfermeira') {
              setValues({ ...values, cargo: e.target.value, crm: '' });
            } else {
              setValues({ ...values, cargo: e.target.value, crm: '', coren: '' });
            }
          }}
          onBlur={handleBlur}
          options={[
            { value: 'Médico', label: 'Médico' },
            { value: 'Enfermeira', label: 'Enfermeira' },
            { value: 'Técnico', label: 'Técnico' },
            { value: 'Administrativo', label: 'Administrativo' },
          ]}
          required
        />

        <Input
          label="Especialidade"
          name="especialidade"
          value={values.especialidade}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.especialidade ? errors.especialidade : ''}
          required={values.cargo === 'Médico' || values.cargo === 'Enfermeira'}
        />

        {renderRegistrationField()}

        <Select
          label="Turno"
          name="turno"
          value={values.turno}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'Manhã', label: 'Manhã' },
            { value: 'Tarde', label: 'Tarde' },
            { value: 'Noite', label: 'Noite' },
            { value: 'Integral', label: 'Integral' },
          ]}
        />

        <Select
          label="Status"
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: 'Ativo', label: 'Ativo' },
            { value: 'Férias', label: 'Férias' },
            { value: 'Licença', label: 'Licença' },
            { value: 'Inativo', label: 'Inativo' },
          ]}
        />

        <Input
          label="Data de Contratação"
          name="dataContratacao"
          type="date"
          value={values.dataContratacao}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dataContratacao ? errors.dataContratacao : ''}
        />

        {/* Seção de Documentos */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <FileText className="mr-2" size={20} />
            Documentos
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">
              Faça upload dos documentos necessários (RG, CPF, Diploma, Registro Profissional, etc.)
            </p>
            
            {/* Arquivos existentes */}
            {existingFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Documentos já enviados:</p>
                <ul className="space-y-2">
                  {existingFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                      <span className="text-sm text-gray-700">{file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Novos arquivos */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Novos documentos:</p>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-2">
              <label className="block">
                <span className="sr-only">Escolher arquivos</span>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="mr-2" size={16} />
                    Selecionar Arquivos
                  </label>
                </div>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB por arquivo.
              </p>
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
          {professional ? 'Atualizar Profissional' : 'Cadastrar Profissional'}
        </Button>
      </div>
    </form>
  );
};

export default ProfessionalForm;