import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, AlertCircle, PlayCircle, Circle } from 'lucide-react';

const ManagerInProgressReport: React.FC = () => {
  const { user } = useAuth();
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInProgressTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const allTasks = await apiBackend.tasks.getAll(user);
        const managerInProgressTasks = allTasks.filter(
          (task) => task.managerId === user.id && task.status !== TaskStatus.DONE
        );
        setInProgressTasks(managerInProgressTasks);
      } catch (err: any) {
        setError('Failed to load tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressTasks();
  }, [user]);

  const getDaysRemaining = (endDate?: string): number => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysLate = (endDate?: string): number => {
    if (!endDate) return 0;
    const remaining = getDaysRemaining(endDate);
    return remaining < 0 ? Math.abs(remaining) : 0;
  };

  const isLate = (endDate?: string): boolean => {
    return getDaysRemaining(endDate) < 0;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading tasks...</p>
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

  const todoTasks = inProgressTasks.filter(t => t.status === TaskStatus.TODO);
  const doingTasks = inProgressTasks.filter(t => t.status === TaskStatus.DOING);
  const lateTasks = inProgressTasks.filter(t => isLate(t.plannedEndDate));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks In Progress</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor ongoing tasks and deadlines</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{inProgressTasks.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">To Do</div>
          <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">{todoTasks.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{doingTasks.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Delayed</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{lateTasks.length}</div>
        </div>
      </div>

      {inProgressTasks.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No tasks in progress</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">All tasks are completed!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Task</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">Developer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Type</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">SP</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Planned End</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Time Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {inProgressTasks.map((task) => {
                  const daysRemaining = getDaysRemaining(task.plannedEndDate);
                  const daysLate = getDaysLate(task.plannedEndDate);
                  const taskIsLate = isLate(task.plannedEndDate);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{task.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          task.status === TaskStatus.TODO ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{task.developerName || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium uppercase" style={{ color: task.taskTypeColor }}>
                          {task.taskTypeName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300 font-mono">{task.storyPoints}</td>
                      <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                        {task.plannedEndDate ? new Date(task.plannedEndDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {taskIsLate ? (
                          <div className="flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                            <AlertCircle className="w-4 h-4" />
                            <span>{daysLate}d late</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
                            <Clock className="w-4 h-4" />
                            <span>{daysRemaining}d left</span>
                          </div>
                        )}
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

export default ManagerInProgressReport;

