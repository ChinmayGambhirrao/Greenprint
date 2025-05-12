import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logAction } from '../store/slices/actionsSlice';
import type { AppDispatch, RootState } from '../store';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const actionCategories = {
  Recycling: { icon: '♻️', defaultPoints: 10 },
  'Energy Saving': { icon: '💡', defaultPoints: 15 },
  'Water Conservation': { icon: '💧', defaultPoints: 15 },
  'Sustainable Travel': { icon: '🚲', defaultPoints: 20 },
  'Reduced Waste': { icon: '🛍️', defaultPoints: 10 },
  Community: { icon: '🧑‍🤝‍🧑', defaultPoints: 25 },
  'Sustainable Food': { icon: '🥕', defaultPoints: 10 },
  Other: { icon: '✨', defaultPoints: 5 },
};

type ActionCategory = keyof typeof actionCategories;

export default function ActionForm({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.actions);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActionCategory>('Recycling');
  const [points, setPoints] = useState(actionCategories[category].defaultPoints);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setPoints(actionCategories[category].defaultPoints);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const actionData = {
      title,
      category,
      points,
      description,
      icon: actionCategories[category].icon,
    };
    try {
      await dispatch(logAction(actionData)).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to log action:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Log New Action</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Action Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Cycled to work" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              id="description"
              rows={2}
              placeholder="Any details? (e.g., distance, duration)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as ActionCategory)}
                disabled={loading}
              >
                {Object.keys(actionCategories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Points Awarded</label>
              <input
                id="points"
                type="number"
                min={1}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                required
                disabled={loading}
              />
            </div>
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Action'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 