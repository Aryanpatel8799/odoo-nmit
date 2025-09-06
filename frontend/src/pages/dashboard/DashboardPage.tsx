import FeaturesSectionDemo from '@/components/ui/features-section-demo-3'

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-4">
            Welcome to SynergySphere
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            The ultimate team collaboration platform that brings your projects, discussions, and team together in perfect harmony.
          </p>
        </div>

        {/* Features Section */}
        <FeaturesSectionDemo />

        {/* Stats Section */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
                10K+
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Active Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
                50K+
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Team Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
                99.9%
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
