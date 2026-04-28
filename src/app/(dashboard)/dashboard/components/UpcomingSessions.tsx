'use client';

interface VirtualSession {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  platform: 'Zoom' | 'Google Meet' | 'MS Teams';
  participants: number;
  meetingLink: string;
}

export default function UpcomingSessions() {
  const sessions: VirtualSession[] = [
    {
      id: '1',
      title: 'Data Structures Review',
      course: 'Computer Science',
      date: '2026-04-26',
      time: '2:00 PM',
      platform: 'Zoom',
      participants: 25,
      meetingLink: '#',
    },
    {
      id: '2',
      title: 'Physics Q&A Session',
      course: 'Physics Lab',
      date: '2026-04-27',
      time: '10:00 AM',
      platform: 'Google Meet',
      participants: 28,
      meetingLink: '#',
    },
  ];

  const platformIcons = {
    Zoom: (
      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 8.82l3.28-3.28v10.92L0 19.18V8.82zM21.72 0H7.58c-.86 0-1.56.7-1.56 1.56v14.88c0 .86.7 1.56 1.56 1.56h14.14c.86 0 1.56-.7 1.56-1.56V1.56C23.28.7 22.58 0 21.72 0zm-3.28 12.5l3.28 3.28V6.22l-3.28 3.28v3zm-4.38-3.28h-9.5v1.56h9.5V9.22z"/>
      </svg>
    ),
    'Google Meet': (
      <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm6.12 16.12l-3.24-3.24V7.12l3.24-3.24v12.24zM5.88 16.12V7.88L12 12l-6.12 4.12z"/>
      </svg>
    ),
    'MS Teams': (
      <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.88 6.18L9.88 9.42v5.16l8 3.24V6.18zM6.12 7.88v8.24L9.88 18V6L6.12 7.88z"/>
      </svg>
    ),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Create New
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {platformIcons[session.platform]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{session.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{session.course}</p>
                <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(session.date)} at {session.time}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {session.participants}
                  </span>
                </div>
                <div className="mt-2">
                  <button className="w-full px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}