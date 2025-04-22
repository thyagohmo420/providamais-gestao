import React from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  DollarSign,
  BedDouble,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const stats = [
    { icon: Users, label: 'Total de Pacientes', value: '1.234', change: '+12%', color: 'blue' },
    { icon: Calendar, label: 'Consultas Hoje', value: '150', change: '+5%', color: 'green' },
    { icon: Activity, label: 'Cirurgias', value: '48', change: '-3%', color: 'red' },
    { icon: DollarSign, label: 'Receita Mensal', value: 'R$ 125K', change: '+8%', color: 'purple' },
  ];

  const occupancyData = [
    { name: 'Jan', ocupacao: 65 },
    { name: 'Fev', ocupacao: 75 },
    { name: 'Mar', ocupacao: 85 },
    { name: 'Abr', ocupacao: 70 },
    { name: 'Mai', ocupacao: 90 },
    { name: 'Jun', ocupacao: 82 },
  ];

  const emergencyAlerts = [
    { title: 'Emergência - Trauma', time: '5 min atrás', priority: 'high' },
    { title: 'UTI - Leito 5', time: '15 min atrás', priority: 'medium' },
    { title: 'Laboratório - Resultados', time: '30 min atrás', priority: 'low' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="text-gray-600">Bem-vindo de volta, Administrador</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Taxa de Ocupação</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="ocupacao" 
                  stroke="#3b82f6" 
                  fill="#93c5fd" 
                  name="Ocupação (%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Status do Hospital</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BedDouble className="text-blue-600" />
                <span className="text-gray-700">Leitos Disponíveis</span>
              </div>
              <span className="font-semibold">24/50</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="text-green-600" />
                <span className="text-gray-700">Tempo Médio de Espera</span>
              </div>
              <span className="font-semibold">15 min</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-purple-600" />
                <span className="text-gray-700">Taxa de Ocupação UTI</span>
              </div>
              <span className="font-semibold">85%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Alertas de Emergência</h2>
          <div className="space-y-4">
            {emergencyAlerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <AlertCircle className={`
                  ${alert.priority === 'high' ? 'text-red-500' : 
                    alert.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}
                `} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {[
              { text: 'Novo paciente admitido na Emergência', time: '2 horas atrás' },
              { text: 'Cirurgia agendada - Dr. Silva', time: '3 horas atrás' },
              { text: 'Resultados de exames disponíveis', time: '4 horas atrás' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;