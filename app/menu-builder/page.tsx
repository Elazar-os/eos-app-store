'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  available: boolean;
}

interface Screen {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  frozen: boolean;
}

export default function MenuBuilder() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Burger', price: 12.99, description: 'Classic beef burger', category: 'Main', available: true },
    { id: '2', name: 'Fries', price: 4.99, description: 'Crispy french fries', category: 'Sides', available: true },
  ]);

  const [screens, setScreens] = useState<Screen[]>([
    { id: '1', name: 'Main Dining', status: 'connected', frozen: false },
    { id: '2', name: 'Bar Area', status: 'connected', frozen: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScreen, setSelectedScreen] = useState<string>('all');
  const [themeColor, setThemeColor] = useState('#3B82F6');

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredScreens = selectedScreen === 'all' ? screens : screens.filter(s => s.id === selectedScreen);

  const addItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'New Item',
      price: 0,
      description: '',
      category: 'Main',
      available: true,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const addCategory = () => {
    // TODO: Implement add category
    alert('Add category functionality coming soon!');
  };

  const toggleFreeze = (screenId: string) => {
    setScreens(screens.map(s => s.id === screenId ? { ...s, frozen: !s.frozen } : s));
  };

  const pushToScreen = (screenId: string) => {
    // TODO: Implement push to screen
    alert(`Pushing menu to screen: ${screens.find(s => s.id === screenId)?.name}`);
  };

  const eightySixItem = (itemId: string) => {
    setMenuItems(menuItems.map(item => item.id === itemId ? { ...item, available: false } : item));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Restaurant Menu Builder</h1>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Menu Items
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search items..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Screens
              </label>
              <select
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Screens</option>
                {screens.map(screen => (
                  <option key={screen.id} value={screen.id}>{screen.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme Color
              </label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
            <button
              onClick={addCategory}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Screens Dashboard */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Screen Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScreens.map(screen => (
              <div key={screen.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{screen.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    screen.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {screen.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFreeze(screen.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      screen.frozen ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
                    }`}
                  >
                    {screen.frozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                  <button
                    onClick={() => pushToScreen(screen.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Push to Screen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : '86\'d'}
                  </span>
                  {item.available && (
                    <button
                      onClick={() => eightySixItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      86 Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}