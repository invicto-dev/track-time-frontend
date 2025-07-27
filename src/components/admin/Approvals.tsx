import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Toast } from '../ui/Toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User,
  Calendar,
  MessageSquare,
  Eye,
  Filter
} from 'lucide-react';

interface PendingApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'justification' | 'overtime' | 'time-adjustment' | 'vacation';
  date: string;
  reason: string;
  details: any;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
}

export function Approvals() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [comment, setComment] = useState('');

  const [approvals, setApprovals] = useState<PendingApproval[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'João Silva',
      department: 'Desenvolvimento',
      type: 'justification',
      date: '2024-01-15',
      reason: 'Consulta médica de emergência',
      details: {
        originalType: 'absence',
        duration: '4 horas'
      },
      submittedAt: '2024-01-15T09:30:00Z',
      priority: 'high',
      attachments: ['atestado-medico.pdf']
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Maria Santos',
      department: 'Marketing',
      type: 'overtime',
      date: '2024-01-14',
      reason: 'Finalização de projeto urgente',
      details: {
        startTime: '18:00',
        endTime: '22:00',
        totalHours: 4
      },
      submittedAt: '2024-01-14T22:15:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Carlos Oliveira',
      department: 'Vendas',
      type: 'time-adjustment',
      date: '2024-01-13',
      reason: 'Erro no registro de saída',
      details: {
        originalTime: '17:30',
        requestedTime: '18:00',
        difference: '30 minutos'
      },
      submittedAt: '2024-01-13T08:00:00Z',
      priority: 'low'
    }
  ]);

  const handleApproval = (approvalId: string, action: 'approve' | 'reject') => {
    setApprovals(approvals.filter(a => a.id !== approvalId));
    
    const actionText = action === 'approve' ? 'aprovada' : 'rejeitada';
    setToast({ 
      message: `Solicitação ${actionText} com sucesso!`, 
      type: action === 'approve' ? 'success' : 'info' 
    });
    
    setSelectedApproval(null);
    setComment('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'justification': return 'Justificativa';
      case 'overtime': return 'Hora Extra';
      case 'time-adjustment': return 'Ajuste de Horário';
      case 'vacation': return 'Férias';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'justification': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'overtime': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'time-adjustment': return <Clock className="w-5 h-5 text-purple-600" />;
      case 'vacation': return <Calendar className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    if (selectedFilter === 'all') return true;
    return approval.type === selectedFilter;
  });

  const pendingCount = approvals.length;
  const highPriorityCount = approvals.filter(a => a.priority === 'high').length;
  const todayCount = approvals.filter(a => 
    new Date(a.submittedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aprovações Pendentes</h1>
          <p className="text-gray-600">
            Gerencie solicitações que aguardam aprovação
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pendente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Alta Prioridade</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Processadas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'Todas', count: approvals.length },
            { id: 'justification', label: 'Justificativas', count: approvals.filter(a => a.type === 'justification').length },
            { id: 'overtime', label: 'Horas Extras', count: approvals.filter(a => a.type === 'overtime').length },
            { id: 'time-adjustment', label: 'Ajustes', count: approvals.filter(a => a.type === 'time-adjustment').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedFilter === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Approvals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Solicitações ({filteredApprovals.length})
            </h3>
          </CardHeader>
          <CardContent>
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma solicitação pendente</p>
                <p className="text-sm text-gray-500">
                  Todas as aprovações estão em dia!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((approval) => (
                  <div 
                    key={approval.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedApproval?.id === approval.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedApproval(approval)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(approval.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900">
                              {approval.employeeName}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                              {approval.priority === 'high' ? 'Alta' : 
                               approval.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {approval.department} • {getTypeLabel(approval.type)}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            {approval.reason}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {new Date(approval.date).toLocaleDateString('pt-BR')}
                            </span>
                            <span>
                              Enviado: {new Date(approval.submittedAt).toLocaleDateString('pt-BR')}
                            </span>
                            {approval.attachments && approval.attachments.length > 0 && (
                              <span className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                {approval.attachments.length} anexo(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Details */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedApproval ? 'Detalhes da Solicitação' : 'Selecione uma Solicitação'}
            </h3>
          </CardHeader>
          <CardContent>
            {selectedApproval ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedApproval.type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTypeLabel(selectedApproval.type)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedApproval.employeeName} • {selectedApproval.department}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data:</p>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedApproval.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Motivo:</p>
                    <p className="text-sm text-gray-700">{selectedApproval.reason}</p>
                  </div>

                  {selectedApproval.details && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Detalhes:</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        {Object.entries(selectedApproval.details).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApproval.attachments && selectedApproval.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Anexos:</p>
                      <div className="space-y-1">
                        {selectedApproval.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                            <FileText className="w-4 h-4" />
                            <span>{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Comentário (opcional):
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adicione um comentário sobre sua decisão..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleApproval(selectedApproval.id, 'approve')}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproval(selectedApproval.id, 'reject')}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecione uma solicitação</p>
                <p className="text-sm text-gray-500">
                  Clique em uma solicitação para ver os detalhes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}