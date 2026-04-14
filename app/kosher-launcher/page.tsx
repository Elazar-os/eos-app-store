export default function KosherLauncher() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Kosher Android Launcher
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Approved Apps Only
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A custom Android launcher that locks down the device to only allow pre-approved applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Locks device to approved apps only</li>
                <li>• Prevents installation of unauthorized apps</li>
                <li>• Content filtering for inappropriate material</li>
                <li>• Parental controls and monitoring</li>
                <li>• Customizable approved app list</li>
                <li>• Emergency override capabilities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inspiration</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Inspired by content filtering solutions that remove inappropriate scenes from movies and media.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Note: This launcher concept is designed for kosher smartphones and family-friendly device management.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              Download Launcher (Coming Soon)
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Android APK will be available for download once development is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}