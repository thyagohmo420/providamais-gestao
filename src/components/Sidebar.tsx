import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Stethoscope, Calculator, ClipboardList, Settings, LogOut, Bed, Activity, User as UserMd, Clock } from 'lucide-react';

import logo from "../assets/provida-logo.png";

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel Principal', path: '/' },
    { icon: Users, label: 'Gestão de Pessoal', path: '/pessoal' },
    { icon: Calendar, label: 'Escalas', path: '/escalas' },
    { icon: UserMd, label: 'Médicos', path: '/medicos' },
    { icon: Clock, label: 'Bate Ponto', path: '/bate-ponto' },
    { icon: Bed, label: 'Pacientes', path: '/pacientes' },
    { icon: Activity, label: 'Ambulatório', path: '/ambulatorio' },
    { icon: Stethoscope, label: 'Equipamentos', path: '/equipamentos' },
    { icon: Calculator, label: 'Financeiro', path: '/financeiro' },
    { icon: ClipboardList, label: 'Relatórios', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">ProVida+ Gestão</h1>
        <p className="text-sm text-gray-500">Sistema Hospitalar</p>
      </div>
      
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 text-gray-600 hover:text-red-600 w-full px-4 py-3">
          <LogOut size={20} />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;