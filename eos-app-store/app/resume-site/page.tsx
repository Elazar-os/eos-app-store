'use client';

import { useState } from 'react';

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

export default function ResumeSite() {
  const [resumeData, setResumeData] = useState<ResumeData>({
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

  const [viewMode, setViewMode] = useState<'professional' | 'personal' | 'both'>('professional');
  const [isEditing, setIsEditing] = useState(false);

  const handlePersonalChange = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
    });
  };

  const shareResume = (type: 'professional' | 'personal') => {
    const url = `${window.location.origin}/resume-site?view=${type}`;
    navigator.clipboard.writeText(url);
    alert(`Resume link copied: ${url}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setViewMode('professional')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'professional' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setViewMode('personal')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'both' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Both
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => shareResume('professional')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Share Professional
            </button>
            <button
              onClick={() => shareResume('personal')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              Share Personal
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          {/* Personal Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={resumeData.personal.name}
                  onChange={(e) => handlePersonalChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                resumeData.personal.name
              )}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
              <div>
                <strong>Email:</strong>{' '}
                {isEditing ? (
                  <input
                    type="email"
                    value={resumeData.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  resumeData.personal.email
                )}
              </div>
              <div>
                <strong>Phone:</strong>{' '}
                {isEditing ? (
                  <input
                    type="tel"
                    value={resumeData.personal.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  resumeData.personal.phone
                )}
              </div>
              <div>
                <strong>Location:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={resumeData.personal.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  resumeData.personal.location
                )}
              </div>
              <div>
                <strong>LinkedIn:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={resumeData.personal.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  resumeData.personal.linkedin
                )}
              </div>
            </div>

            <div className="mt-4">
              <strong>Summary:</strong>
              {isEditing ? (
                <textarea
                  value={resumeData.personal.summary}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  rows={3}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{resumeData.personal.summary}</p>
              )}
            </div>
          </div>

          {/* Experience */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Experience</h3>
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{exp.company} • {exp.period}</p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Section */}
          {(viewMode === 'personal' || viewMode === 'both') && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This section can include personal interests, hobbies, and other non-professional information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}