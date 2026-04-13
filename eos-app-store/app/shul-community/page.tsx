'use client';

import { useState } from 'react';

interface Shul {
  id: string;
  name: string;
  address: string;
  website: string;
  zmanim: {
    shacharis: string;
    mincha: string;
    maariv: string;
  };
  shiurim: string[];
}

export default function ShulCommunity() {
  const [shuls, setShuls] = useState<Shul[]>([
    {
      id: '1',
      name: 'Congregation Beth Israel',
      address: '123 Main St, City, State',
      website: 'https://bethisrael.org',
      zmanim: {
        shacharis: '7:00 AM',
        mincha: '1:30 PM',
        maariv: '8:00 PM',
      },
      shiurim: ['Daily Daf Yomi', 'Weekly Parsha Shiur', 'Mishna Berura'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    alert('Shul submission received! We will review and add it to the community.');
    setShowForm(false);
    setFormData({ name: '', address: '', website: '', contactEmail: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shul Community App
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {showForm ? 'Cancel' : 'Add Shul'}
          </button>
        </div>

        {/* Add Shul Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Submit Shul Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shul Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Submit Shul
              </button>
            </form>
          </div>
        )}

        {/* Shuls List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shuls.map(shul => (
            <div key={shul.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {shul.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{shul.address}</p>

              {shul.website && (
                <a
                  href={shul.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline mb-4 block"
                >
                  Visit Website
                </a>
              )}

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Zmanim</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Shacharis: {shul.zmanim.shacharis}</p>
                  <p>Mincha: {shul.zmanim.mincha}</p>
                  <p>Maariv: {shul.zmanim.maariv}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shiurim</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {shul.shiurim.map((shiur, index) => (
                    <li key={index}>• {shiur}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                  CarPlay Mode
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                  View Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}