'use client';

interface Activity {
  id: string;
  type: 'submission' | 'message' | 'attendance' | 'grading';
  description: string;
  timestamp: string;
  course: string;
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'submission',
      description: 'Sarah Connor submitted Assignment 5',
      timestamp: '5 minutes ago',
      course: 'Advanced Mathematics',
    },
    {
      id: '2',
      type: 'message',
      description: 'New message from James Wilson',
      timestamp: '15 minutes ago',
      course: 'Physics Lab',
    },
    {
      id: '3',
      type: 'attendance',
      description: 'Attendance marked for Grade 12-A',
      timestamp: '1 hour ago',
      course: 'Advanced Mathematics',
    },
    {
      id: '4',
      type: 'grading',
      description: 'Mid-term papers graded for Grade 11-B',
      timestamp: '2 hours ago',
      course: 'Computer Science',
    },
  ];

  const typeIcons = {
    submission: {
      bg: 'bg-blue-100',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    message: {
      bg: 'bg-green-100',
      icon: (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    attendance: {
      bg: 'bg-purple-100',
      icon: (
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    grading: {
      bg: 'bg-orange-100',
      icon: (
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="p-3 hover:bg-gray-50 transition-colors">
            <div className="flex space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${typeIcons[activity.type].bg} flex items-center justify-center`}>
                {typeIcons[activity.type].icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="mt-0.5 flex items-center space-x-2 text-xs text-gray-500">
                  <span>{activity.course}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}