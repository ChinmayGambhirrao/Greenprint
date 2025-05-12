import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logout } from '../store/slices/userSlice';
import { fetchActions } from '../store/slices/actionsSlice';
import { fetchGoals } from '../store/slices/goalsSlice';
import type { AppDispatch, RootState } from '../store';
import type { IAction, IGoal } from '../types';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { TrophyIcon, StarIcon, FireIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon, PencilSquareIcon, BellAlertIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// --- Achievement Definitions (Static for now) ---
interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType; // Use ElementType for Heroicons
  color: string; // Tailwind color class for icon/progress
  // progress calculation would happen here based on user data
  // For now, we'll simulate progress
  currentProgress: number; 
  totalTarget: number;
}

// Example: Calculate progress for achievements based on real data
const calculateAchievementProgress = (achievements: Omit<Achievement, 'currentProgress'>[], actions: IAction[], goals: IGoal[]): Achievement[] => {
    // This is a placeholder. Real implementation would involve complex logic based on action types, goal completion etc.
    // For simplicity, we'll return static progress for now.
    
    const staticAchievements: Achievement[] = [
        {
            id: 1,
            title: 'First Steps',
            description: 'Log your first 5 actions',
            icon: StarIcon,
            color: 'text-yellow-500',
            currentProgress: Math.min(actions.length, 5), // Example: Progress based on action count
            totalTarget: 5,
        },
        {
            id: 2,
            title: 'Goal Setter',
            description: 'Set 3 different goals',
            icon: TrophyIcon,
            color: 'text-purple-500',
            currentProgress: Math.min(goals.length, 3),
            totalTarget: 3,
        },
        {
            id: 3,
            title: 'Points Collector',
            description: 'Earn 250 points',
            icon: FireIcon,
            color: 'text-red-500',
            currentProgress: Math.min(actions.reduce((sum, a) => sum + a.points, 0), 250),
            totalTarget: 250,
        },
         {
            id: 4,
            title: 'Consistent Clogger',
            description: 'Log actions on 3 different days',
            icon: StarIcon,
            color: 'text-blue-500',
             // Placeholder logic - needs real date tracking
            currentProgress: Math.min(new Set(actions.map(a => new Date(a.timestamp).toDateString())).size, 3),
            totalTarget: 3,
        },
    ];
    
    return staticAchievements;
};

// Simple level calculation (copy from Dashboard)
const calculateLevel = (points: number): number => {
  return Math.floor(points / 100) + 1; 
};
// --- End Achievement Definitions ---

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
  const { actions, loading: actionsLoading } = useSelector((state: RootState) => state.actions);
  const { goals, loading: goalsLoading } = useSelector((state: RootState) => state.goals);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    // Fetch data only if authenticated and data isn't already loaded/loading
    if (isAuthenticated) {
      if (!user && !userLoading) {
          dispatch(fetchProfile());
      }
      if (actions.length === 0 && !actionsLoading) {
           dispatch(fetchActions());
      }
       if (goals.length === 0 && !goalsLoading) {
           dispatch(fetchGoals());
      }
    }
  }, [dispatch, isAuthenticated, user, userLoading, actions.length, actionsLoading, goals.length, goalsLoading]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login after logout
  };

  if (!isAuthenticated) {
     return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile Unavailable</h2>
        <p className="text-gray-600 mb-6">
          Please <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium underline">log in</Link> to view your profile.
        </p>
        <Link to="/login">
          <button className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm font-medium">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }
  
  // Display loading indicator if essential data isn't ready
  if (userLoading || actionsLoading || goalsLoading) {
      return <div className="text-center text-gray-500 py-10">Loading profile...</div>;
  }
  
  // Display error if user fetch failed
  if (userError) {
       return <div className="bg-red-50 text-red-700 p-4 rounded-md shadow">Error loading profile: {userError}</div>;
  }
  
  // Should not happen if loading/error checks are correct, but safeguard
  if (!user) {
      return <div className="text-center text-gray-500 py-10">User data not found.</div>;
  }

  const totalPoints = user.points || 0;
  const level = calculateLevel(totalPoints);
  const userAchievements = calculateAchievementProgress([], actions, goals); // Pass empty achievements template

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6"
        >
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
           {/* Profile Picture Placeholder */} 
          <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center shadow-md">
            <UserCircleIcon className="h-16 w-16 text-emerald-600 opacity-80" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-lg text-emerald-600 font-medium mt-1">Level {level} <span className="text-gray-500 font-normal">({totalPoints} points)</span></p>
             {/* Email or other info can go here */} 
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
           <button 
             onClick={handleLogout}
             className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
             <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
             Logout
           </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-center">
          <div>
            <p className="text-3xl font-semibold text-emerald-600">{actions.length}</p>
            <p className="text-sm font-medium text-gray-500 mt-1">Total Actions Logged</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-emerald-600">{goals.length}</p>
            <p className="text-sm font-medium text-gray-500 mt-1">Total Goals Set</p>
          </div>
           <div>
             <p className="text-3xl font-semibold text-emerald-600">{goals.filter(g => g.completed).length}</p>
             <p className="text-sm font-medium text-gray-500 mt-1">Goals Completed</p>
           </div>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Achievements</h2>
        {userAchievements.length === 0 ? (
            <p className="text-gray-500 text-sm">Keep logging actions and completing goals to unlock achievements!</p>
        ) : (
            <div className="space-y-5">
            {userAchievements.map((achievement) => {
                const progressPercent = Math.min(100, (achievement.currentProgress / achievement.totalTarget) * 100);
                const IconComponent = achievement.icon;
                return (
                <div key={achievement.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${progressPercent === 100 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`h-6 w-6 ${progressPercent === 100 ? 'text-emerald-500' : achievement.color}`} />
                    </div>
                    <div className="flex-grow">
                    <h3 className={`font-medium ${progressPercent === 100 ? 'text-gray-900' : 'text-gray-700'}`}>{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                     <div className="mt-2 flex items-center space-x-2">
                         <div className="relative h-2 w-full flex-grow overflow-hidden rounded-full bg-gray-200">
                             <motion.div
                                className={`absolute h-full rounded-full ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-yellow-400'}`}
                                initial={{ width: '0%' }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                             />
                         </div>
                         <p className={`text-xs font-medium whitespace-nowrap ${progressPercent === 100 ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {achievement.currentProgress} / {achievement.totalTarget}
                         </p>
                     </div>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </motion.div>

      {/* Settings Section (Placeholder) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white shadow rounded-lg p-6"
        >
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Settings</h2>
        <div className="space-y-3">
          {/* Add onClick handlers later when functionality is built */} 
          <button className="w-full flex items-center text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <PencilSquareIcon className="h-5 w-5 mr-3 text-gray-400" />
            Edit Profile
          </button>
          <button className="w-full flex items-center text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <BellAlertIcon className="h-5 w-5 mr-3 text-gray-400" />
            Notification Preferences
          </button>
          <button className="w-full flex items-center text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
             <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-400" />
            Account & Privacy
          </button>
            <button 
             onClick={handleLogout}
             className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
             <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
             Logout
           </button>
        </div>
      </motion.div>
    </div>
  );
} 