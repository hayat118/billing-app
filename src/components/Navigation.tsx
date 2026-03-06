import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  navigation: NavItem[];
}

const Navigation: React.FC<NavigationProps> = ({ navigation }) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`${
            pathname === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          } group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
        >
          <span className="mr-3 h-5 w-5 flex-shrink-0">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;