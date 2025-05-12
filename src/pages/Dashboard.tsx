import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/userSlice';
import { fetchActions } from '../store/slices/actionsSlice';
import { fetchGoals } from '../store/slices/goalsSlice'; // Fetch goals for overview
import type { AppDispatch, RootState } from '../store';
import type { IAction, IGoal } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, UserCircleIcon, CheckCircleIcon, ListBulletIcon, CalendarDaysIcon, TagIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
};

// Simple level calculation (example)
const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1; // e.g., 100 points = level 2
};

const pointsToNextLevel = (points: number): number => {
    const currentLevel = calculateLevel(points);
    const nextLevelPoints = currentLevel * 100;
    return nextLevelPoints - points;
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
  const { actions, loading: actionsLoading, error: actionsError } = useSelector((state: RootState) => state.actions);
  const { goals, loading: goalsLoading, error: goalsError } = useSelector((state: RootState) => state.goals);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // Dispatch fetch actions if user data is available or being loaded
      if (!user && !userLoading) {
          dispatch(fetchProfile());
      }
      dispatch(fetchActions());
      dispatch(fetchGoals());
    }
  }, [dispatch, isAuthenticated, user, userLoading]); // Add user/userLoading dependencies

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Greenprint!</h2>
        <p className="text-gray-600 mb-6">
          Please <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium underline">log in</Link> or <Link to="/register" className="text-emerald-600 hover:text-emerald-500 font-medium underline">register</Link> to track your environmental impact.
        </p>
        <div className="flex gap-4 justify-center">
            <Link to="/login">
            <button className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm font-medium">
                Login
            </button>
            </Link>
            <Link to="/register">
            <button className="px-6 py-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md shadow-sm font-medium">
                Register
            </button>
            </Link>
        </div>
      </div>
    );
  }
  
  // Display loading indicator if essential data isn't ready
  if (userLoading || (actionsLoading && actions.length === 0) || (goalsLoading && goals.length === 0)) {
      return <div className="text-center text-gray-500 py-10">Loading your dashboard...</div>;
  }
  
  // Display error if user fetch failed
  if (userError) {
       return <div className="bg-red-50 text-red-700 p-4 rounded-md shadow">Error loading profile: {userError}</div>;
  }

  // Calculate derived stats
  const totalPoints = user?.points || 0;
  const level = calculateLevel(totalPoints);
  const pointsRemaining = pointsToNextLevel(totalPoints);
  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.length - completedGoals;
  const recentActions = actions.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5); // Sort and take 5 most recent

  // Stats cards data
  const stats = [
    { name: 'Current Level', stat: level, icon: TrophyIcon, change: '' },
    { name: 'Total Points', stat: totalPoints, icon: SparklesIcon, change: '' },
    { name: `Points to Level ${level + 1}`, stat: pointsRemaining, icon: SparklesIcon, change: 'remaining' },
    { name: 'Completed Goals', stat: completedGoals, icon: CheckCircleIcon, change: '' },
    { name: 'Active Goals', stat: activeGoals, icon: ListBulletIcon, change: '' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-lg text-emerald-700 font-semibold">Welcome back, {user?.name || 'User'}!</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        initial="hidden" 
        animate="visible" 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
       >
        {stats.map((item) => (
          <motion.div
            key={item.name}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white overflow-hidden shadow rounded-lg p-5 flex flex-col"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                    {item.change && item.change !== 'remaining' && (
                       <p className={`ml-2 flex items-baseline text-sm font-semibold ${item.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.change > 0 ? (
                          <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-emerald-500" aria-hidden="true" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                        )}
                         {item.change > 0 ? '+' : ''}{item.change}
                      </p>
                    )}
                     {item.change === 'remaining' && (
                         <p className="ml-1 text-xs font-medium text-gray-500"> points</p>
                     )}
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activities & Goals Overview */} 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 bg-white shadow rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          {actionsError && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">Error loading activities: {actionsError}</div>}
          {actionsLoading && recentActions.length === 0 && <div className="text-gray-500 text-sm">Loading activities...</div>}
          {!actionsLoading && recentActions.length === 0 && !actionsError && (
              <div className="text-center text-gray-500 py-6">
                  <ListBulletIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No actions logged yet.</p>
                  <Link to="/actions">
                       <button className="mt-4 px-4 py-1.5 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm font-medium">
                            Log your first action!
                       </button>
                   </Link>
              </div>
          )}
          {recentActions.length > 0 && (
            <ul className="space-y-4">
              {recentActions.map((action: IAction) => (
                <li key={action._id} className="flex items-center justify-between space-x-3 border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                      {action.icon || '✨'}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-medium text-gray-900 truncate">{action.title}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <CalendarDaysIcon className="h-3.5 w-3.5 mr-1 opacity-70" />
                        {formatDate(action.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 ml-4">
                     <span className="text-sm font-semibold text-emerald-600 whitespace-nowrap">+{action.points} pts</span>
                     <p className="text-xs text-gray-400 flex items-center mt-0.5">
                         <TagIcon className="h-3 w-3 mr-1 opacity-70"/> {action.category}
                     </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
           {actions.length > 5 && (
                <div className="mt-6 text-center">
                    <Link to="/actions" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        View All Actions &rarr;
                    </Link>
                </div>
            )}
        </motion.div>

        {/* Quick Goals Overview */}
         <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Goals Status</h2>
            {goalsError && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">Error loading goals: {goalsError}</div>}
            {goalsLoading && goals.length === 0 && <div className="text-gray-500 text-sm">Loading goals...</div>}
            {!goalsLoading && goals.length === 0 && !goalsError && (
                <div className="text-center text-gray-500 py-6">
                    <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No goals set yet.</p>
                     <Link to="/goals">
                       <button className="mt-4 px-4 py-1.5 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm font-medium">
                            Set your first goal!
                       </button>
                   </Link>
                </div>
            )}
            {goals.length > 0 && (
                 <ul className="space-y-3">
                    {goals.slice(0, 5).map((goal: IGoal) => (
                        <li key={goal._id} className="flex items-center space-x-3 text-sm">
                           <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${goal.completed ? 'text-emerald-500' : 'text-gray-300'}`} />
                           <span className={`flex-grow truncate ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{goal.title}</span>
                           <span className="text-xs text-gray-400 whitespace-nowrap">{goal.progress}/{goal.target}</span>
                        </li>
                    ))}
                 </ul>
            )}
             {goals.length > 5 && (
                <div className="mt-6 text-center">
                    <Link to="/goals" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        View All Goals &rarr;
                    </Link>
                </div>
            )}
         </motion.div>
      </div>
    </div>
  );
} 