'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import AppShell from '../components/AppShell';

export default function ChatbotBuilder() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    chatbotPurpose: '',
    apiEndpoints: '',
    trainingData: '',
    contactEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('chatbot_submissions')
        .insert([
          {
            business_name: formData.businessName,
            business_type: formData.businessType,
            chatbot_purpose: formData.chatbotPurpose,
            api_endpoints: formData.apiEndpoints || null,
            training_data: formData.trainingData,
            contact_email: formData.contactEmail,
          },
        ]);

      if (error) {
        throw error;
      }

      alert('Chatbot creation request submitted successfully! We will contact you soon.');
      setFormData({
        businessName: '',
        businessType: '',
        chatbotPurpose: '',
        apiEndpoints: '',
        trainingData: '',
        contactEmail: '',
      });
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      const message = error instanceof Error ? error.message : JSON.stringify(error, null, 2);
      alert(`Error submitting form: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      title="Chatbot Builder"
      description="Create custom chatbot requests for business, hospitality, or personal workflows."
      badge="AI Intake"
    >
      <div className="surface-strong mx-auto max-w-2xl p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold">
            Chatbot Builder
          </h2>
          <p className="muted mt-2 text-center text-sm">
            Create your custom chatbot for business or personal use
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium">
              Business/Hobby Name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              placeholder="Enter your business or hobby name"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="businessType"
              name="businessType"
              required
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              value={formData.businessType}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="business">Business</option>
              <option value="hobby">Hobby/Personal</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="chatbotPurpose" className="block text-sm font-medium">
              Chatbot Purpose
            </label>
            <textarea
              id="chatbotPurpose"
              name="chatbotPurpose"
              rows={3}
              required
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              placeholder="Describe what you want the chatbot to do (e.g., answer customer questions, provide room information, help with manuals)"
              value={formData.chatbotPurpose}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="apiEndpoints" className="block text-sm font-medium">
              API Endpoints (Optional)
            </label>
            <textarea
              id="apiEndpoints"
              name="apiEndpoints"
              rows={2}
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              placeholder="List any APIs you want to integrate (e.g., hotel booking system, menu database)"
              value={formData.apiEndpoints}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="trainingData" className="block text-sm font-medium">
              Training Data/Materials
            </label>
            <textarea
              id="trainingData"
              name="trainingData"
              rows={3}
              required
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              placeholder="Describe or provide links to manuals, FAQs, or data to train the chatbot"
              value={formData.trainingData}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Create Chatbot'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}