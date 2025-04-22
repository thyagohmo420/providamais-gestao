import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Search, Filter, Clock, Download, Users, Bell, List, Grid3X3 } from 'lucide-react';
import { useSchedulesStore } from '../store/schedulesStore';
import SchedulesTable from '../components/tables/SchedulesTable';
import Modal from '../components/ui/Modal';
import ScheduleForm from '../components/forms/ScheduleForm';
import Confirmation from '../components/ui/Confirmation';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ReportGenerator from '../components/reports/ReportGenerator';
import { Schedule } from '../types';
import ScheduleCalendarView from '../components/schedules/ScheduleCalendarView';
import ScheduleDetails from '../components/schedules/ScheduleDetails';
import ScheduleCandidates from '../components/schedules/ScheduleCandidates';
import CheckInOutForm from '../components/schedules/CheckInOutForm';
import ScheduleReport from '../components/reports/ScheduleReport';

const Escalas = () => {
  const {
    schedules,
    filteredSchedules,
    loading,
    error,
    totalCount,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    filterSchedules,
    clearFilters,
    generateReport,
    sendNotifications
  } = useSchedulesStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchSchedules(currentPage, itemsPerPage);
  }, [fetchSchedules, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleNewSchedule = () => {
    setSelectedSchedule(null);
    setIsFormModalOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailsModalOpen(true);
  };

  const handleViewCandidates = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsCandidatesModalOpen(true);
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSchedule) return;
    
    try {
      await deleteSchedule(selectedSchedule.id);
      setIsDeleteModalOpen(false);
      setAlertType('success');
      setAlertMessage('Escala excluída com sucesso!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao excluir escala: ' + (err as Error).message);
    }
  };

  const handleFormSubmit = async (data: Omit<Schedule, 'id'>) => {
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, data);
        setAlertType('success');
        setAlertMessage('Escala atualizada com sucesso!');
      } else {
        await createSchedule(data);
        setAlertType('success');
        setAlertMessage('Escala cadastrada com sucesso!');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao salvar escala: ' + (err as Error).message);
    }
  };

  const handleSearch = () => {
    filterSchedules({
      department: departmentFilter,
      shift: shiftFilter,
      status: statusFilter
    });
  };

  const handleClearFilters = () => {
    setDepartmentFilter('');
    setShiftFilter('');
    setStatusFilter('');
    clearFilters();
  };

  const handleCheckIn = async (data: { time: string; observations: string }) => {
    if (!selectedSchedule) return;
    
    try {
      await updateSchedule(selectedSchedule.id, {
        ...selectedSchedule,
        checkInTime: data.time,
        observations: data.observations ? 
          (selectedSchedule.observations || '') + '\n\nCheck-in: ' + data.observations : 
          selectedSchedule.observations
      });
      
      setIsCheckInModalOpen(false);
      setAlertType('success');
      setAlertMessage('Check-in registrado com sucesso!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao registrar check-in: ' + (err as Error).message);
    }
  };

  const handleCheckOut = async (data: { time: string; observations: string }) => {
    if (!selectedSchedule) return;
    
    try {
      await updateSchedule(selectedSchedule.id, {
        ...selectedSchedule,
        checkOutTime: data.time,
        status: 'completed',
        observations: data.observations ? 
          (selectedSchedule.observations || '') + '\n\nCheck-out: ' + data.observations : 
          selectedSchedule.observations
      });
      
      setIsCheckOutModalOpen(false);
      setAlertType('success');
      setAlertMessage('Check-out registrado com sucesso!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Erro ao registrar check-out: ' + (err as Error).message);
    }
  };

  const handleApproveCandidate = async (candidateId: string) => {
    // Simulação de aprovação de candidato
    await new Promise(resolve => setTimeout(resolve, 500));
    setAlertType('success');
    setAlertMessage('Candidato aprovado com sucesso!');
  };

  const handleRejectCandidate = async (candidateId: string) => {
    // Simulação de rejeição de candidato
    await new Promise(resolve => setTimeout(resolve, 500));
    setAlertType('success');
    setAlertMessage('Candidato rejeitado com sucesso!');
  };

  const handleApplyCandidacy = async () => {
    // Simulação de candidatura
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsDetailsModalOpen(false);
    setAlertType('success');
    setAlertMessage('Candidatura enviada com sucesso!');
  };

  const handleSendNotifications = async () => {
    try {
      await sendNotifications(filteredSchedules.map(s => s.id));
      setAlertType('success');
      setAlertMessage('Notificações enviadas com sucesso!');
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Erro ao enviar notificações: ' + (error as Error).message);
    }
  };

  const handleGenerateReport = async (format: 'pdf' | 'excel' | 'csv', dateRange: string, filters: any) => {
    try {
      const reportUrl = await generateReport(format, dateRange as any);
      return reportUrl;
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Erro ao gerar relatório: ' + (error as Error).message);
      return '';
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
          <h1 className="text-2xl font-bold text-gray-800">Escalas</h1>
          <p className="text-gray-600">Gerenciamento de escalas médicas e de enfermagem</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleSendNotifications}
            icon={<Bell size={20} />}
            variant="secondary"
          >
            Notificar
          </Button>
          <Button
            onClick={() => setIsReportModalOpen(true)}
            icon={<Download size={20} />}
            variant="secondary"
          >
            Relatórios
          </Button>
          <Button
            onClick={handleNewSchedule}
            icon={<CalendarIcon size={20} />}
          >
            Nova Escala
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Plantões Hoje</h2>
            <Clock className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-600">Manhã</span>
                <span className="text-sm text-gray-500">07:00 - 13:00</span>
              </div>
              <p className="text-sm text-gray-600">
                {schedules.filter(s => 
                  new Date(s.date).toDateString() === new Date().toDateString() && 
                  s.shift === 'morning'
                ).length} profissionais
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-600">Tarde</span>
                <span className="text-sm text-gray-500">13:00 - 19:00</span>
              </div>
              <p className="text-sm text-gray-600">
                {schedules.filter(s => 
                  new Date(s.date).toDateString() === new Date().toDateString() && 
                  s.shift === 'afternoon'
                ).length} profissionais
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-600">Noite</span>
                <span className="text-sm text-gray-500">19:00 - 07:00</span>
              </div>
              <p className="text-sm text-gray-600">
                {schedules.filter(s => 
                  new Date(s.date).toDateString() === new Date().toDateString() && 
                  s.shift === 'night'
                ).length} profissionais
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                className="w-40"
              />
              <Button
                onClick={handleSearch}
                variant="secondary"
                icon={<Filter size={20} />}
              >
                Aplicar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Departamento"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Departamentos' },
                { value: 'UTI', label: 'UTI' },
                { value: 'Emergência', label: 'Emergência' },
                { value: 'Cardiologia', label: 'Cardiologia' },
                { value: 'Ortopedia', label: 'Ortopedia' },
              ]}
            />
            <Select
              label="Turno"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Turnos' },
                { value: 'morning', label: 'Manhã' },
                { value: 'afternoon', label: 'Tarde' },
                { value: 'night', label: 'Noite' },
              ]}
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'scheduled', label: 'Agendado' },
                { value: 'completed', label: 'Concluído' },
                { value: 'cancelled', label: 'Cancelado' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Escalas</h2>
          <div className="flex items-center space-x-3">
            {(departmentFilter || shiftFilter || statusFilter) && (
              <Button
                onClick={handleClearFilters}
                variant="secondary"
              >
                Limpar Filtros
              </Button>
            )}
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                title="Visualização em Lista"
              >
                <List size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md ${viewMode === 'calendar' ? 'bg-white shadow-sm' : ''}`}
                title="Visualização em Calendário"
              >
                <Grid3X3 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            <SchedulesTable
              schedules={filteredSchedules}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteClick}
              onViewDetails={handleViewDetails}
              onViewCandidates={handleViewCandidates}
              onCheckIn={(schedule) => {
                setSelectedSchedule(schedule);
                setIsCheckInModalOpen(true);
              }}
              onCheckOut={(schedule) => {
                setSelectedSchedule(schedule);
                setIsCheckOutModalOpen(true);
              }}
              isLoading={loading}
            />

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Mostrando {filteredSchedules.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalCount)} de {totalCount} escalas
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
          </>
        ) : (
          <ScheduleCalendarView
            schedules={filteredSchedules}
            onSelectSchedule={handleViewDetails}
          />
        )}
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedSchedule ? 'Editar Escala' : 'Nova Escala'}
      >
        <ScheduleForm
          schedule={selectedSchedule || undefined}
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
        message="Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Modal de Detalhes */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Detalhes da Escala"
      >
        {selectedSchedule && (
          <ScheduleDetails
            schedule={selectedSchedule}
            onClose={() => setIsDetailsModalOpen(false)}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              handleEditSchedule(selectedSchedule);
            }}
            onCheckIn={() => {
              setIsDetailsModalOpen(false);
              setIsCheckInModalOpen(true);
            }}
            onCheckOut={() => {
              setIsDetailsModalOpen(false);
              setIsCheckOutModalOpen(true);
            }}
            onApplyCandidacy={handleApplyCandidacy}
          />
        )}
      </Modal>

      {/* Modal de Candidatos */}
      <Modal
        isOpen={isCandidatesModalOpen}
        onClose={() => setIsCandidatesModalOpen(false)}
        title="Candidatos ao Plantão"
      >
        {selectedSchedule && (
          <ScheduleCandidates
            schedule={selectedSchedule}
            onApprove={handleApproveCandidate}
            onReject={handleRejectCandidate}
          />
        )}
      </Modal>

      {/* Modal de Check-in */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Registrar Entrada"
      >
        {selectedSchedule && (
          <CheckInOutForm
            schedule={selectedSchedule}
            type="checkIn"
            onSubmit={handleCheckIn}
            onCancel={() => setIsCheckInModalOpen(false)}
            isLoading={loading}
          />
        )}
      </Modal>

      {/* Modal de Check-out */}
      <Modal
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        title="Registrar Saída"
      >
        {selectedSchedule && (
          <CheckInOutForm
            schedule={selectedSchedule}
            type="checkOut"
            onSubmit={handleCheckOut}
            onCancel={() => setIsCheckOutModalOpen(false)}
            isLoading={loading}
          />
        )}
      </Modal>

      {/* Modal de Relatórios */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Relatórios de Escalas"
      >
        <ScheduleReport
          schedules={filteredSchedules}
          onGenerateReport={handleGenerateReport}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};

export default Escalas;