'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type ChatbotSubmission = {
  id: string;
  created_at: string;
  business_name: string;
  business_type: string;
  chatbot_purpose: string;
  api_endpoints: string | null;
  training_data: string;
  contact_email: string;
  status: string;
};

type Shul = {
  id: string;
  created_at: string;
  name: string;
  address: string;
  website: string | null;
  contact_email: string;
  approved: boolean;
};

export default function DashboardPage() {
  const [tab, setTab] = useState<'submissions' | 'shuls'>('submissions');
  const [submissions, setSubmissions] = useState<ChatbotSubmission[]>([]);
  const [shuls, setShuls] = useState<Shul[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const { data: submissionData, error: submissionError } = await supabase
      .from('chatbot_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (submissionError) {
      setError(submissionError.message);
    } else if (submissionData) {
      setSubmissions(submissionData as ChatbotSubmission[]);
    }

    const { data: shulData, error: shulError } = await supabase
      .from('shuls')
      .select('*')
      .order('created_at', { ascending: false });

    if (shulError) {
      setError((prev) => (prev ? `${prev}; ${shulError.message}` : shulError.message));
    } else if (shulData) {
      setShuls(shulData as Shul[]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EOS Admin Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Review your chatbot and shul submissions from Supabase.</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
            {[
              { value: 'submissions', label: 'Chatbot Submissions' },
              { value: 'shuls', label: 'Shul Submissions' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTab(option.value as 'submissions' | 'shuls')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === option.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-6 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {tab === 'submissions' && !loading && (
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chatbot Submissions</h2>
            <div className="grid gap-4">
              {submissions.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No chatbot submissions found. Try submitting one from the Chatbot Builder app and then refresh.
                </p>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{submission.business_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{submission.business_type}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold dark:bg-blue-900 dark:text-blue-200">
                        {submission.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{submission.chatbot_purpose}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div>
                        <strong className="text-sm text-gray-700 dark:text-gray-300">Email</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{submission.contact_email}</p>
                      </div>
                      <div>
                        <strong className="text-sm text-gray-700 dark:text-gray-300">API Endpoints</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{submission.api_endpoints || 'None'}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(submission.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'shuls' && !loading && (
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shul Submissions</h2>
            <div className="grid gap-4">
              {shuls.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No shul submissions found. Submit a new shul from the Shul Community app and refresh to see it here.
                </p>
              ) : (
                shuls.map((shul) => (
                  <div key={shul.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shul.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{shul.address}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shul.approved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {shul.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {shul.website && (
                      <p className="mt-3 text-sm text-blue-600 dark:text-blue-300">
                        <a href={shul.website} target="_blank" rel="noreferrer">{shul.website}</a>
                      </p>
                    )}
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(shul.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
