'use client';

import { useState } from 'react';
import AppShell from '../components/AppShell';

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
    <AppShell
      title="Restaurant Menu Builder"
      description="Design menus, control screen sync, and keep availability accurate during service."
      badge="Hospitality"
    >
      <div className="mx-auto max-w-7xl">

        {/* Controls */}
        <div className="surface-strong mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Search Menu Items
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                placeholder="Search items..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Search Screens
              </label>
              <select
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              >
                <option value="all">All Screens</option>
                {screens.map(screen => (
                  <option key={screen.id} value={screen.id}>{screen.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Theme Color
              </label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="h-10 w-full rounded-xl border border-black/10"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={addItem}
              className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Add Item
            </button>
            <button
              onClick={addCategory}
              className="rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-semibold"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Screens Dashboard */}
        <div className="surface-strong mb-6 p-6">
          <h2 className="mb-4 text-xl font-semibold">Screen Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScreens.map(screen => (
              <div key={screen.id} className="surface p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{screen.name}</h3>
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
                      screen.frozen ? 'bg-red-600 text-white' : 'bg-black/70 text-white'
                    }`}
                  >
                    {screen.frozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                  <button
                    onClick={() => pushToScreen(screen.id)}
                    className="rounded bg-[color:var(--brand)] px-3 py-1 text-sm text-white"
                  >
                    Push to Screen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="surface-strong p-6">
          <h2 className="mb-4 text-xl font-semibold">Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="surface p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="muted text-sm">{item.category}</p>
                  </div>
                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="muted mb-2 text-sm">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : '86\'d'}
                  </span>
                  {item.available && (
                    <button
                      onClick={() => eightySixItem(item.id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white"
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
    </AppShell>
  );
}