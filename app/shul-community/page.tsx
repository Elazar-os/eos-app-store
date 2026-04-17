'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import AppShell from '../components/AppShell';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    contactEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('shuls')
        .insert([
          {
            name: formData.name,
            address: formData.address,
            website: formData.website || null,
            contact_email: formData.contactEmail,
            approved: false, // New submissions need approval
          },
        ]);

      if (error) {
        throw error;
      }

      alert('Shul submission received! We will review and add it to the community.');
      setShowForm(false);
      setFormData({ name: '', address: '', website: '', contactEmail: '' });
    } catch (error: unknown) {
      console.error('Error submitting shul:', error);
      const message = error instanceof Error ? error.message : JSON.stringify(error, null, 2);
      alert(`Error submitting shul: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      title="Shul Community"
      description="Submit and browse community shul information, contact details, and recurring schedules."
      badge="Community"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Shul Community App
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            {showForm ? 'Cancel' : 'Add Shul'}
          </button>
        </div>

        {/* Add Shul Form */}
        {showForm && (
          <div className="surface-strong mb-8 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Submit Shul Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Shul Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[color:var(--brand)] px-6 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Shul'}
              </button>
            </form>
          </div>
        )}

        {/* Shuls List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shuls.map(shul => (
            <div key={shul.id} className="surface-strong p-6">
              <h3 className="mb-2 text-xl font-semibold">
                {shul.name}
              </h3>
              <p className="muted mb-4">{shul.address}</p>

              {shul.website && (
                <a
                  href={shul.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 block font-medium text-[color:var(--brand)] hover:underline"
                >
                  Visit Website
                </a>
              )}

              <div className="mb-4">
                <h4 className="mb-2 font-medium">Zmanim</h4>
                <div className="muted space-y-1 text-sm">
                  <p>Shacharis: {shul.zmanim.shacharis}</p>
                  <p>Mincha: {shul.zmanim.mincha}</p>
                  <p>Maariv: {shul.zmanim.maariv}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Shiurim</h4>
                <ul className="muted space-y-1 text-sm">
                  {shul.shiurim.map((shiur, index) => (
                    <li key={index}>• {shiur}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="rounded-lg bg-[color:var(--brand)] px-3 py-1 text-sm text-white">
                  CarPlay Mode
                </button>
                <button className="rounded-lg border border-black/10 bg-white/85 px-3 py-1 text-sm">
                  View Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}