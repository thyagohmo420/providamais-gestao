import React from 'react';
import { DollarSign, TrendingUp, Download, Filter } from 'lucide-react';

const Financeiro = () => {
  const financialData = [
    {
      id: 1,
      description: 'Consultas Médicas',
      revenue: 'R$ 45.000',
      expenses: 'R$ 25.000',
      profit: 'R$ 20.000',
      change: '+15%'
    },
    {
      id: 2,
      description: 'Procedimentos Cirúrgicos',
      revenue: 'R$ 120.000',
      expenses: 'R$ 80.000',
      profit: 'R$ 40.000',
      change: '+8%'
    },
    {
      id: 3,
      description: 'Exames Laboratoriais',
      revenue: 'R$ 35.000',
      expenses: 'R$ 20.000',
      profit: 'R$ 15.000',
      change: '+12%'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão Financeira</h1>
          <p className="text-gray-600">Controle financeiro e relatórios</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download size={20} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">R$ 250K</h3>
          <p className="text-gray-600">Receita Mensal</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="text-red-600" size={24} />
            </div>
            <span className="text-sm font-medium text-red-600">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">R$ 150K</h3>
          <p className="text-gray-600">Despesas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-medium text-blue-600">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">R$ 100K</h3>
          <p className="text-gray-600">Lucro Líquido</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-medium text-purple-600">95%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">R$ 45K</h3>
          <p className="text-gray-600">Contas a Receber</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Demonstrativo Financeiro</h2>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={20} />
            <span>Filtros</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Despesas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lucro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Variação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {financialData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.expenses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.profit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {item.change}
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

export default Financeiro;