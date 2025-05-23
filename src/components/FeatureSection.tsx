import { CheckCircle } from 'lucide-react';
import React from 'react';

const FeatureSection: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-jira-text">
            Built for every team and workflow
          </h2>
          <p className="text-lg text-gray-600">
            Plan, track, and manage work across teams with powerful views and field-level ownership that flexes to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="h-48 bg-gradient-to-tr from-jira-blue to-jira-purple flex items-center justify-center p-8">
              <img
                src="/assets/icons/project-planning.jpeg"
                alt="Project Planning"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-jira-text">Project Planning</h3>
              <p className="text-gray-600 mb-4">
                Create and manage projects with customizable workflows that adapt to your team's needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Customizable Kanban boards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Sprint planning tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Advanced roadmaps</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="h-48 bg-gradient-to-tr from-jira-purple to-jira-lightblue flex items-center justify-center p-8">
              <img
                src="/assets/icons/team-collaboration.jpeg"
                alt="Team Collaboration"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-jira-text">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Streamline team communication with real-time updates and notifications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Role-based permissions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Comment threads and mentions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">File sharing and attachments</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="h-48 bg-gradient-to-tr from-jira-lightblue to-jira-blue flex items-center justify-center p-8">
              <img
                src="/assets/icons/performance-tracking.jpeg"
                alt="Performance Tracking"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-jira-text">Performance Tracking</h3>
              <p className="text-gray-600 mb-4">
                Monitor progress and visualize performance with powerful reporting tools.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Real-time dashboards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Custom reports and charts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700">Velocity tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a href="#" className="inline-flex items-center text-jira-blue hover:text-jira-purple font-semibold transition-colors">
            View all features
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
