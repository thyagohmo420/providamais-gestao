import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Alert from '../ui/Alert';

interface ReportGeneratorProps {
  title: string;
  onGenerate: (format: 'pdf' | 'excel' | 'csv', dateRange: string) => Promise<string>;
  isLoading?: boolean;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  title,
  onGenerate,
  isLoading = false,
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [reportUrl, setReportUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleGenerate = async () => {
    try {
      setError('');
      setSuccess(false);
      setReportUrl('');
      
      const url = await onGenerate(format, dateRange);
      
      if (url) {
        setReportUrl(url);
        setSuccess(true);
      } else {
        setError('Não foi possível gerar o relatório. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao gerar relatório: ' + (err as Error).message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
          className="mb-4"
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message="Relatório gerado com sucesso!" 
          onClose={() => setSuccess(false)}
          className="mb-4"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Select
          label="Formato do Relatório"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'excel', label: 'Excel' },
            { value: 'csv', label: 'CSV' },
          ]}
        />
        
        <Select
          label="Período"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          options={[
            { value: '24h', label: 'Últimas 24 horas' },
            { value: '7d', label: 'Últimos 7 dias' },
            { value: '30d', label: 'Últimos 30 dias' },
            { value: '60d', label: 'Últimos 60 dias' },
            { value: '90d', label: 'Últimos 90 dias' },
          ]}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          icon={<FileText size={20} />}
        >
          Gerar Relatório
        </Button>
        
        {reportUrl && (
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              icon={format === 'pdf' ? <FileText size={20} /> : 
                    format === 'excel' ? <FileSpreadsheet size={20} /> : 
                    <FileCode size={20} />}
              onClick={() => window.open(reportUrl, '_blank')}
            >
              Visualizar
            </Button>
            <Button
              variant="secondary"
              icon={<Download size={20} />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = reportUrl;
                link.download = reportUrl.split('/').pop() || 'relatorio';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;