'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SharedLinkData {
  profile_type: string;
  user_id: string;
  expires_at: string;
  is_active: boolean;
}

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

export default function SharedProfile({ params }: { params: { token: string } }) {
  const [linkData, setLinkData] = useState<SharedLinkData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateAndLoadProfile() {
      try {
        // Validate shared link
        const { data: linkData, error: linkError } = await supabase
          .from('shared_links')
          .select('*')
          .eq('token', params.token)
          .eq('is_active', true)
          .single();

        if (linkError || !linkData) {
          setError('Invalid or expired link');
          return;
        }

        // Check if link is expired
        if (new Date(linkData.expires_at) < new Date()) {
          setError('This link has expired');
          return;
        }

        setLinkData(linkData);

        // Increment view count
        await supabase
          .from('shared_links')
          .update({ view_count: (linkData.view_count || 0) + 1 })
          .eq('id', linkData.id);

        // Load resume data (mock data for now)
        setResumeData({
          personal: {
            name: 'Elazar',
            email: 'elazar@example.com',
            phone: '(555) 123-4567',
            location: 'New York, NY',
            linkedin: 'linkedin.com/in/elazar',
            summary: 'Experienced developer passionate about creating innovative solutions.',
          },
          experience: [
            {
              id: '1',
              title: 'Software Developer',
              company: 'Tech Company',
              period: '2020 - Present',
              description: 'Developed web applications using React and Node.js.',
            },
          ],
          education: [
            {
              id: '1',
              degree: 'Bachelor of Science in Computer Science',
              school: 'University of Example',
              year: '2019',
            },
          ],
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        });

      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    validateAndLoadProfile();
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData || !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h1>
          <p className="text-gray-600">{error || 'Profile could not be loaded'}</p>
        </div>
      </div>
    );
  }

  const viewMode = linkData.profile_type as 'professional' | 'personal' | 'both';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* No hamburger menu or navigation - completely isolated */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Personal Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {resumeData.personal.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-4">
              <div><strong>Email:</strong> {resumeData.personal.email}</div>
              <div><strong>Phone:</strong> {resumeData.personal.phone}</div>
              <div><strong>Location:</strong> {resumeData.personal.location}</div>
              <div><strong>LinkedIn:</strong> {resumeData.personal.linkedin}</div>
            </div>

            <div>
              <strong>Summary:</strong>
              <p className="text-gray-600 mt-2">{resumeData.personal.summary}</p>
            </div>
          </div>

          {/* Experience */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="mb-4 border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company} • {exp.period}</p>
                  <p className="text-gray-600 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Section */}
          {(viewMode === 'personal' || viewMode === 'both') && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal</h2>
              <p className="text-gray-600">
                This section includes personal interests, hobbies, and other non-professional information.
              </p>
            </div>
          )}

          {/* Footer with expiration notice */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            This profile link expires on {new Date(linkData.expires_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}