import React, { useState, useEffect } from 'react';
import { Clock, QrCode, FilePlus, RefreshCw, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import QrScanner from '../components/QrScanner';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface RegistroPonto {
  tipo: 'Entrada' | 'Almoço' | 'Retorno do Almoço' | 'Saída';
  data: Date;
  nomeMedico: string;
}

// Lista de médicos para demonstração
const medicos = [
  'Dr. João Silva',
  'Dra. Maria Santos',
  'Dr. Pedro Oliveira',
  'Dra. Ana Pereira',
  'Dr. Carlos Ferreira'
];

const BatePonto = () => {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [mostrarScanner, setMostrarScanner] = useState(false);
  const [medicoAtual, setMedicoAtual] = useState<string | null>(null);
  const [dataHoraAtual, setDataHoraAtual] = useState<Date>(new Date());
  const [qrCodeAleatório, setQrCodeAleatório] = useState<string>('');
  const [pontoRegistrado, setPontoRegistrado] = useState<RegistroPonto | null>(null);
  const [tipoRegistro, setTipoRegistro] = useState<'Entrada' | 'Almoço' | 'Retorno do Almoço' | 'Saída'>('Entrada');

  // Atualiza a hora a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setDataHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gera um QR code aleatório quando a página é carregada
  useEffect(() => {
    gerarNovoQrCode();
  }, []);

  const handleScan = (data: string) => {
    try {
      console.log("QR Code escaneado com sucesso:", data);
      
      // Registra o ponto automaticamente quando o QR code é escaneado
      setMedicoAtual(data);
      setMostrarScanner(false);
      
      // Registra o ponto automaticamente com o tipo selecionado
      const horarioAtual = new Date();
      const novoRegistro: RegistroPonto = {
        tipo: tipoRegistro,
        data: horarioAtual,
        nomeMedico: data
      };
      
      setRegistros(prev => [...prev, novoRegistro]);
      setPontoRegistrado(novoRegistro);
      
      // Limpa o registro após 5 segundos
      setTimeout(() => {
        setPontoRegistrado(null);
        setMedicoAtual(null);
        gerarNovoQrCode();
      }, 5000);
      
    } catch (error) {
      console.error("Erro ao processar dados do QR code:", error);
    }
  };

  const registrarPonto = (tipo: 'Entrada' | 'Almoço' | 'Retorno do Almoço' | 'Saída') => {
    if (!medicoAtual) return;

    const novoRegistro: RegistroPonto = {
      tipo,
      data: new Date(),
      nomeMedico: medicoAtual
    };

    setRegistros([...registros, novoRegistro]);
    setPontoRegistrado(novoRegistro);
    
    // Limpa o registro após 5 segundos
    setTimeout(() => {
      setPontoRegistrado(null);
      setMedicoAtual(null);
      gerarNovoQrCode();
    }, 5000);
  };

  const gerarNovoQrCode = () => {
    // Seleciona um médico aleatório da lista
    const medicoAleatorio = medicos[Math.floor(Math.random() * medicos.length)];
    // Use apenas o nome do médico, sem formatação de URL
    setQrCodeAleatório(medicoAleatorio);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registro de Ponto</h1>
          <p className="text-gray-600">
            Escaneie o QR code para registrar seu ponto
          </p>
        </div>
        <Link 
          to="/qrcode-generator"
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
        >
          <FilePlus size={18} />
          <span>Gerar QR Code</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna do QR Code */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">QR Code do Médico</h2>
            <button 
              onClick={gerarNovoQrCode}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <RefreshCw size={16} />
              <span className="text-sm">Gerar novo</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="mb-4">
              <QRCodeSVG
                id="qr-code-display"
                value={qrCodeAleatório}
                size={200}
                level={"H"}
                includeMargin={true}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
              />
            </div>
            <p className="text-center text-gray-700 font-medium mt-2">{qrCodeAleatório}</p>
            <p className="text-center text-gray-500 text-sm mt-1">
              Escaneie este QR code com o botão abaixo
            </p>
            <p className="text-center text-xs text-gray-400 mt-3">
              QR code contém apenas o nome do médico, sem URLs
            </p>
            
            {/* Botão para teste - simula escaneamento do QR code atual */}
            <button
              onClick={() => handleScan(qrCodeAleatório)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span>Simular escaneamento (apenas teste)</span>
            </button>
          </div>
        </div>

        {/* Coluna do Registro */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-600" />
              <span className="text-lg font-medium">
                {format(dataHoraAtual, "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: ptBR })}
              </span>
            </div>
          </div>

          {pontoRegistrado ? (
            <div className="flex flex-col items-center py-8 px-4 border-2 border-green-300 bg-green-50 rounded-lg mb-6">
              <CheckCircle size={64} className="text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Ponto Batido</h2>
              <p className="text-xl font-semibold text-gray-800 mb-1">{pontoRegistrado.nomeMedico}</p>
              <p className="text-lg text-gray-700 mb-1">{pontoRegistrado.tipo}</p>
              <p className="text-gray-600">
                {format(pontoRegistrado.data, "dd/MM/yyyy 'às' HH:mm:ss")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
              {!medicoAtual ? (
                <>
                  <div className="mb-4">
                    <select
                      value={tipoRegistro}
                      onChange={(e) => setTipoRegistro(e.target.value as any)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    >
                      <option value="Entrada">Entrada</option>
                      <option value="Almoço">Almoço</option>
                      <option value="Retorno do Almoço">Retorno do Almoço</option>
                      <option value="Saída">Saída</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setMostrarScanner(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <QrCode size={20} />
                    <span>Escanear QR Code</span>
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{medicoAtual}</h2>
                  <p className="text-gray-600 mb-6">
                    {format(dataHoraAtual, "dd/MM/yyyy HH:mm:ss")}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => registrarPonto('Entrada')}
                      className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Entrada
                    </button>
                    <button
                      onClick={() => registrarPonto('Almoço')}
                      className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Almoço
                    </button>
                    <button
                      onClick={() => registrarPonto('Retorno do Almoço')}
                      className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Retorno do Almoço
                    </button>
                    <button
                      onClick={() => registrarPonto('Saída')}
                      className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Saída
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {registros.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registros Recentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registros.map((registro, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {registro.nomeMedico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registro.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(registro.data, "dd/MM/yyyy HH:mm:ss")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mostrarScanner && (
        <QrScanner
          onScan={handleScan}
          onClose={() => setMostrarScanner(false)}
        />
      )}
    </div>
  );
};

export default BatePonto; 