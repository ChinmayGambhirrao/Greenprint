import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActions, deleteAction } from '../store/slices/actionsSlice';
import type { AppDispatch, RootState } from '../store';
import type { IAction } from '../types';
import ActionForm from '../components/ActionForm';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, TagIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function Actions() {
  const dispatch = useDispatch<AppDispatch>();
  const { actions, loading, error } = useSelector((state: RootState) => state.actions);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchActions());
    }
  }, [dispatch, isAuthenticated]);

  const categories = ['All', ...Array.from(new Set(actions.map((action: IAction) => action.category)))].sort();
  
  const filteredActions = (selectedCategory === 'All'
    ? actions
    : actions.filter((action: IAction) => action.category === selectedCategory)
  ).slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by most recent

  const handleDelete = (actionId: string) => {
    if (window.confirm('Are you sure you want to delete this action log? This cannot be undone.')) {
      dispatch(deleteAction(actionId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Please <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium underline">log in</Link> to view and log your actions.
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
        <h1 className="text-3xl font-bold text-gray-800">Your Actions</h1>
        <button 
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
          onClick={() => setShowForm(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Log New Action
        </button>
      </div>

      {/* Category Filter Pills */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Filter by category:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading && filteredActions.length === 0 && <div className="text-center text-gray-500 py-8">Loading actions...</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md shadow">Error: {error}</div>}

      {!loading && filteredActions.length === 0 && actions.length > 0 && selectedCategory !== 'All' && (
        <div className="text-center py-10 bg-white rounded-lg shadow p-8">
           <TagIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
           <h3 className="text-xl font-semibold text-gray-700 mb-2">No Actions in "{selectedCategory}"</h3>
           <p className="text-gray-500 mb-6">
             Try selecting another category or logging a new action.
           </p>
           <button 
             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
             onClick={() => setSelectedCategory('All')}
            >
            Show All Actions
           </button>
         </div>
      )}

      {!loading && actions.length === 0 && !error && (
         <div className="text-center py-10 bg-white rounded-lg shadow p-8">
           <PlusIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
           <h3 className="text-xl font-semibold text-gray-700 mb-2">No Actions Logged Yet!</h3>
           <p className="text-gray-500 mb-6">
             Start tracking your positive impact by logging your first eco-friendly action.
           </p>
           <button
             className="flex items-center justify-center mx-auto px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
             onClick={() => setShowForm(true)}
           >
             <PlusIcon className="h-5 w-5 mr-2" />
             Log Your First Action
           </button>
         </div>
      )}

      {filteredActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action: IAction) => (
            <motion.div
              key={action._id} // Use _id from MongoDB
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                      {action.icon || '✨'} 
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 leading-tight">{action.title}</h3>
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        <TagIcon className="h-3 w-3 inline mr-1 opacity-70" />
                        {action.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                    +{action.points} pts
                  </span>
                </div>
                {action.description && (
                    <p className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                        {action.description}
                    </p>
                )}
                <div className="text-xs text-gray-500 flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1.5 opacity-70" />
                  Logged: {formatDate(action.timestamp)}
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end">
                <button
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 flex items-center"
                    onClick={() => handleDelete(action._id)}
                >
                    <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {showForm && <ActionForm onClose={() => setShowForm(false)} />}
    </div>
  );
} 