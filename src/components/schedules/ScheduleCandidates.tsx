import React, { useState, useEffect } from 'react';
import { Schedule } from '../../types';
import { Check, X } from 'lucide-react';
import Button from '../ui/Button';

interface ScheduleCandidatesProps {
  schedule: Schedule;
  onApprove: (candidateId: string) => Promise<void>;
  onReject: (candidateId: string) => Promise<void>;
}

interface Candidate {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
    specialization?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

const ScheduleCandidates: React.FC<ScheduleCandidatesProps> = ({
  schedule,
  onApprove,
  onReject,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular carregamento de candidatos
    setLoading(true);
    
    // Dados simulados para demonstração
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        user: {
          id: 'user1',
          name: 'Dr. João Silva',
          role: 'doctor',
          specialization: 'Cardiologia'
        },
        status: 'pending',
        appliedAt: new Date().toISOString()
      },
      {
        id: '2',
        user: {
          id: 'user2',
          name: 'Dra. Maria Santos',
          role: 'doctor',
          specialization: 'Clínica Geral'
        },
        status: 'pending',
        appliedAt: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
      },
      {
        id: '3',
        user: {
          id: 'user3',
          name: 'Enf. Carlos Oliveira',
          role: 'nurse'
        },
        status: 'approved',
        appliedAt: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
      }
    ];
    
    setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 500);
  }, [schedule.id]);

  const handleApprove = async (candidateId: string) => {
    try {
      await onApprove(candidateId);
      setCandidates(candidates.map(c => 
        c.id === candidateId ? { ...c, status: 'approved' } : c
      ));
    } catch (error) {
      console.error('Erro ao aprovar candidato:', error);
    }
  };

  const handleReject = async (candidateId: string) => {
    try {
      await onReject(candidateId);
      setCandidates(candidates.map(c => 
        c.id === candidateId ? { ...c, status: 'rejected' } : c
      ));
    } catch (error) {
      console.error('Erro ao rejeitar candidato:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return <div className="text-center py-4">Carregando candidatos...</div>;
  }

  if (candidates.length === 0) {
    return <div className="text-center py-4">Nenhum candidato encontrado para este plantão.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Candidatos ao Plantão</h3>
      
      {candidates.map((candidate) => (
        <div 
          key={candidate.id} 
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {candidate.user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{candidate.user.name}</p>
                <p className="text-xs text-gray-500">{candidate.user.specialization || candidate.user.role}</p>
              </div>
            </div>
            <div className="mt-2 md:mt-0 md:ml-12 text-xs text-gray-500">
              Candidatura: {formatDate(candidate.appliedAt)}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            {candidate.status === 'pending' ? (
              <>
                <Button
                  onClick={() => handleApprove(candidate.id)}
                  variant="primary"
                  className="px-3 py-1 text-sm"
                  icon={<Check size={16} />}
                >
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleReject(candidate.id)}
                  variant="danger"
                  className="px-3 py-1 text-sm"
                  icon={<X size={16} />}
                >
                  Rejeitar
                </Button>
              </>
            ) : (
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                candidate.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {candidate.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleCandidates;