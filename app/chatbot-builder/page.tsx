'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Chatbot Builder
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create your custom chatbot for business or personal use
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Business/Hobby Name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your business or hobby name"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              id="businessType"
              name="businessType"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            <label htmlFor="chatbotPurpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chatbot Purpose
            </label>
            <textarea
              id="chatbotPurpose"
              name="chatbotPurpose"
              rows={3}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe what you want the chatbot to do (e.g., answer customer questions, provide room information, help with manuals)"
              value={formData.chatbotPurpose}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="apiEndpoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              API Endpoints (Optional)
            </label>
            <textarea
              id="apiEndpoints"
              name="apiEndpoints"
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="List any APIs you want to integrate (e.g., hotel booking system, menu database)"
              value={formData.apiEndpoints}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="trainingData" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Training Data/Materials
            </label>
            <textarea
              id="trainingData"
              name="trainingData"
              rows={3}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe or provide links to manuals, FAQs, or data to train the chatbot"
              value={formData.trainingData}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Create Chatbot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}