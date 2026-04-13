import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EOS - Elazar's Operating System</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">App Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppCard
              title="Chatbot Builder"
              description="Create custom chatbots for businesses and hobbyists with API integration."
              link="/chatbot-builder"
            />
            <AppCard
              title="Restaurant Menu Builder"
              description="Build and manage restaurant menus with voice control and screen management."
              link="/menu-builder"
            />
            <AppCard
              title="Photo Selector"
              description="AI-powered photo selection for business and personal use."
              link="/photo-selector"
            />
            <AppCard
              title="Kosher Android Launcher"
              description="Secure launcher for approved apps on kosher smartphones."
              link="/kosher-launcher"
            />
            <AppCard
              title="Community App for Shuls"
              description="Connect with Jewish communities, zmanim, and shiurim."
              link="/shul-community"
            />
            <AppCard
              title="Resume Site"
              description="Professional resume builder and sharing platform."
              link="/resume-site"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function AppCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{title[0]}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {description}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
        <div className="text-sm">
          <Link href={link} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            Launch App
          </Link>
        </div>
      </div>
    </div>
  );
}
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
