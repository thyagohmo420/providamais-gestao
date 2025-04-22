import React from 'react';
import { Stethoscope, Search, Filter, Clock, Activity } from 'lucide-react';

const Ambulatorio = () => {
  const atendimentos = [
    {
      id: 1,
      paciente: 'Carlos Oliveira',
      tipo: 'Consulta',
      especialidade: 'Cardiologia',
      medico: 'Dr. João Silva',
      horario: '09:00',
      status: 'Em Andamento'
    },
    {
      id: 2,
      paciente: 'Ana Paula Santos',
      tipo: 'Retorno',
      especialidade: 'Ortopedia',
      medico: 'Dra. Maria Costa',
      horario: '10:30',
      status: 'Aguardando'
    },
    {
      id: 3,
      paciente: 'Roberto Ferreira',
      tipo: 'Emergência',
      especialidade: 'Clínica Geral',
      medico: 'Dr. Pedro Santos',
      horario: '08:15',
      status: 'Finalizado'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ambulatório</h1>
          <p className="text-gray-600">Controle de atendimentos e consultas</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Clock size={20} />
          <span>Novo Atendimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-medium mb-2">Total de Atendimentos</h3>
          <p className="text-2xl font-bold text-blue-800">45</p>
          <p className="text-sm text-blue-600">Hoje</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-700 font-medium mb-2">Em Atendimento</h3>
          <p className="text-2xl font-bold text-green-800">8</p>
          <p className="text-sm text-green-600">No momento</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-yellow-700 font-medium mb-2">Tempo Médio</h3>
          <p className="text-2xl font-bold text-yellow-800">25min</p>
          <p className="text-sm text-yellow-600">Por consulta</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-purple-700 font-medium mb-2">Emergências</h3>
          <p className="text-2xl font-bold text-purple-800">3</p>
          <p className="text-sm text-purple-600">Em espera</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar atendimento..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filtros</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Todas Especialidades</option>
              <option>Cardiologia</option>
              <option>Ortopedia</option>
              <option>Clínica Geral</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Todos Status</option>
              <option>Em Andamento</option>
              <option>Aguardando</option>
              <option>Finalizado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Médico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {atendimentos.map((atendimento) => (
                <tr key={atendimento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{atendimento.paciente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atendimento.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atendimento.especialidade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atendimento.medico}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atendimento.horario}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      atendimento.status === 'Em Andamento'
                        ? 'bg-yellow-100 text-yellow-800'
                        : atendimento.status === 'Aguardando'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {atendimento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                    <button className="text-gray-600 hover:text-gray-900">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Mostrando 1 - 3 de 45 atendimentos
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ambulatorio;