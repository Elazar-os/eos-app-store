'use client';

import { useState } from 'react';
import AppShell from '../components/AppShell';

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
    <AppShell
      title="Resume Builder"
      description="Craft a polished resume profile and quickly share professional or personal views."
      badge="Career"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="surface-strong mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <button
              onClick={() => setViewMode('professional')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                viewMode === 'professional' ? 'bg-[color:var(--brand)] text-white' : 'bg-white/80 text-black'
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setViewMode('personal')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                viewMode === 'personal' ? 'bg-[color:var(--brand)] text-white' : 'bg-white/80 text-black'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                viewMode === 'both' ? 'bg-[color:var(--brand)] text-white' : 'bg-white/80 text-black'
              }`}
            >
              Both
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => shareResume('professional')}
              className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
            >
              Share Professional
            </button>
            <button
              onClick={() => shareResume('personal')}
              className="rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-semibold"
            >
              Share Personal
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="surface-strong p-8">
          {/* Personal Info */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">
              {isEditing ? (
                <input
                  type="text"
                  value={resumeData.personal.name}
                  onChange={(e) => handlePersonalChange('name', e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                />
              ) : (
                resumeData.personal.name
              )}
            </h2>

            <div className="muted grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <strong>Email:</strong>{' '}
                {isEditing ? (
                  <input
                    type="email"
                    value={resumeData.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="rounded-lg border border-black/10 bg-white/85 px-2 py-1 focus:outline-none"
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
                    className="rounded-lg border border-black/10 bg-white/85 px-2 py-1 focus:outline-none"
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
                    className="rounded-lg border border-black/10 bg-white/85 px-2 py-1 focus:outline-none"
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
                    className="rounded-lg border border-black/10 bg-white/85 px-2 py-1 focus:outline-none"
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
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white/85 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                />
              ) : (
                <p className="muted mt-2">{resumeData.personal.summary}</p>
              )}
            </div>
          </div>

          {/* Experience */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Experience</h3>
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="mb-4 border-b border-black/10 pb-4">
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="muted">{exp.company} • {exp.period}</p>
                  <p className="muted mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Education</h3>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="muted">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(viewMode === 'professional' || viewMode === 'both') && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map(skill => (
                  <span key={skill} className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-sm text-[color:var(--brand)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Section */}
          {(viewMode === 'personal' || viewMode === 'both') && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Personal</h3>
              <p className="muted">
                This section can include personal interests, hobbies, and other non-professional information.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}