import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown, Download } from 'lucide-react';
import Button from './Button';

const ManagerCompletedReport: React.FC = () => {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const allTasks = await apiBackend.tasks.getAll(user);
        const managerCompletedTasks = allTasks.filter(
          (task) => task.managerId === user.id && task.status === TaskStatus.DONE
        );
        setCompletedTasks(managerCompletedTasks);
      } catch (err: any) {
        setError('Failed to load completed tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [user]);

  const calculatePlannedDuration = (startDate?: string, endDate?: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateRealDuration = (startDate?: string, endDate?: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getVariance = (planned: number, real: number): number => {
    if (planned === 0) return 0;
    return real - planned;
  };

  const exportToCSV = () => {
    const headers = [
      'Programador',
      'Descricao',
      'DataPrevistaInicio',
      'DataPrevistaFim',
      'TipoTarefa',
      'DataRealInicio',
      'DataRealFim'
    ];

    const rows = completedTasks.map(task => [
      task.developerName || 'Unassigned',
      task.title,
      task.plannedStartDate || '',
      task.plannedEndDate || '',
      task.taskTypeName,
      task.realStartDate || '',
      task.realEndDate || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `completed_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Completed Tasks Report</h2>
          <p className="text-sm text-slate-500 mt-1">Overview of all completed tasks with planned vs real duration</p>
        </div>
        {completedTasks.length > 0 && (
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Completed</div>
          <div className="text-2xl font-bold text-slate-800">{completedTasks.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">On Time</div>
          <div className="text-2xl font-bold text-green-600">
            {completedTasks.filter(t => {
              const planned = calculatePlannedDuration(t.plannedStartDate, t.plannedEndDate);
              const real = calculateRealDuration(t.realStartDate, t.realEndDate);
              return real <= planned;
            }).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Delayed</div>
          <div className="text-2xl font-bold text-red-600">
            {completedTasks.filter(t => {
              const planned = calculatePlannedDuration(t.plannedStartDate, t.plannedEndDate);
              const real = calculateRealDuration(t.realStartDate, t.realEndDate);
              return real > planned;
            }).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Story Points</div>
          <div className="text-2xl font-bold text-indigo-600">
            {completedTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}
          </div>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200">
          <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-700">No completed tasks yet</p>
          <p className="text-sm text-slate-500 mt-2">Tasks will appear here once they are completed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Task</th>
                  <th className="px-6 py-4 whitespace-nowrap">Developer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Type</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">SP</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Planned Duration</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Real Duration</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedTasks.map((task) => {
                  const plannedDuration = calculatePlannedDuration(task.plannedStartDate, task.plannedEndDate);
                  const realDuration = calculateRealDuration(task.realStartDate, task.realEndDate);
                  const variance = getVariance(plannedDuration, realDuration);
                  const isDelayed = variance > 0;

                  return (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                      <td className="px-6 py-4 text-slate-700">{task.developerName}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium uppercase" style={{ color: task.taskTypeColor }}>
                          {task.taskTypeName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-700 font-mono">{task.storyPoints}</td>
                      <td className="px-6 py-4 text-center text-slate-700 font-semibold">
                        {plannedDuration}d
                      </td>
                      <td className="px-6 py-4 text-center text-slate-700 font-semibold">
                        {realDuration}d
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`flex items-center justify-center gap-1.5 font-semibold ${
                          isDelayed ? 'text-red-600' : variance === 0 ? 'text-slate-600' : 'text-green-600'
                        }`}>
                          {isDelayed ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : variance < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          {variance > 0 ? `+${variance}d` : variance === 0 ? '0d' : `${variance}d`}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerCompletedReport;

