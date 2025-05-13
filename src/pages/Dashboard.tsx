import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/userSlice';
import { fetchActions } from '../store/slices/actionsSlice';
import { fetchGoals } from '../store/slices/goalsSlice'; // Fetch goals for overview
import type { AppDispatch, RootState } from '../store';
import type { IAction, IGoal } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    UserCircleIcon, 
    CheckCircleIcon, 
    ListBulletIcon, 
    CalendarDaysIcon, 
    TagIcon, 
    TrophyIcon, 
    SparklesIcon, 
    ArrowPathIcon, // For streak/level?
    PlusCircleIcon, // For logging actions
    InformationCircleIcon // For motivational quote
} from '@heroicons/react/24/outline';

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

  // --- TODO: State for showing the Action Logging Modal ---
  // const [showActionForm, setShowActionForm] = useState(false);

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
  // const pointsRemaining = pointsToNextLevel(totalPoints); // Can be used if needed
  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.length - completedGoals;
  const recentActions = actions.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3); // Show fewer recent actions

  // Placeholder for motivational quote
  const motivationalQuote = "The greatest threat to our planet is the belief that someone else will save it." // Replace with dynamic quote/stat

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-lg text-emerald-700 font-semibold">Welcome back, {user?.name || 'User'}!</p>
      </motion.div>

      {/* Main Dashboard Grid - Reorganized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Core Stats & Logging */}
        <div className="lg:col-span-2 space-y-6">
            {/* Impact Score / Level / Streak */} 
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center"
            >
                 <div>
                    <p className="text-sm uppercase tracking-wide opacity-80 mb-1">Your Impact Level</p>
                    <p className="text-4xl font-bold">Level {level}</p>
                    <p className="text-sm opacity-90 mt-1">{totalPoints} total points</p>
                 </div>
                 <div className="mt-4 sm:mt-0 sm:text-right">
                     {/* Placeholder for Streak */} 
                    <div className="flex items-center justify-end space-x-2">
                        <ArrowPathIcon className="h-6 w-6 opacity-80"/>
                        <p className="text-lg font-semibold">Streak: 5 days</p> 
                    </div>
                    {/* Placeholder for Today's Score - More complex calculation needed */}
                     <p className="text-sm opacity-80 mt-1">Today's Score: +15 pts</p>
                 </div>
            </motion.div>

            {/* Log Actions Area */} 
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow"
            >
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Log Your Actions</h2>
                 <p className="text-sm text-gray-600 mb-5">Quickly log your sustainable activities for the day.</p>
                 {/* Placeholder: Icon-based logging options or checklist */} 
                 <div className="flex flex-wrap justify-center gap-4 mb-5">
                     <button className="flex flex-col items-center p-3 space-y-1 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                         <span className="text-3xl">🚲</span>
                         <span className="text-xs font-medium">Travel</span>
                     </button>
                      <button className="flex flex-col items-center p-3 space-y-1 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                         <span className="text-3xl">💧</span>
                         <span className="text-xs font-medium">Water</span>
                     </button>
                      <button className="flex flex-col items-center p-3 space-y-1 text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors">
                         <span className="text-3xl">💡</span>
                         <span className="text-xs font-medium">Energy</span>
                     </button>
                     <button className="flex flex-col items-center p-3 space-y-1 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                         <span className="text-3xl">🛍️</span>
                         <span className="text-xs font-medium">Waste</span>
                     </button>
                 </div>
                 <button 
                    // onClick={() => setShowActionForm(true)} // TODO: Link to modal/page
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
                 >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Log Other Activity
                 </button>
                 {/* TODO: Add ActionForm Modal conditionally rendered based on showActionForm state */} 
                 {/* {showActionForm && <ActionForm onClose={() => setShowActionForm(false)} />} */} 
            </motion.div>

             {/* Motivational Quote/Stat */} 
             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-r-lg"
             >
                <div className="flex">
                    <div className="flex-shrink-0">
                        <InformationCircleIcon className="h-5 w-5 text-teal-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-teal-700">
                        {motivationalQuote}
                        </p>
                    </div>
                </div>
             </motion.div>

        </div>

        {/* Right Column: Goals & Recent Activity */}
        <div className="space-y-6">
            {/* Weekly Goals Overview */} 
             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white shadow rounded-lg p-6"
            >
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Weekly Goals</h2>
                     <Link to="/goals" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        View All &rarr;
                    </Link>
                </div>
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
                         {/* Show maybe 2-3 active goals */} 
                        {goals.filter(g => !g.completed).slice(0, 3).map((goal: IGoal) => (
                            <li key={goal._id} className="flex items-center space-x-3 text-sm">
                            <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${goal.completed ? 'text-emerald-500' : 'text-gray-300'}`} />
                            <div className="flex-grow">
                                <span className={`truncate ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{goal.title}</span>
                                {/* Simple Progress Bar */} 
                                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200 mt-1">
                                    <div
                                    className={`absolute h-full rounded-full ${goal.completed ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{goal.progress}/{goal.target}</span>
                            </li>
                        ))}
                         {goals.filter(g => !g.completed).length === 0 && goals.length > 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">All active goals completed this week!</p>
                         )} 
                     </ul>
                 )}
            </motion.div>

            {/* Recent Activities */} 
             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white shadow rounded-lg p-6"
            >
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                    {actions.length > 3 && (
                         <Link to="/actions" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                            View All &rarr;
                        </Link>
                    )} 
                 </div>
                 {actionsError && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">Error loading activities: {actionsError}</div>}
                 {actionsLoading && recentActions.length === 0 && <div className="text-gray-500 text-sm">Loading activities...</div>}
                 {!actionsLoading && recentActions.length === 0 && !actionsError && (
                     <div className="text-center text-gray-500 py-6">
                         <ListBulletIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                         <p>No actions logged yet.</p>
                         {/* Link to Log Action Modal/Page? */} 
                     </div>
                 )}
                 {recentActions.length > 0 && (
                    <ul className="space-y-4">
                    {recentActions.map((action: IAction) => (
                        <li key={action._id} className="flex items-center justify-between space-x-3 border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center space-x-3 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">
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
            </motion.div>
        </div>
      </div>
       {/* Removed original Stats Grid and combined overview */} 
    </div>
  );
} 