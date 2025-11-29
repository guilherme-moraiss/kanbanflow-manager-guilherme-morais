import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, AlertCircle, TrendingUp, Calculator } from 'lucide-react';

interface StoryPointAverage {
  storyPoints: number;
  averageDays: number;
  taskCount: number;
}

const TodoEstimator: React.FC = () => {
  const { user } = useAuth();
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEstimate, setTotalEstimate] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const allTasks = await apiBackend.tasks.getAll(user);
        const userTodoTasks = allTasks.filter(
          (task) => task.managerId === user.id && task.status === TaskStatus.TODO
        );
        const userCompletedTasks = allTasks.filter(
          (task) => task.managerId === user.id && task.status === TaskStatus.DONE && task.realStartDate && task.realEndDate
        );
        setTodoTasks(userTodoTasks);
        setCompletedTasks(userCompletedTasks);
      } catch (err: any) {
        setError('Failed to load tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAveragesByStoryPoints = (): Map<number, StoryPointAverage> => {
    const averagesMap = new Map<number, StoryPointAverage>();

    completedTasks.forEach(task => {
      if (!task.realStartDate || !task.realEndDate || !task.storyPoints) return;

      const duration = calculateDuration(task.realStartDate, task.realEndDate);
      const sp = task.storyPoints;

      if (averagesMap.has(sp)) {
        const existing = averagesMap.get(sp)!;
        const newCount = existing.taskCount + 1;
        const newAverage = ((existing.averageDays * existing.taskCount) + duration) / newCount;
        averagesMap.set(sp, {
          storyPoints: sp,
          averageDays: newAverage,
          taskCount: newCount
        });
      } else {
        averagesMap.set(sp, {
          storyPoints: sp,
          averageDays: duration,
          taskCount: 1
        });
      }
    });

    return averagesMap;
  };

  const estimateTaskDuration = (task: Task, averagesMap: Map<number, StoryPointAverage>): number => {
    if (!task.storyPoints) return 0;

    if (averagesMap.has(task.storyPoints)) {
      return averagesMap.get(task.storyPoints)!.averageDays;
    }

    const sortedSP = Array.from(averagesMap.keys()).sort((a, b) => a - b);
    if (sortedSP.length === 0) return task.storyPoints * 1;

    const closest = sortedSP.reduce((prev, curr) => {
      return Math.abs(curr - task.storyPoints) < Math.abs(prev - task.storyPoints) ? curr : prev;
    });

    return averagesMap.get(closest)!.averageDays;
  };

  useEffect(() => {
    const averagesMap = getAveragesByStoryPoints();
    const total = todoTasks.reduce((sum, task) => {
      return sum + estimateTaskDuration(task, averagesMap);
    }, 0);
    setTotalEstimate(total);
  }, [todoTasks, completedTasks]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading estimation...</p>
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

  const averagesMap = getAveragesByStoryPoints();
  const averagesArray = Array.from(averagesMap.values()).sort((a, b) => a.storyPoints - b.storyPoints);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">ToDo Time Estimator</h2>
        <p className="text-sm text-slate-500 mt-1">Estimate completion time for pending tasks based on historical data</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <div className="text-xs font-semibold uppercase tracking-wider opacity-90">Total Estimated Time</div>
          </div>
          <div className="text-4xl font-bold">{Math.round(totalEstimate)}</div>
          <div className="text-sm opacity-90 mt-1">days for {todoTasks.length} tasks</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">ToDo Tasks</div>
          <div className="text-3xl font-bold text-slate-800">{todoTasks.length}</div>
          <div className="text-xs text-slate-500 mt-1">Pending tasks</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Historical Data</div>
          <div className="text-3xl font-bold text-slate-800">{completedTasks.length}</div>
          <div className="text-xs text-slate-500 mt-1">Completed tasks</div>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">No historical data available</h3>
            <p className="text-sm text-amber-700 mt-1">
              Complete some tasks first to generate estimates based on Story Points averages.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Story Points Averages
            </h3>
            <div className="space-y-3">
              {averagesArray.map(avg => (
                <div key={avg.storyPoints} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                      {avg.storyPoints}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {avg.averageDays.toFixed(1)} days
                      </div>
                      <div className="text-xs text-slate-500">
                        Based on {avg.taskCount} task{avg.taskCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              ToDo Tasks Breakdown
            </h3>
            {todoTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No pending tasks</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {todoTasks.map(task => {
                  const estimate = estimateTaskDuration(task, averagesMap);
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 text-sm">{task.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {task.storyPoints} SP • {task.developerName || 'Unassigned'}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-bold text-indigo-600">~{Math.round(estimate)}d</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoEstimator;

