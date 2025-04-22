
import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-blue-900 text-white border-b border-blue-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="pl-10 pr-4 py-2 rounded-md w-full bg-blue-800 text-white border border-blue-700 placeholder-white"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
