import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock } from 'lucide-react';

const CompletedTasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const allTasks = await apiBackend.tasks.getAll(user);
        const completed = allTasks.filter(t => 
          t.status === TaskStatus.DONE && 
          t.developerId === user.id
        );
        setTasks(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [user]);

  const calculateDays = (task: Task): number => {
    if (!task.realStartDate || !task.realEndDate) return 0;
    const start = new Date(task.realStartDate);
    const end = new Date(task.realEndDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">My Completed Tasks</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Story Points</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Duration (days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No completed tasks yet
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{task.title}</div>
                      <div className="text-xs text-slate-500">{task.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="inline-block px-2 py-1 text-xs font-medium rounded"
                        style={{ backgroundColor: task.taskTypeColor + '20', color: task.taskTypeColor }}
                      >
                        {task.taskTypeName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">{task.storyPoints}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {task.realStartDate ? new Date(task.realStartDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {task.realEndDate ? new Date(task.realEndDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-indigo-600">{calculateDays(task)} days</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;

