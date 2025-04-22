import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Filter, Search, Download, FileText, Calendar, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import ProfessionalForm from '../components/forms/ProfessionalForm';
import Confirmation from '../components/ui/Confirmation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Medicos = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'dashboard'>('list');
  
  const [medicos, setMedicos] = useState([
    {
      id: 1,
      nome: 'Dr. João Silva',
      especialidade: 'Cardiologia',
      status: 'Ativo',
      crm: 'CRM/SP 123456',
      email: 'joao.silva@exemplo.com',
      telefone: '(11) 98765-4321',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
      plantoes: 12,
      horasTrabalhadas: 72,
      valorReceber: 8640,
      ultimosPlantoes: [
        { data: '2025-03-01', local: 'UMS São Paulo', valor: 800 },
        { data: '2025-03-05', local: 'UMS Campinas', valor: 800 },
        { data: '2025-03-10', local: 'UMS Juquitiba', valor: 720 },
      ]
    },
    {
      id: 2,
      nome: 'Dra. Maria Santos',
      especialidade: 'Clínica Geral',
      status: 'Ativo',
      crm: 'CRM/SP 654321',
      email: 'maria.santos@exemplo.com',
      telefone: '(11) 91234-5678',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
      plantoes: 8,
      horasTrabalhadas: 48,
      valorReceber: 5760,
      ultimosPlantoes: [
        { data: '2025-03-02', local: 'UMS São Paulo', valor: 800 },
        { data: '2025-03-08', local: 'UMS Juquitiba', valor: 720 },
      ]
    },
    {
      id: 3,
      nome: 'Dr. Pedro Costa',
      especialidade: 'Ortopedia',
      status: 'Férias',
      crm: 'CRM/SP 789012',
      email: 'pedro.costa@exemplo.com',
      telefone: '(11) 97654-3210',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
      plantoes: 6,
      horasTrabalhadas: 36,
      valorReceber: 4320,
      ultimosPlantoes: [
        { data: '2025-02-25', local: 'UMS Campinas', valor: 720 },
        { data: '2025-02-28', local: 'UMS São Paulo', valor: 800 },
      ]
    },
    {
      id: 4,
      nome: 'Dra. Ana Oliveira',
      especialidade: 'Pediatria',
      status: 'Ativo',
      crm: 'CRM/SP 345678',
      email: 'ana.oliveira@exemplo.com',
      telefone: '(11) 98765-1234',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
      plantoes: 10,
      horasTrabalhadas: 60,
      valorReceber: 7200,
      ultimosPlantoes: [
        { data: '2025-03-03', local: 'UMS Juquitiba', valor: 720 },
        { data: '2025-03-07', local: 'UMS São Paulo', valor: 800 },
        { data: '2025-03-12', local: 'UMS Campinas', valor: 720 },
      ]
    },
    {
      id: 5,
      nome: 'Dr. Roberto Ferreira',
      especialidade: 'Neurologia',
      status: 'Ativo',
      crm: 'CRM/SP 901234',
      email: 'roberto.ferreira@exemplo.com',
      telefone: '(11) 91234-9876',
      documentos: ['identidade.pdf', 'diploma.pdf', 'crm.pdf'],
      plantoes: 7,
      horasTrabalhadas: 42,
      valorReceber: 5040,
      ultimosPlantoes: [
        { data: '2025-03-04', local: 'UMS São Paulo', valor: 800 },
        { data: '2025-03-09', local: 'UMS Campinas', valor: 720 },
      ]
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
      setMedicos(medicos.filter(p => p.id !== selectedProfessional.id));
      setIsDeleteModalOpen(false);
      setAlertType('success');
      setAlertMessage('Médico excluído com sucesso!');
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
        setMedicos(medicos.map(p => 
          p.id === selectedProfessional.id ? { ...data, id: selectedProfessional.id } : p
        ));
        setAlertType('success');
        setAlertMessage('Médico atualizado com sucesso!');
      } else {
        // Adicionar novo profissional
        const newId = Math.max(...medicos.map(p => p.id)) + 1;
        setMedicos([...medicos, { ...data, id: newId, plantoes: 0, horasTrabalhadas: 0, valorReceber: 0, ultimosPlantoes: [] }]);
        setAlertType('success');
        setAlertMessage('Médico cadastrado com sucesso!');
      }
      
      setIsFormModalOpen(false);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Erro ao salvar médico: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementação de busca seria feita aqui
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSpecialtyFilter('');
    setStatusFilter('');
  };

  const filteredMedicos = medicos.filter(medico => {
    const matchesSearch = searchTerm === '' || 
      medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === '' || medico.especialidade === specialtyFilter;
    const matchesStatus = statusFilter === '' || medico.status === statusFilter;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  // Dados para o dashboard
  const especialidadesData = [
    { name: 'Cardiologia', count: medicos.filter(m => m.especialidade === 'Cardiologia').length },
    { name: 'Clínica Geral', count: medicos.filter(m => m.especialidade === 'Clínica Geral').length },
    { name: 'Ortopedia', count: medicos.filter(m => m.especialidade === 'Ortopedia').length },
    { name: 'Pediatria', count: medicos.filter(m => m.especialidade === 'Pediatria').length },
    { name: 'Neurologia', count: medicos.filter(m => m.especialidade === 'Neurologia').length },
  ];

  const plantoesData = [
    { name: 'Dr. João Silva', plantoes: 12 },
    { name: 'Dra. Maria Santos', plantoes: 8 },
    { name: 'Dr. Pedro Costa', plantoes: 6 },
    { name: 'Dra. Ana Oliveira', plantoes: 10 },
    { name: 'Dr. Roberto Ferreira', plantoes: 7 },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
          <h1 className="text-2xl font-bold text-gray-800">Médicos</h1>
          <p className="text-gray-600">Gestão de médicos e especialistas</p>
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
            onClick={handleNewProfessional}
            icon={<UserPlus size={20} />}
          >
            Adicionar Médico
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Buscar médico..."
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
            {(searchTerm || specialtyFilter || statusFilter) && (
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
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              options={[
                { value: '', label: 'Todas as Especialidades' },
                { value: 'Cardiologia', label: 'Cardiologia' },
                { value: 'Clínica Geral', label: 'Clínica Geral' },
                { value: 'Ortopedia', label: 'Ortopedia' },
                { value: 'Pediatria', label: 'Pediatria' },
                { value: 'Neurologia', label: 'Neurologia' },
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
                { value: 'Inativo', label: 'Inativo' },
              ]}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'list'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Lista de Médicos
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CRM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plantões
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor a Receber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Nenhum médico encontrado
                    </td>
                  </tr>
                ) : (
                  filteredMedicos.map((medico) => (
                    <tr key={medico.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{medico.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{medico.especialidade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{medico.crm}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          medico.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {medico.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{medico.plantoes} ({medico.horasTrabalhadas}h)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(medico.valorReceber)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewProfessional(medico)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver Detalhes"
                          >
                            Detalhes
                          </button>
                          <button 
                            onClick={() => handleEditProfessional(medico)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Editar"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteProfessional(medico)}
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
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-700 font-medium mb-2">Total de Médicos</h3>
                <p className="text-2xl font-bold text-blue-800">{medicos.length}</p>
                <p className="text-sm text-blue-600">Cadastrados no sistema</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-700 font-medium mb-2">Médicos Ativos</h3>
                <p className="text-2xl font-bold text-green-800">
                  {medicos.filter(m => m.status === 'Ativo').length}
                </p>
                <p className="text-sm text-green-600">Disponíveis para plantões</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-yellow-700 font-medium mb-2">Total de Plantões</h3>
                <p className="text-2xl font-bold text-yellow-800">
                  {medicos.reduce((total, m) => total + m.plantoes, 0)}
                </p>
                <p className="text-sm text-yellow-600">Realizados no mês</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-700 font-medium mb-2">Valor Total</h3>
                <p className="text-2xl font-bold text-purple-800">
                  {formatCurrency(medicos.reduce((total, m) => total + m.valorReceber, 0))}
                </p>
                <p className="text-sm text-purple-600">A pagar no mês</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Médicos por Especialidade</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={especialidadesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" name="Médicos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Plantões por Médico</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plantoesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="plantoes" fill="#10b981" name="Plantões" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProfessional ? 'Editar Médico' : 'Novo Médico'}
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
        title="Detalhes do Médico"
      >
        {selectedProfessional && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base">{selectedProfessional.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Especialidade</p>
                <p className="text-base">{selectedProfessional.especialidade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CRM</p>
                <p className="text-base">{selectedProfessional.crm}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base">{selectedProfessional.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{selectedProfessional.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-base">{selectedProfessional.telefone}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Resumo de Plantões</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total de Plantões</p>
                  <p className="text-xl font-bold text-blue-800">{selectedProfessional.plantoes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Horas Trabalhadas</p>
                  <p className="text-xl font-bold text-blue-800">{selectedProfessional.horasTrabalhadas}h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Valor a Receber</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedProfessional.valorReceber)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Últimos Plantões</h3>
              {selectedProfessional.ultimosPlantoes && selectedProfessional.ultimosPlantoes.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedProfessional.ultimosPlantoes.map((plantao: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {new Date(plantao.data).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{plantao.local}</td>
                          <td className="px-4 py-2 text-sm text-green-600 font-medium">
                            {formatCurrency(plantao.valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhum plantão registrado</p>
              )}
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

      {/* Modal de Relatórios */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Relatórios de Médicos"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Tipo de Relatório</h3>
              <Select
                label="Selecione o relatório"
                options={[
                  { value: 'plantoes', label: 'Plantões por Médico' },
                  { value: 'pagamentos', label: 'Pagamentos' },
                  { value: 'especialidades', label: 'Médicos por Especialidade' },
                  { value: 'documentos', label: 'Documentação' },
                ]}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Formato e Período</h3>
              <div className="space-y-4">
                <Select
                  label="Formato do Relatório"
                  options={[
                    { value: 'pdf', label: 'PDF' },
                    { value: 'excel', label: 'Excel' },
                    { value: 'csv', label: 'CSV' },
                  ]}
                />
                
                <Select
                  label="Período"
                  options={[
                    { value: '30d', label: 'Últimos 30 dias' },
                    { value: '60d', label: 'Últimos 60 dias' },
                    { value: '90d', label: 'Últimos 90 dias' },
                    { value: 'custom', label: 'Período personalizado' },
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              icon={<FileText size={20} />}
            >
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o médico ${selectedProfessional?.nome}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Medicos;