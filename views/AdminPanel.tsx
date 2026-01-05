import React, { useState } from 'react';
import { AppointmentType } from '../types';
import { ICONS } from '../constants';
import { apiService } from '../api-service';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    title: '',
    avatar: '',
    specialty: '',
    rating: '4.8',
    field: AppointmentType.CONSULTATION,
    bio: '',
    keyAreas: ['']
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const expertData = {
      ...formData,
      id: formData.id || `exp-${Date.now()}`,
      keyAreas: formData.keyAreas.filter(area => area.trim())
    };

    const success = await apiService.addExpert(expertData);
    
    if (success) {
      alert('Expert added successfully!');
      setFormData({
        id: '',
        name: '',
        title: '',
        avatar: '',
        specialty: '',
        rating: '4.8',
        field: AppointmentType.CONSULTATION,
        bio: '',
        keyAreas: ['']
      });
    } else {
      alert('Failed to add expert');
    }
    
    setSaving(false);
  };

  const addKeyArea = () => {
    setFormData(prev => ({
      ...prev,
      keyAreas: [...prev.keyAreas, '']
    }));
  };

  const updateKeyArea = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      keyAreas: prev.keyAreas.map((area, i) => i === index ? value : area)
    }));
  };

  const removeKeyArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyAreas: prev.keyAreas.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-slate-900">Add Expert</h2>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ICONS.X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Expert ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                placeholder="exp-001 (auto-generated if empty)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                placeholder="Dr. Sarah Chen"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                placeholder="Senior Business Strategist"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Avatar URL *</label>
              <input
                type="url"
                required
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Specialty *</label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                placeholder="Strategic Planning & Growth"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
              >
                <option value="4.5">4.5</option>
                <option value="4.6">4.6</option>
                <option value="4.7">4.7</option>
                <option value="4.8">4.8</option>
                <option value="4.9">4.9</option>
                <option value="5.0">5.0</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Field/Domain *</label>
              <select
                required
                value={formData.field}
                onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value as AppointmentType }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
              >
                {Object.values(AppointmentType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Bio *</label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 h-24"
                placeholder="Former McKinsey partner with 15+ years helping Fortune 500 companies..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Key Areas</label>
              {formData.keyAreas.map((area, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => updateKeyArea(index, e.target.value)}
                    className="flex-1 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                    placeholder="Strategic Planning"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyArea(index)}
                    className="w-12 h-12 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                  >
                    <ICONS.X className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyArea}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-bold"
              >
                + Add Key Area
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding Expert...' : 'Add Expert'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;