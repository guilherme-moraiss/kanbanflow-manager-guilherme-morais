import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { Task, TaskStatus, TaskType, User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Plus, Calendar, User as UserIcon, AlertCircle, X, GripHorizontal, Trash2 } from 'lucide-react';

const KanbanBoard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterDev, setFilterDev] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Partial<Task>>({});
  const [availableDevs, setAvailableDevs] = useState<User[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  
  // Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    storyPoints: 1,
    executionOrder: 1,
    developerId: ''
  });

  const fetchBoardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedTasks, fetchedUsers, fetchedTypes] = await Promise.all([
        apiBackend.tasks.getAll(user),
        apiBackend.users.getAll(),
        apiBackend.tasks.getTaskTypes()
      ]);
      
      setTasks(fetchedTasks);
      // Filter users to show only developers in dropdown
      setAvailableDevs(fetchedUsers.filter(u => u.role === UserRole.DEVELOPER));
      setTaskTypes(fetchedTypes);
      
      // Set default task type if available
      if (fetchedTypes.length > 0) {
        setNewTask(prev => ({ ...prev, taskTypeId: fetchedTypes[0].id }));
      }
    } catch (err: any) {
      setError("Failed to load board data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [user]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Optimistic Update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status } : t
    );
    setTasks(updatedTasks);

    try {
        if (!user) return;
        await apiBackend.tasks.move(taskId, status, user);
        fetchBoardData();
    } catch (err: any) {
        console.error("Move failed", err);
        setTasks(originalTasks);
        alert(err.message || "Failed to move task.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setEditTask({
      title: task.title,
      description: task.description,
      storyPoints: task.storyPoints,
      executionOrder: task.executionOrder,
      developerId: task.developerId,
      taskTypeId: task.taskTypeId,
      plannedStartDate: task.plannedStartDate,
      plannedEndDate: task.plannedEndDate
    });
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));
    
    try {
        await apiBackend.tasks.delete(taskId);
    } catch (err) {
        console.error("Delete failed", err);
        setTasks(originalTasks);
        alert("Failed to delete task");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
        if (!newTask.title || !newTask.taskTypeId || !newTask.executionOrder) {
            throw new Error("Please fill in required fields");
        }

        await apiBackend.tasks.create({
            ...newTask as any,
            status: TaskStatus.TODO
        }, user.id);

        setIsModalOpen(false);
        setNewTask({ storyPoints: 1, executionOrder: 1, developerId: '', taskTypeId: taskTypes[0]?.id });
        setSuccessMessage('Task created successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchBoardData();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const renderColumn = (status: TaskStatus, title: string) => {
    let columnTasks = tasks.filter(t => t.status === status);
    
    if (filterDev !== 'all') {
      columnTasks = columnTasks.filter(t => t.developerId === filterDev);
    }
    
    if (filterType !== 'all') {
      columnTasks = columnTasks.filter(t => t.taskTypeId === filterType);
    }
    
    columnTasks = columnTasks.sort((a, b) => a.executionOrder - b.executionOrder);

    return (
      <div 
        className="flex-1 min-w-[300px] bg-slate-100/80 rounded-xl p-4 flex flex-col h-full border border-slate-200"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
                status === TaskStatus.TODO ? 'bg-slate-400' :
                status === TaskStatus.DOING ? 'bg-blue-500' : 'bg-emerald-500'
            }`}></span>
            {title}
          </h3>
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
            {columnTasks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] pr-1 scrollbar-thin">
          {columnTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onClick={() => handleViewTask(task)}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow group relative"
            >
              {/* Card Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                 {/* Priority Badge */}
                 <div className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border shadow-sm ${
                    task.executionOrder === 1 ? 'bg-red-50 text-red-600 border-red-100' :
                    task.executionOrder === 2 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-slate-50 text-slate-400 border-slate-100'
                 }`} title="Execution Priority">
                    {task.executionOrder}
                 </div>

                 {/* Delete Button (Manager Only) */}
                 {user?.role === UserRole.MANAGER && (
                    <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Task"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                 )}
              </div>

              
              
              <div className="flex items-center gap-2 mb-2">
                <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: task.taskTypeColor }}
                ></div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {task.taskTypeName}
                </span>
              </div>
              
              <h4 className="font-semibold text-slate-800 mb-2 pr-12 leading-tight">
                  {task.title}
              </h4>

              {/* Planned Dates */}
              {(task.plannedStartDate || task.plannedEndDate) && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {formatDate(task.plannedStartDate)} 
                        {task.plannedStartDate && task.plannedEndDate && ' - '} 
                        {formatDate(task.plannedEndDate)}
                    </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                 <div className="flex items-center gap-2" title={task.developerName}>
                    {task.developerAvatar ? (
                        <img src={task.developerAvatar} alt="dev" className="w-6 h-6 rounded-full" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                             <UserIcon className="w-3 h-3" />
                        </div>
                    )}
                    <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">
                        {task.developerName || 'Unassigned'}
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                     {task.realStartDate && status === TaskStatus.DOING && (
                         <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100" title="Started">
                            {formatDate(task.realStartDate)}
                         </span>
                     )}
                     <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200" title="Story Points">
                        {task.storyPoints} pts
                     </span>
                 </div>
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && (
             <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                Drop here
             </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-lg font-bold text-slate-800">Kanban Board</h2>
            <p className="text-sm text-slate-500">Drag cards to update status</p>
         </div>
         {user?.role === UserRole.MANAGER && (
            <Button onClick={() => setIsModalOpen(true)} className="shadow-indigo-100">
                <Plus className="w-5 h-5 mr-2" />
                New Task
            </Button>
         )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-slate-800">{tasks.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">To Do</div>
          <div className="text-2xl font-bold text-slate-600">{tasks.filter(t => t.status === TaskStatus.TODO).length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === TaskStatus.DOING).length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === TaskStatus.DONE).length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Story Points</div>
          <div className="text-2xl font-bold text-indigo-600">{tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)}</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Sprint Progress</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {tasks.filter(t => t.status === TaskStatus.DONE).length} of {tasks.length} tasks completed
            </p>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100) : 0}%
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex gap-4 items-center">
        <span className="text-sm font-medium text-slate-700">Filters:</span>
        <select 
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filterDev}
          onChange={(e) => setFilterDev(e.target.value)}
        >
          <option value="all">All Developers</option>
          {availableDevs.map(dev => (
            <option key={dev.id} value={dev.id}>{dev.name}</option>
          ))}
        </select>
        <select 
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {taskTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        {(filterDev !== 'all' || filterType !== 'all') && (
          <button
            onClick={() => { setFilterDev('all'); setFilterType('all'); }}
            className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {renderColumn(TaskStatus.TODO, 'To Do')}
        {renderColumn(TaskStatus.DOING, 'Doing')}
        {renderColumn(TaskStatus.DONE, 'Done')}
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Create New Task</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newTask.title || ''}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                            placeholder="e.g. Design Database Schema"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                            value={newTask.description || ''}
                            onChange={e => setNewTask({...newTask, description: e.target.value})}
                        />
                    </div>

                    {/* Date Inputs - New for Sprint 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Planned Start</label>
                            <input 
                                type="date"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newTask.plannedStartDate || ''}
                                onChange={e => setNewTask({...newTask, plannedStartDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Planned End</label>
                            <input 
                                type="date"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newTask.plannedEndDate || ''}
                                onChange={e => setNewTask({...newTask, plannedEndDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                                value={newTask.taskTypeId}
                                onChange={e => setNewTask({...newTask, taskTypeId: e.target.value})}
                            >
                                {taskTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Story Points</label>
                             <input 
                                type="number" 
                                min="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                value={newTask.storyPoints}
                                onChange={e => setNewTask({...newTask, storyPoints: parseInt(e.target.value)})}
                             />
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assign Developer</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                                value={newTask.developerId || ''}
                                onChange={e => setNewTask({...newTask, developerId: e.target.value})}
                            >
                                <option value="">Unassigned</option>
                                {availableDevs.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.experienceLevel})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Execution Order</label>
                            <input 
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                value={newTask.executionOrder}
                                onChange={e => setNewTask({...newTask, executionOrder: parseInt(e.target.value)})}
                                placeholder="Priority (1, 2, 3...)"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Must be unique per developer</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create Task</Button>
                    </div>
                </form>
           </div>
        </div>
      )}

      {isViewModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Edit Task' : 'Task Details'}
              </h3>
              <div className="flex items-center gap-2">
                {!isEditMode && user?.role === UserRole.MANAGER && selectedTask.status !== TaskStatus.DONE && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => { setIsViewModalOpen(false); setIsEditMode(false); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {!isEditMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
                    <div className="text-slate-900 font-medium">{selectedTask.title}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
                    <div className="text-slate-700">{selectedTask.description || '-'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Type</label>
                      <div className="text-slate-900">{selectedTask.taskTypeName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Story Points</label>
                      <div className="text-slate-900 font-mono">{selectedTask.storyPoints}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Developer</label>
                      <div className="text-slate-900">{selectedTask.developerName || 'Unassigned'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Manager</label>
                      <div className="text-slate-900">{selectedTask.managerName}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Planned Start</label>
                      <div className="text-slate-900 text-sm">
                        {selectedTask.plannedStartDate ? new Date(selectedTask.plannedStartDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Planned End</label>
                      <div className="text-slate-900 text-sm">
                        {selectedTask.plannedEndDate ? new Date(selectedTask.plannedEndDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Real Start</label>
                      <div className="text-slate-900 text-sm">
                        {selectedTask.realStartDate ? new Date(selectedTask.realStartDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Real End</label>
                      <div className="text-slate-900 text-sm">
                        {selectedTask.realEndDate ? new Date(selectedTask.realEndDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Status</label>
                      <div>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          selectedTask.status === TaskStatus.TODO ? 'bg-slate-100 text-slate-700' :
                          selectedTask.status === TaskStatus.DOING ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {selectedTask.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">Execution Order</label>
                      <div className="text-slate-900 font-mono">{selectedTask.executionOrder}</div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                  </div>
                </>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user) return;
                  setLoading(true);
                  try {
                    await apiBackend.tasks.update(selectedTask.id, editTask, user.role);
                    setIsViewModalOpen(false);
                    setIsEditMode(false);
                    fetchData();
                  } catch (err: any) {
                    alert(err.message || 'Failed to update task');
                  } finally {
                    setLoading(false);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                        value={editTask.title || ''}
                        onChange={e => setEditTask({...editTask, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                        rows={3}
                        value={editTask.description || ''}
                        onChange={e => setEditTask({...editTask, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                          value={editTask.taskTypeId}
                          onChange={e => setEditTask({...editTask, taskTypeId: e.target.value})}
                        >
                          {taskTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Story Points</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                          value={editTask.storyPoints || 1}
                          onChange={e => setEditTask({...editTask, storyPoints: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Developer</label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                        value={editTask.developerId}
                        onChange={e => setEditTask({...editTask, developerId: e.target.value})}
                      >
                        {availableDevs.map(dev => (
                          <option key={dev.id} value={dev.id}>{dev.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Planned Start</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                          value={editTask.plannedStartDate || ''}
                          onChange={e => setEditTask({...editTask, plannedStartDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Planned End</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                          value={editTask.plannedEndDate || ''}
                          onChange={e => setEditTask({...editTask, plannedEndDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Execution Order</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                        value={editTask.executionOrder || 1}
                        onChange={e => setEditTask({...editTask, executionOrder: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                      <Button type="button" variant="ghost" onClick={() => setIsEditMode(false)}>Cancel</Button>
                      <Button type="submit" isLoading={loading}>Save Changes</Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;