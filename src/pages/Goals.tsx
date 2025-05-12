import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store/slices/goalsSlice';
import type { AppDispatch, RootState } from '../store'; // Typed imports
import type { IGoal } from '../types'; // Import IGoal type
import { motion } from 'framer-motion';
import { CheckCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'; // Import Link

// Styled GoalForm Component
function GoalForm({
  onClose,
  editingGoal,
}: {
  onClose: () => void;
  editingGoal?: IGoal | null; // Allow passing a goal to edit
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [description, setDescription] = useState(editingGoal?.description || '');
  const [target, setTarget] = useState(editingGoal?.target || 1);
  const [unit, setUnit] = useState(editingGoal?.unit || 'times');
  const [category, setCategory] = useState(editingGoal?.category || 'General');
  const { loading, error } = useSelector((state: RootState) => state.goals);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = { title, description, target, unit, category };
    try {
      if (editingGoal) {
        await dispatch(updateGoal({ id: editingGoal._id, updates: goalData })).unwrap();
      } else {
        await dispatch(createGoal(goalData)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Failed to save goal:", err);
      // Error is handled by the slice and displayed
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editingGoal ? 'Edit Goal' : 'Set New Goal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                id="target"
                type="number"
                min={1}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g., km, times, hours)</label>
              <input
                id="unit"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option>General</option>
              <option>Recycling</option>
              <option>Energy Saving</option>
              <option>Water Conservation</option>
              <option>Sustainable Travel</option>
              <option>Community</option>
            </select>
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
              {loading ? (editingGoal ? 'Saving...' : 'Creating...') : (editingGoal ? 'Save Changes' : 'Create Goal')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Main Goals Component
export default function Goals() {
  const dispatch = useDispatch<AppDispatch>();
  const { goals, loading, error } = useSelector((state: RootState) => state.goals);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | null>(null); // For editing existing goals

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchGoals());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateProgress = (goal: IGoal, newProgress: number) => {
    if (goal.completed) return;
    const progress = Math.max(0, Math.min(newProgress, goal.target)); // Ensure progress is within bounds
    dispatch(updateGoal({ id: goal._id, updates: { progress } }));
  };

  const handleToggleComplete = (goal: IGoal) => {
    dispatch(updateGoal({ id: goal._id, updates: { completed: !goal.completed, progress: !goal.completed ? goal.target : goal.progress } }));
  };
  
  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      dispatch(deleteGoal(goalId));
    }
  };

  const handleEditGoal = (goal: IGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };
  
  const openCreateForm = () => {
    setEditingGoal(null); // Ensure we are creating, not editing
    setShowForm(true);
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Please <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium underline">log in</Link> to view and manage your goals.
        </p>
        <Link to="/login">
          <button className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm font-medium">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Goals</h1>
        <button
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
          onClick={openCreateForm}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Set New Goal
        </button>
      </div>

      {loading && goals.length === 0 && <div className="text-center text-gray-500 py-8">Loading goals...</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md shadow">{error}</div>}
      
      {!loading && goals.length === 0 && !error && (
         <div className="text-center py-10 bg-white rounded-lg shadow p-8">
           <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
           <h3 className="text-xl font-semibold text-gray-700 mb-2">No Goals Yet!</h3>
           <p className="text-gray-500 mb-6">
             It looks like you haven't set any goals. Click the button above to get started!
           </p>
           <button
             className="flex items-center justify-center mx-auto px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
             onClick={openCreateForm}
           >
             <PlusIcon className="h-5 w-5 mr-2" />
             Set Your First Goal
           </button>
         </div>
      )}

      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: IGoal) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">{goal.category}</p>
                  </div>
                  {goal.completed && (
                    <CheckCircleIcon className="h-7 w-7 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{goal.description}</p>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Progress: {goal.progress} / {goal.target} {goal.unit}
                    </span>
                    <span className={`font-medium ${goal.completed ? 'text-emerald-600' : 'text-emerald-500'}`}>
                      {Math.round((goal.progress / goal.target) * 100)}%
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className={`absolute h-full rounded-full ${goal.completed ? 'bg-emerald-500' : 'bg-emerald-400'} transition-all duration-500 ease-out`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 items-center justify-end">
                {!goal.completed ? (
                  <button
                    className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-60"
                    onClick={() => handleUpdateProgress(goal, goal.progress + 1)} // Example: increment by 1
                    disabled={goal.progress >= goal.target}
                  >
                    Increment Progress
                  </button>
                ) : (
                   <p className="text-xs text-emerald-600 font-medium">Goal Achieved!</p>
                )}
                 <button
                    className={`w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${goal.completed ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500' : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500' }`}
                    onClick={() => handleToggleComplete(goal)}
                  >
                    {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                <button
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                  onClick={() => handleEditGoal(goal)}
                >
                  Edit
                </button>
                <button
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {showForm && (
        <GoalForm 
          onClose={() => {
            setShowForm(false);
            setEditingGoal(null); // Clear editing state when form closes
          }} 
          editingGoal={editingGoal} 
        />
      )}
    </div>
  );
} 