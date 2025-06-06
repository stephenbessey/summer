'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const logoRef = useRef<HTMLAnchorElement>(null);
  
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/agents', label: 'Agents' },
    { href: '/leads', label: 'Leads' },
    { href: '/properties', label: 'Properties' },
    { href: '/analytics', label: 'Analytics' },
  ];

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.focus();
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            ref={logoRef}
            href="/" 
            className="flex items-center space-x-3 font-playfair text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Image
              src="/fire.png"
              alt="SureFire Seller Logo"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
            />
            SureFire Seller
          </Link>
          <nav className="flex space-x-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}