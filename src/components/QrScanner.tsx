import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data && data.text) {
      // Usa diretamente o texto do QR code sem qualquer processamento
      console.log("QR Code escaneado:", data.text);
      onScan(data.text);
    }
  };

  const handleError = (err: any) => {
    setError('Erro ao escanear o QR Code. Por favor, tente novamente.');
    console.error(err);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Escanear QR Code</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="relative">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            constraints={{
              video: {
                facingMode: 'environment'
              }
            }}
          />
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          Posicione o QR Code dentro da área de escaneamento
        </div>
      </div>
    </div>
  );
};

export default QrScanner; 