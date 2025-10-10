import { motion } from 'framer-motion';
import { Home, BookmarkCheck, LayoutGrid, User } from 'lucide-react';

type NavItem = 'home' | 'saved' | 'browse' | 'profile';

interface BottomNavProps {
  active: NavItem;
  onSelect: (item: NavItem) => void;
}

export default function BottomNav({ active, onSelect }: BottomNavProps) {
  const navItems = [
    { id: 'home' as NavItem, icon: Home, label: 'Home' },
    { id: 'saved' as NavItem, icon: BookmarkCheck, label: 'Saved' },
    { id: 'browse' as NavItem, icon: LayoutGrid, label: 'Browse' },
    { id: 'profile' as NavItem, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 pb-safe z-50">
      <div className="flex items-center justify-around px-6 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(item.id)}
              className="flex flex-col items-center space-y-1 min-w-[60px]"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
