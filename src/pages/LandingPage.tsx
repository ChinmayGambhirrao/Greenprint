import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 flex flex-col items-center justify-center text-white p-8">
      <div className="text-center space-y-8 max-w-full">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
        >
          Track Your <span className="text-yellow-300">Sustainability</span> Journey
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-emerald-50 leading-relaxed"
        >
          Join GreenPrint to make a positive impact on the environment. Log your actions, achieve your goals, and see your eco-friendly habits grow!
        </motion.p>

        {/* Features Overview (Placeholder) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1}} 
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
        >
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">Log Easily</h3>
            <p className="text-sm text-emerald-100">Quickly record your eco-friendly actions with our intuitive interface.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">Track Progress</h3>
            <p className="text-sm text-emerald-100">Visualize your impact and see how small changes make a big difference.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">Earn Rewards</h3>
            <p className="text-sm text-emerald-100">Stay motivated by unlocking badges and leveling up your GreenPrint profile.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link 
            to="/register" 
            className="w-full sm:w-auto text-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-emerald-800 px-10 py-4 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
          >
            Join the Movement
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto text-lg font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-10 py-4 rounded-lg shadow-md transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:ring-opacity-50"
          >
            Already a Member? Sign In
          </Link>
        </motion.div>

        {/* Placeholder for screenshots/animations - can be added later */}
        {/* Placeholder for testimonials - can be added later */}
      </div>
      <footer className="absolute bottom-6 text-center w-full text-emerald-100 text-sm">
        © {new Date().getFullYear()} GreenPrint. Make your mark, sustainably.
      </footer>
    </div>
  );
}

// Need to import motion from framer-motion
// Add this line at the top if not already there:
// import { motion } from 'framer-motion'; 