'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Workflow, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout, logoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Templates', href: '/templates', icon: Mail },
    { name: 'Workflows', href: '/workflows', icon: Workflow },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-3'>
            <div className='p-2 rounded-lg bg-blue-600'>
              <Mail className='h-6 w-6 text-white' />
            </div>
            <div className='hidden sm:block'>
              <h1 className='text-xl font-bold text-gray-900'>Email Builder</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            <button
              className='md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>

            {user && (
              <div className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='' alt={user.name} />
                  <AvatarFallback className='bg-blue-100 text-blue-600 text-sm font-medium'>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='hidden sm:block'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.name}
                  </p>
                </div>
                <Button variant='ghost' size='sm' onClick={() => logout()} disabled={logoutLoading}>
                  <LogOut className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className='h-5 w-5' />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
