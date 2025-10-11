import { motion } from 'framer-motion';
import { Home, Target, Dumbbell, User } from 'lucide-react';

type NavItem = 'home' | 'saved' | 'browse' | 'profile';

interface SideNavProps {
  active: NavItem;
  onSelect: (item: NavItem) => void;
  userName?: string;
}

export default function SideNav({ active, onSelect, userName }: SideNavProps) {
  const navItems = [
    { id: 'home' as NavItem, icon: Home, label: 'Home' },
    { id: 'saved' as NavItem, icon: Target, label: 'Goals' },
    { id: 'browse' as NavItem, icon: Dumbbell, label: 'Workouts' },
    { id: 'profile' as NavItem, icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-gray-900 rounded-3xl p-4 flex lg:flex-col flex-row items-center lg:space-y-6 lg:space-x-0 space-x-4 space-y-0 h-full w-full lg:w-auto justify-center lg:justify-start">
      <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center flex-shrink-0 hidden lg:flex">
        <span className="text-2xl font-bold text-gray-900">
          {userName?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      <div className="flex lg:flex-col flex-row items-center lg:space-y-4 lg:space-x-0 space-x-4 space-y-0 flex-1 lg:flex-auto justify-around lg:justify-start w-full lg:w-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(item.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-lime-400 text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
