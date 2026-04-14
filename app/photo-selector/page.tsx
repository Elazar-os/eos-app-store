'use client';

import { useState } from 'react';

interface Photo {
  id: string;
  url: string;
  score: number;
  selected: boolean;
}

export default function PhotoSelector() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [useCase, setUseCase] = useState<'business' | 'personal' | 'dating'>('business');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      score: Math.random() * 100, // Simulated AI score
      selected: false,
    }));

    setTimeout(() => {
      setPhotos(newPhotos);
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleSelect = (id: string) => {
    setPhotos(photos.map(photo =>
      photo.id === id ? { ...photo, selected: !photo.selected } : photo
    ));
  };

  const selectBest = () => {
    const sorted = [...photos].sort((a, b) => b.score - a.score);
    const bestCount = Math.min(5, sorted.length);
    setPhotos(photos.map(photo => ({
      ...photo,
      selected: sorted.slice(0, bestCount).some(p => p.id === photo.id)
    })));
  };

  const downloadSelected = () => {
    // TODO: Implement download functionality
    alert('Download functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          AI Photo Selector
        </h1>

        {/* Use Case Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Use Case</h2>
          <div className="flex space-x-4">
            {[
              { value: 'business', label: 'Business (Resume, LinkedIn)' },
              { value: 'personal', label: 'Personal' },
              { value: 'dating', label: 'Dating (Shidduch)' },
            ].map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  value={option.value}
                  checked={useCase === option.value}
                  onChange={(e) => setUseCase(e.target.value as typeof useCase)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload Photos</h2>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="text-gray-600 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-lg">Click to upload photos</p>
                <p className="text-sm">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 dark:text-blue-200">AI is analyzing your photos...</p>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Photos ({photos.length})
              </h2>
              <div className="space-x-2">
                <button
                  onClick={selectBest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Select Best Photos
                </button>
                <button
                  onClick={downloadSelected}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Download Selected
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${
                    photo.selected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => toggleSelect(photo.id)}
                >
                  <img src={photo.url} alt="Uploaded" className="w-full h-32 object-cover" />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {photo.score.toFixed(1)}%
                  </div>
                  {photo.selected && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parody J Swipe Card */}
        {useCase === 'dating' && (
          <div className="bg-pink-50 dark:bg-pink-900 border border-pink-200 dark:border-pink-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-200 mb-2">
              💕 Parody J Swipe Card 💕
            </h3>
            <p className="text-pink-700 dark:text-pink-300">
              For fun: Imagine this as a dating app card. Swipe right if you like kosher sushi! 🐟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}