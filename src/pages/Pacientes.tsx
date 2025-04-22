import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, UserPlus, Download } from 'lucide-react';
import { usePatientsStore } from '../store/patientsStore';
import PatientsTable from '../components/tables/PatientsTable';
import Modal from '../components/ui/Modal';
import PatientForm from '../components/forms/PatientForm';
import Confirmation from '../components/ui/Confirmation';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ReportGenerator from '../components/reports/ReportGenerator';
import { Patient } from '../types';

const Pacientes = () => {
  const {
    patients,
    filteredPatients,
    loading,
    error,
    totalCount,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    filterPatients,
    clearFilters,
    generateReport
  } = usePatientsStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchPatients(currentPage, itemsPerPage);
  }, [fetchPatients, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setIsFormModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;
    
    try {
      await deletePatient(selectedPatient.id);
      setIsDeleteModalOpen(false);
      setAlertType('success');
      setAlertMessage('Paciente excluído com sucesso!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao excluir paciente: ' + (err as Error).message);
    }
  };

  const handleFormSubmit = async (data: Omit<Patient, 'id'>) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, data);
        setAlertType('success');
        setAlertMessage('Paciente atualizado com sucesso!');
      } else {
        await createPatient(data);
        setAlertType('success');
        setAlertMessage('Paciente cadastrado com sucesso!');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao salvar paciente: ' + (err as Error).message);
    }
  };

  const handleSearch = () => {
    filterPatients({
      name: searchTerm,
      status: statusFilter
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    clearFilters();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'admitted':
        return 'Internado';
      case 'discharged':
        return 'Alta';
      case 'emergency':
        return 'Emergência';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage('')}
          className="mb-6"
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-gray-600">Gestão de pacientes e prontuários</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setIsReportModalOpen(true)}
            icon={<Download size={20} />}
            variant="secondary"
          >
            Relatórios
          </Button>
          <Button
            onClick={handleNewPatient}
            icon={<UserPlus size={20} />}
          >
            Novo Paciente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-medium mb-2">Total de Pacientes</h3>
          <p className="text-2xl font-bold text-blue-800">{totalCount}</p>
          <p className="text-sm text-blue-600">Cadastrados no sistema</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-700 font-medium mb-2">Internados</h3>
          <p className="text-2xl font-bold text-green-800">
            {patients.filter(p => p.currentStatus === 'admitted').length}
          </p>
          <p className="text-sm text-green-600">Pacientes ativos</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-yellow-700 font-medium mb-2">Em Tratamento</h3>
          <p className="text-2xl font-bold text-yellow-800">
            {patients.filter(p => p.currentStatus === 'emergency').length}
          </p>
          <p className="text-sm text-yellow-600">Emergências</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-purple-700 font-medium mb-2">Alta Prevista</h3>
          <p className="text-2xl font-bold text-purple-800">
            {patients.filter(p => p.currentStatus === 'discharged').length}
          </p>
          <p className="text-sm text-purple-600">Últimos 30 dias</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="text-gray-400" size={20} />}
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="secondary"
              icon={<Filter size={20} />}
            >
              Filtrar
            </Button>
            {(searchTerm || statusFilter) && (
              <Button
                onClick={handleClearFilters}
                variant="secondary"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'admitted', label: 'Internado' },
                { value: 'discharged', label: 'Alta' },
                { value: 'emergency', label: 'Emergência' },
              ]}
            />
          </div>
        </div>

        <PatientsTable
          patients={filteredPatients}
          onEdit={handleEditPatient}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
          isLoading={loading}
        />

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Mostrando {filteredPatients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} pacientes
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="secondary"
              className="px-3 py-1 text-sm"
            >
              Anterior
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Lógica para mostrar as páginas ao redor da página atual
              let pageToShow = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageToShow = currentPage - 3 + i;
                }
                if (currentPage > totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                }
              }
              
              return (
                <Button
                  key={pageToShow}
                  onClick={() => handlePageChange(pageToShow)}
                  variant={currentPage === pageToShow ? 'primary' : 'secondary'}
                  className={`px-3 py-1 text-sm ${
                    currentPage === pageToShow ? 'bg-blue-50 text-blue-600 border-blue-200' : ''
                  }`}
                >
                  {pageToShow}
                </Button>
              );
            })}
            
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="secondary"
              className="px-3 py-1 text-sm"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPatient ? 'Editar Paciente' : 'Novo Paciente'}
      >
        <PatientForm
          patient={selectedPatient || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o paciente ${selectedPatient?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Modal de Detalhes */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Detalhes do Paciente"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{selectedPatient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                <p className="text-base">
                  {new Date(selectedPatient.dateOfBirth).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gênero</p>
                <p className="text-base">
                  {selectedPatient.gender === 'male' ? 'Masculino' : 
                   selectedPatient.gender === 'female' ? 'Feminino' : 'Outro'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-base">{selectedPatient.contactNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">{selectedPatient.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">{getStatusLabel(selectedPatient.currentStatus)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Internação</p>
                <p className="text-base">
                  {selectedPatient.admissionDate 
                    ? new Date(selectedPatient.admissionDate).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
              {selectedPatient.currentStatus === 'discharged' && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Alta</p>
                  <p className="text-base">
                    {selectedPatient.dischargeDate 
                      ? new Date(selectedPatient.dischargeDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Histórico Médico</p>
              {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {selectedPatient.medicalHistory.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhum histórico médico registrado.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setIsDetailsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Relatórios */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Relatórios de Pacientes"
      >
        <ReportGenerator
          title="Gerar Relatório de Pacientes"
          onGenerate={generateReport}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};

export default Pacientes;