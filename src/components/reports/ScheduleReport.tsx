import React, { useState } from 'react';
import { Schedule } from '../../types';
import { Calendar, Download, Printer, FileText, Filter } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';

interface ScheduleReportProps {
  schedules: Schedule[];
  onGenerateReport: (format: 'pdf' | 'excel' | 'csv', dateRange: string, filters: any) => Promise<string>;
  isLoading?: boolean;
}

const ScheduleReport: React.FC<ScheduleReportProps> = ({
  schedules,
  onGenerateReport,
  isLoading = false,
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportUrl, setReportUrl] = useState<string>('');
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setSuccess(false);
      setReportUrl('');
      
      const filters = {
        department: departmentFilter,
        sector: sectorFilter,
        status: statusFilter,
        startDate: showCustomDateRange ? startDate : undefined,
        endDate: showCustomDateRange ? endDate : undefined,
      };
      
      const url = await onGenerateReport(format, dateRange, filters);
      
      if (url) {
        setReportUrl(url);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    setShowCustomDateRange(value === 'custom');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold">Relatório de Escalas</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Formato e Período</h3>
          
          <div className="space-y-4">
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
              onChange={(e) => handleDateRangeChange(e.target.value)}
              options={[
                { value: '7d', label: 'Últimos 7 dias' },
                { value: '30d', label: 'Últimos 30 dias' },
                { value: '60d', label: 'Últimos 60 dias' },
                { value: '90d', label: 'Últimos 90 dias' },
                { value: 'custom', label: 'Período personalizado' },
              ]}
            />
            
            {showCustomDateRange && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Data Inicial"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="Data Final"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Filtros</h3>
          
          <div className="space-y-4">
            <Select
              label="Departamento"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Departamentos' },
                { value: 'Cardiologia', label: 'Cardiologia' },
                { value: 'Ortopedia', label: 'Ortopedia' },
                { value: 'Clínica Geral', label: 'Clínica Geral' },
                { value: 'UTI', label: 'UTI' },
                { value: 'Emergência', label: 'Emergência' },
              ]}
            />
            
            <Select
              label="Setor"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Setores' },
                { value: 'presencial', label: 'Atendimento Presencial' },
                { value: 'telemedicina', label: 'Telemedicina' },
              ]}
            />
            
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os Status' },
                { value: 'scheduled', label: 'Agendado' },
                { value: 'completed', label: 'Concluído' },
                { value: 'cancelled', label: 'Cancelado' },
              ]}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600">
            Total de escalas no período: <span className="font-semibold">{schedules.length}</span>
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleGenerateReport}
            isLoading={generating || isLoading}
            icon={<FileText size={20} />}
          >
            Gerar Relatório
          </Button>
          
          {reportUrl && (
            <>
              <Button
                variant="secondary"
                icon={<Printer size={20} />}
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
                  link.download = reportUrl.split('/').pop() || 'relatorio-escalas';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </Button>
            </>
          )}
        </div>
      </div>
      
      {success && (
        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg">
          <p className="flex items-center">
            <FileText className="mr-2" size={20} />
            Relatório gerado com sucesso! Você pode visualizá-lo ou fazer o download.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleReport;