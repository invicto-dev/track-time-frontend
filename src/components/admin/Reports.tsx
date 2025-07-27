import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toast } from '../ui/Toast';
import { 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  Clock,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';
import { useReports } from '../../hooks/useReports';

interface ReportData {
  employee: string;
  department: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  absences: number;
  lateArrivals: number;
  efficiency: number;
}

export function Reports() {
  const { user } = useAuth();
  const { reports, isLoading, generateReport } = useReports();
  const [selectedReport, setSelectedReport] = useState('INDIVIDUAL');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês
    end: new Date().toISOString().split('T')[0] // Hoje
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentReportData, setCurrentReportData] = useState<ReportData[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const departments = ['Desenvolvimento', 'Recursos Humanos', 'Marketing', 'Vendas'];

  const handleGenerateReport = async () => {
    try {
      const filters = {
        departments: selectedDepartments,
        employees: selectedEmployees
      };

      const newReport = await generateReport({
        type: selectedReport as 'INDIVIDUAL' | 'DEPARTMENT' | 'COMPANY',
        periodStart: dateRange.start,
        periodEnd: dateRange.end,
        filters
      });

      // Processar dados do relatório para exibição
      if (newReport && newReport.data) {
        const parsedData = JSON.parse(newReport.data);
        setCurrentReportData(parsedData.reportData || []);
      }

      setToast({ message: 'Relatório gerado com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Erro ao gerar relatório', 
        type: 'error' 
      });
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (currentReportData.length === 0) {
      setToast({ message: 'Gere um relatório primeiro antes de exportar', type: 'warning' });
      return;
    }

    const filename = `relatorio-${selectedReport.toLowerCase()}-${dateRange.start}-${dateRange.end}.${format}`;
    
    if (format === 'csv') {
      const csvContent = currentReportData.map(row => 
        `${row.employee},${row.department},${row.totalHours},${row.regularHours},${row.overtimeHours},${row.absences},${row.lateArrivals},${row.efficiency}`
      ).join('\n');
      
      const blob = new Blob([`Funcionário,Departamento,Total Horas,Horas Regulares,Horas Extras,Faltas,Atrasos,Eficiência\n${csvContent}`], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setToast({ message: `Relatório CSV exportado: ${filename}`, type: 'success' });
    } else {
      // Para PDF/Excel, você pode implementar uma biblioteca como jsPDF ou xlsx
      setToast({ message: `Funcionalidade de export ${format.toUpperCase()} será implementada em breve`, type: 'info' });
    }
  };

  // Calcular estatísticas dos dados atuais
  const totalHours = currentReportData.reduce((sum, r) => sum + r.totalHours, 0);
  const totalOvertime = currentReportData.reduce((sum, r) => sum + r.overtimeHours, 0);
  const totalAbsences = currentReportData.reduce((sum, r) => sum + r.absences, 0);
  const averageEfficiency = currentReportData.length > 0 
    ? currentReportData.reduce((sum, r) => sum + r.efficiency, 0) / currentReportData.length 
    : 0;

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
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">
            Gere e exporte relatórios detalhados de ponto
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport('csv')} disabled={currentReportData.length === 0}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')} disabled={currentReportData.length === 0}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => exportReport('pdf')} disabled={currentReportData.length === 0}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Configuração do Relatório</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Relatório
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={user?.role !== 'ADMIN'}
              >
                <option value="INDIVIDUAL">Individual</option>
                {user?.role === 'ADMIN' && (
                  <>
                    <option value="DEPARTMENT">Por Departamento</option>
                    <option value="COMPANY">Geral da Empresa</option>
                  </>
                )}
              </select>
            </div>

            <Input
              type="date"
              label="Data Inicial"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />

            <Input
              type="date"
              label="Data Final"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />

            {user?.role === 'ADMIN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedDepartments(values);
                  }}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {currentReportData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total de Horas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalHours.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Horas Extras</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalOvertime.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Faltas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalAbsences}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Eficiência Média</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averageEfficiency.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Horas por Departamento</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map(dept => {
                    const deptData = currentReportData.filter(r => r.department === dept);
                    const deptHours = deptData.reduce((sum, r) => sum + r.totalHours, 0);
                    const percentage = totalHours > 0 ? (deptHours / totalHours) * 100 : 0;
                    
                    if (deptHours === 0) return null;
                    
                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">{dept}</span>
                          <span className="text-gray-600">{deptHours.toFixed(1)}h ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Eficiência por Funcionário</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentReportData.map(employee => (
                    <div key={employee.employee} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{employee.employee}</p>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              employee.efficiency >= 95 ? 'bg-green-600' :
                              employee.efficiency >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${employee.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {employee.efficiency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Relatório Detalhado</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Funcionário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Horas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horas Extras
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Faltas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atrasos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eficiência
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentReportData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{row.employee}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.totalHours.toFixed(1)}h</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.overtimeHours.toFixed(1)}h</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.absences}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.lateArrivals}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            row.efficiency >= 95 ? 'text-green-600' :
                            row.efficiency >= 85 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {row.efficiency.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {currentReportData.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum relatório gerado ainda</p>
              <p className="text-sm text-gray-500">
                Configure os filtros acima e clique em "Gerar Relatório"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}