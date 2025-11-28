import React, { useEffect, useState } from 'react';
import { apiBackend } from '../services/apiBackend';
import { TaskType } from '../types';
import Button from './Button';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const TaskTypeManagement: React.FC = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Partial<TaskType>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await apiBackend.tasks.getTaskTypes();
      setTaskTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const openCreateModal = () => {
    setCurrentType({ color: '#3b82f6' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (type: TaskType) => {
    setCurrentType({ ...type });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Task Types</h3>
          <p className="text-sm text-slate-500">Manage categories for your tasks</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-5 h-5 mr-2" />
          New Type
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {taskTypes.map(type => (
          <div key={type.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: type.color + '20' }}
              >
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: type.color }}
                ></div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(type)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="font-semibold text-slate-800 text-lg">{type.name}</h4>
            <p className="text-xs text-slate-500 mt-1 font-mono">{type.color}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Task Type' : 'New Task Type'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={currentType.name || ''}
                  onChange={e => setCurrentType({...currentType, name: e.target.value})}
                  placeholder="e.g. Feature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    required
                    type="color"
                    className="w-16 h-10 border border-slate-300 rounded-lg cursor-pointer"
                    value={currentType.color || '#3b82f6'}
                    onChange={e => setCurrentType({...currentType, color: e.target.value})}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm"
                    value={currentType.color || '#3b82f6'}
                    onChange={e => setCurrentType({...currentType, color: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTypeManagement;

