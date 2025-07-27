import  { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  overtimeThisWeek: number;
  pendingJustifications: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 25,
    presentToday: 22,
    absentToday: 2,
    lateToday: 3,
    overtimeThisWeek: 45.5,
    pendingJustifications: 5,
  });

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'clock-in',
      employee: 'João Silva',
      time: '08:15',
      status: 'late',
      description: 'Entrada registrada com 15 min de atraso'
    },
    {
      id: '2',
      type: 'justification',
      employee: 'Maria Santos',
      time: '09:30',
      status: 'pending',
      description: 'Solicitação de justificativa de falta'
    },
    {
      id: '3',
      type: 'overtime',
      employee: 'Carlos Oliveira',
      time: '18:30',
      status: 'approved',
      description: 'Hora extra aprovada - 2.5h'
    },
    {
      id: '4',
      type: 'clock-out',
      employee: 'Ana Costa',
      time: '17:45',
      status: 'normal',
      description: 'Saída registrada no horário'
    },
  ]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color, 
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  !trend.isPositive ? 'transform rotate-180' : ''
                }`} />
                <span>{trend.value}% vs semana passada</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">
            Visão geral do controle de ponto - {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Adicionar Funcionário
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Funcionários"
          value={stats.totalEmployees}
          subtitle="Ativos no sistema"
          icon={Users}
          color="bg-blue-100 text-blue-600"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Presentes Hoje"
          value={stats.presentToday}
          subtitle={`${((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)}% da equipe`}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatCard
          title="Ausentes Hoje"
          value={stats.absentToday}
          subtitle="Funcionários ausentes"
          icon={XCircle}
          color="bg-red-100 text-red-600"
          trend={{ value: 12, isPositive: false }}
        />
        
        <StatCard
          title="Atrasos Hoje"
          value={stats.lateToday}
          subtitle="Registros com atraso"
          icon={AlertTriangle}
          color="bg-yellow-100 text-yellow-600"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Horas Extras (Semana)"
          value={`${stats.overtimeThisWeek}h`}
          subtitle="Total de horas extras"
          icon={Clock}
          color="bg-purple-100 text-purple-600"
          trend={{ value: 15, isPositive: true }}
        />
        
        <StatCard
          title="Justificativas Pendentes"
          value={stats.pendingJustifications}
          subtitle="Aguardando aprovação"
          icon={FileText}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    activity.status === 'late' ? 'bg-red-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'approved' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.employee}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" fullWidth className="justify-start">
                <Users className="w-4 h-4 mr-3" />
                Gerenciar Funcionários
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Aprovar Justificativas
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Gerar Relatório Mensal
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <Clock className="w-4 h-4 mr-3" />
                Configurar Regras de Ponto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Visão por Departamento</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Desenvolvimento', present: 8, total: 10, overtime: 12.5 },
              { name: 'Marketing', present: 5, total: 6, overtime: 3.2 },
              { name: 'Vendas', present: 9, total: 9, overtime: 8.7 },
            ].map((dept) => (
              <div key={dept.name} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{dept.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Presentes:</span>
                    <span className="font-medium">{dept.present}/{dept.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Horas extras:</span>
                    <span className="font-medium">{dept.overtime}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dept.present / dept.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}