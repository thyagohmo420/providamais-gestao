import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import GestaoEquipe from './pages/GestaoEquipe';
import Escalas from './pages/Escalas';
import Pacientes from './pages/Pacientes';
import Ambulatorio from './pages/Ambulatorio';
import Equipamentos from './pages/Equipamentos';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Medicos from './pages/Medicos';
import BatePonto from './pages/BatePonto';
import QrCodeGenerator from './pages/QrCodeGenerator';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-blue-900 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pessoal" element={<GestaoEquipe />} />
              <Route path="/escalas" element={<Escalas />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/ambulatorio" element={<Ambulatorio />} />
              <Route path="/equipamentos" element={<Equipamentos />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/bate-ponto" element={<BatePonto />} />
              <Route path="/qrcode-generator" element={<QrCodeGenerator />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;