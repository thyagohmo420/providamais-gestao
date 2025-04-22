import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

const QrCodeGenerator = () => {
  const [nomeMedico, setNomeMedico] = useState('');
  const [qrCodeGerado, setQrCodeGerado] = useState(false);

  const gerarQrCode = () => {
    if (!nomeMedico.trim()) return;
    setQrCodeGerado(true);
  };

  const downloadQrCode = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${nomeMedico.replace(/\s+/g, '-').toLowerCase()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gerador de QR Code</h1>
        <p className="text-gray-600">
          Gere um QR Code para uso no sistema de ponto
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="nome-medico" className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Médico
          </label>
          <input
            id="nome-medico"
            type="text"
            value={nomeMedico}
            onChange={(e) => setNomeMedico(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dr. João Silva"
          />
        </div>

        {!qrCodeGerado ? (
          <button
            onClick={gerarQrCode}
            disabled={!nomeMedico.trim()}
            className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
              !nomeMedico.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Gerar QR Code
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <QRCodeSVG
                id="qr-code"
                value={nomeMedico}
                size={200}
                level={"H"}
                includeMargin={true}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={downloadQrCode}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                <Download size={20} />
                <span>Download QR Code</span>
              </button>
              
              <button
                onClick={() => {
                  setQrCodeGerado(false);
                  setNomeMedico('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Gerar Novo
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Instruções:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Faça o download do QR Code</li>
                <li>Imprima ou salve no seu celular</li>
                <li>Utilize para registrar seu ponto no sistema</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerator; 