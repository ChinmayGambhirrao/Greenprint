import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import type { AppDispatch, RootState } from '../store';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Goals', href: '/goals' },
  { name: 'Actions', href: '/actions' },
];

// Active NavLink style
const activeClassName = "border-emerald-500 text-gray-900";
const inactiveClassName = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, name, email } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };
  
  useEffect(() => {
      setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center flex-shrink-0">
                 {/* Replace with actual logo if available */}
                 <svg className="h-8 w-auto text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                 </svg>
                <span className="ml-2 text-2xl font-bold text-emerald-600">GreenPrint</span>
              </Link>
              {/* Desktop Navigation Links */}
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                       `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive ? activeClassName : inactiveClassName}`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side Buttons & Mobile Menu Toggle */}
            <div className="flex items-center">
                {/* Desktop Buttons */} 
                <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-3">
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                   `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                                }
                            >
                                <UserCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                Profile
                            </NavLink>
                            <button 
                                onClick={handleLogout}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <ArrowLeftOnRectangleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <ArrowRightOnRectangleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

              {/* Mobile Menu Button */}
              <div className="ml-4 sm:hidden">
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                   className={({ isActive }) =>
                       `block rounded-md px-3 py-2 text-base font-medium ${isActive ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`
                    }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
             {/* Mobile Auth Buttons/Profile Link */} 
            <div className="border-t border-gray-200 px-4 py-4">
                {isAuthenticated ? (
                     <>
                        <div className="flex items-center mb-3">
                             <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3 flex-shrink-0" aria-hidden="true" />
                             <div>
                                <div className="text-base font-medium text-gray-800">{name}</div>
                                <div className="text-sm font-medium text-gray-500">{email}</div>
                             </div>
                        </div>
                        <NavLink
                            to="/profile"
                             className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-base font-medium mb-2 ${isActive ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`
                             }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Your Profile
                        </NavLink>
                        <button 
                            onClick={handleLogout} 
                            className="w-full block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                        >
                           Logout
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col space-y-2">
                        <Link
                            to="/login"
                            className="block w-full rounded-md bg-white px-3 py-2 text-center text-base font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                             onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="block w-full rounded-md bg-emerald-600 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-emerald-700"
                             onClick={() => setMobileMenuOpen(false)}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {/* Render page content */} 
        {children}
       </main>
    </div>
  );
} 