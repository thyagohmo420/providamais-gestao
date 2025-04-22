import React, { useEffect, useState } from 'react';
import { Stethoscope, Search, Filter, WrenchIcon, Download } from 'lucide-react';
import { useEquipmentStore } from '../store/equipmentStore';
import EquipmentTable from '../components/tables/EquipmentTable';
import Modal from '../components/ui/Modal';
import EquipmentForm from '../components/forms/EquipmentForm';
import Confirmation from '../components/ui/Confirmation';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ReportGenerator from '../components/reports/ReportGenerator';
import { Equipment } from '../types';

const Equipamentos = () => {
  const {
    equipment,
    filteredEquipment,
    loading,
    error,
    totalCount,
    fetchEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    filterEquipment,
    clearFilters,
    generateReport
  } = useEquipmentStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchEquipment(currentPage, itemsPerPage);
  }, [fetchEquipment, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleNewEquipment = () => {
    setSelectedEquipment(null);
    setIsFormModalOpen(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEquipment) return;
    
    try {
      await deleteEquipment(selectedEquipment.id);
      setIsDeleteModalOpen(false);
      setAlertType('success');
      setAlertMessage('Equipamento excluído com sucesso!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao excluir equipamento: ' + (err as Error).message);
    }
  };

  const handleFormSubmit = async (data: Omit<Equipment, 'id'>) => {
    try {
      if (selectedEquipment) {
        await updateEquipment(selectedEquipment.id, data);
        setAlertType('success');
        setAlertMessage('Equipamento atualizado com sucesso!');
      } else {
        await createEquipment(data);
        setAlertType('success');
        setAlertMessage('Equipamento cadastrado com sucesso!');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao salvar equipamento: ' + (err as Error).message);
    }
  };

  const handleSearch = () => {
    filterEquipment({
      name: searchTerm,
      type: typeFilter,
      status: statusFilter
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    clearFilters();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'in-use':
        return 'Em Uso';
      case 'maintenance':
        return 'Manutenção';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medical':
        return 'Médico';
      case 'general':
        return 'Geral';
      default:
        return type;
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
          <h1 className="text-2xl font-bold text-gray-800">Equipamentos</h1>
          <p className="text-gray-600">Gestão de equipamentos médicos e hospitalares</p>
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
            onClick={handleNewEquipment}
            icon={<WrenchIcon size={20} />}
          >
            Novo Equipamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-medium mb-2">Total de Equipamentos</h3>
          <p className="text-2xl font-bold text-blue-800">{totalCount}</p>
          <p className="text-sm text-blue-600">Cadastrados no sistema</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-700 font-medium mb-2">Disponíveis</h3>
          <p className="text-2xl font-bold text-green-800">
            {equipment.filter(e => e.status === 'available').length}
          </p>
          <p className="text-sm text-green-600">Para uso</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-yellow-700 font-medium mb-2">Em Uso</h3>
          <p className="text-2xl font-bold text-yellow-800">
            {equipment.filter(e => e.status === 'in-use').length}
          </p>
          <p className="text-sm text-yellow-600">No momento</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-700 font-medium mb-2">Manutenção</h3>
          <p className="text-2xl font-bold text-red-800">
            {equipment.filter(e => e.status === 'maintenance').length}
          </p>
          <p className="text-sm text-red-600">Preventiva/Corretiva</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Buscar equipamento..."
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
            {(searchTerm || typeFilter || statusFilter) && (
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Tipos' },
                { value: 'medical', label: 'Médico' },
                { value: 'general', label: 'Geral' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'available', label: 'Disponível' },
                { value: 'in-use', label: 'Em Uso' },
                { value: 'maintenance', label: 'Manutenção' },
              ]}
            />
          </div>
        </div>

        <EquipmentTable
          equipment={filteredEquipment}
          onEdit={handleEditEquipment}
          onDelete={handleDeleteClick}
          onViewDetails={handleViewDetails}
          isLoading={loading}
        />

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Mostrando {filteredEquipment.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} equipamentos
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
        title={selectedEquipment ? 'Editar Equipamento' : 'Novo Equipamento'}
      >
        <EquipmentForm
          equipment={selectedEquipment || undefined}
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
        message={`Tem certeza que deseja excluir o equipamento ${selectedEquipment?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Modal de Detalhes */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Detalhes do Equipamento"
      >
        {selectedEquipment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{selectedEquipment.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-base">{getTypeLabel(selectedEquipment.type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">{getStatusLabel(selectedEquipment.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Localização</p>
                <p className="text-base">{selectedEquipment.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Última Manutenção</p>
                <p className="text-base">
                  {new Date(selectedEquipment.lastMaintenance).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Próxima Manutenção</p>
                <p className="text-base">
                  {new Date(selectedEquipment.nextMaintenance).toLocaleDateString('pt-BR')}
                </p>
              </div>
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
        title="Relatórios de Equipamentos"
      >
        <ReportGenerator
          title="Gerar Relatório de Equipamentos"
          onGenerate={generateReport}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};

export default Equipamentos;