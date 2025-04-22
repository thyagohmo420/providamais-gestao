import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Filter, Search, Download, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import ProfessionalForm from '../components/forms/ProfessionalForm';
import Confirmation from '../components/ui/Confirmation';

const GestaoEquipe = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [loading, setLoading] = useState(false);
  const [equipe, setEquipe] = useState([
    {
      id: 1,
      nome: 'Dr. João Silva',
      cargo: 'Médico',
      especialidade: 'Cardiologia',
      status: 'Ativo',
      turno: 'Manhã',
      crm: 'CRM/SP 123456',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
    },
    {
      id: 2,
      nome: 'Enf. Maria Santos',
      cargo: 'Enfermeira',
      especialidade: 'UTI',
      status: 'Ativo',
      turno: 'Noite',
      coren: 'COREN/SP 654321',
      documentos: ['identidade.pdf', 'diploma.pdf', 'coren.pdf'],
    },
    {
      id: 3,
      nome: 'Dr. Pedro Costa',
      cargo: 'Médico',
      especialidade: 'Ortopedia',
      status: 'Férias',
      turno: 'Tarde',
      crm: 'CRM/SP 789012',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
    },
  ]);

  const handleNewProfessional = () => {
    setSelectedProfessional(null);
    setIsFormModalOpen(true);
  };

  const handleEditProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsFormModalOpen(true);
  };

  const handleViewProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsViewModalOpen(true);
  };

  const handleDeleteProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProfessional) return;
    
    setLoading(true);
    // Simulação de exclusão
    setTimeout(() => {
      setEquipe(equipe.filter(p => p.id !== selectedProfessional.id));
      setIsDeleteModalOpen(false);
      setAlertType('success');
      setAlertMessage('Profissional excluído com sucesso!');
      setLoading(false);
    }, 500);
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedProfessional) {
        // Atualizar profissional existente
        setEquipe(equipe.map(p => 
          p.id === selectedProfessional.id ? { ...data, id: selectedProfessional.id } : p
        ));
        setAlertType('success');
        setAlertMessage('Profissional atualizado com sucesso!');
      } else {
        // Adicionar novo profissional
        const newId = Math.max(...equipe.map(p => p.id)) + 1;
        setEquipe([...equipe, { ...data, id: newId }]);
        setAlertType('success');
        setAlertMessage('Profissional cadastrado com sucesso!');
      }
      
      setIsFormModalOpen(false);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Erro ao salvar profissional: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementação de busca seria feita aqui
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const filteredEquipe = equipe.filter(membro => {
    const matchesSearch = searchTerm === '' || 
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || membro.cargo === roleFilter;
    const matchesStatus = statusFilter === '' || membro.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Equipe</h1>
          <p className="text-gray-600">Gerencie sua equipe médica e funcionários</p>
        </div>
        <Button 
          onClick={handleNewProfessional}
          icon={<UserPlus size={20} />}
        >
          Adicionar Profissional
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Buscar profissional..."
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
            {(searchTerm || roleFilter || statusFilter) && (
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Cargos' },
                { value: 'Médico', label: 'Médico' },
                { value: 'Enfermeira', label: 'Enfermeira' },
                { value: 'Técnico', label: 'Técnico' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'Ativo', label: 'Ativo' },
                { value: 'Férias', label: 'Férias' },
                { value: 'Licença', label: 'Licença' },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipe.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum profissional encontrado
                  </td>
                </tr>
              ) : (
                filteredEquipe.map((membro) => (
                  <tr key={membro.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{membro.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{membro.cargo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{membro.especialidade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{membro.crm || membro.coren || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        membro.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {membro.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {membro.turno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewProfessional(membro)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver Detalhes"
                        >
                          Detalhes
                        </button>
                        <button 
                          onClick={() => handleEditProfessional(membro)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteProfessional(membro)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProfessional ? 'Editar Profissional' : 'Novo Profissional'}
      >
        <ProfessionalForm
          professional={selectedProfessional}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes do Profissional"
      >
        {selectedProfessional && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{selectedProfessional.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cargo</p>
                <p className="text-base">{selectedProfessional.cargo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Especialidade</p>
                <p className="text-base">{selectedProfessional.especialidade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">{selectedProfessional.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Turno</p>
                <p className="text-base">{selectedProfessional.turno}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Registro</p>
                <p className="text-base">{selectedProfessional.crm || selectedProfessional.coren || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Documentos</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                {selectedProfessional.documentos && selectedProfessional.documentos.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedProfessional.documentos.map((doc: string, index: number) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{doc}</span>
                        <Button
                          variant="secondary"
                          className="text-xs px-2 py-1"
                          icon={<Download size={14} />}
                        >
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum documento cadastrado</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditProfessional(selectedProfessional);
                }}
              >
                Editar
              </Button>
              <Button onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o profissional ${selectedProfessional?.nome}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default GestaoEquipe;