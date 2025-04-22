import React from 'react';
import { FileText, Download, Filter, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Relatorios = () => {
  const monthlyData = [
    { month: 'Jan', atendimentos: 420, internacoes: 120, cirurgias: 45 },
    { month: 'Fev', atendimentos: 380, internacoes: 110, cirurgias: 38 },
    { month: 'Mar', atendimentos: 450, internacoes: 130, cirurgias: 52 },
    { month: 'Abr', atendimentos: 400, internacoes: 115, cirurgias: 48 },
    { month: 'Mai', atendimentos: 480, internacoes: 140, cirurgias: 55 },
    { month: 'Jun', atendimentos: 460, internacoes: 125, cirurgias: 50 },
  ];

  const reports = [
    {
      id: 1,
      title: 'Relatório de Atendimentos',
      period: 'Junho 2024',
      department: 'Ambulatório',
      status: 'Disponível'
    },
    {
      id: 2,
      title: 'Indicadores de Desempenho',
      period: 'Junho 2024',
      department: 'Geral',
      status: 'Processando'
    },
    {
      id: 3,
      title: 'Relatório Financeiro',
      period: 'Junho 2024',
      department: 'Financeiro',
      status: 'Disponível'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600">Análise e exportação de dados</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <FileText size={20} />
          <span>Novo Relatório</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Visão Geral</h2>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                <option>Últimos 6 meses</option>
                <option>Último ano</option>
                <option>Último trimestre</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="atendimentos" fill="#3b82f6" name="Atendimentos" />
                <Bar dataKey="internacoes" fill="#10b981" name="Internações" />
                <Bar dataKey="cirurgias" fill="#8b5cf6" name="Cirurgias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Indicadores Principais</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-700">Taxa de Ocupação</span>
                <span className="text-blue-600">85%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-700">Satisfação do Paciente</span>
                <span className="text-green-600">92%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-700">Tempo Médio de Espera</span>
                <span className="text-purple-600">15 min</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Relatórios Disponíveis</h2>
          <div className="flex items-center space-x-2">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Todos os Departamentos</option>
              <option>Ambulatório</option>
              <option>Financeiro</option>
              <option>Recursos Humanos</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BarChart2 className="text-gray-400 mr-2" size={20} />
                      <span className="text-sm font-medium text-gray-900">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Disponível'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className={`text-blue-600 hover:text-blue-900 ${
                        report.status !== 'Disponível' && 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={report.status !== 'Disponível'}
                    >
                      <Download size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;