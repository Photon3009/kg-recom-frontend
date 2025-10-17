'use client';

interface WidgetRendererProps {
  data: any[];
  widgetCode?: string | null;
}

export default function WidgetRenderer({ data, widgetCode }: WidgetRendererProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // If no widget code, display as simple cards
  if (!widgetCode) {
    return (
      <div className="space-y-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  // Parse and render with widget code
  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg mb-3">
        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-bold text-indigo-900">
          {data.length} Candidate{data.length !== 1 ? 's' : ''} Found
        </span>
      </div>
      {data.map((item, index) => (
        <CandidateCard key={index} data={item} />
      ))}
    </div>
  );
}

// Simple candidate card component
function CandidateCard({ data }: { data: any }) {
  // Extract common fields from the data
  // Handle both c.name and name formats
  const id = data['c.id'] || data.id || '';
  const name = data['c.name'] || data.name || data.candidateName || 'Unknown';
  const email = data['c.email'] || data.email || '';
  const phone = data['c.phone'] || data.phone || '';
  const currentRole = data['c.currentRole'] || data.currentRole || data.role || '';
  const totalExperienceMonths = data['c.totalExperienceMonths'] || data.totalExperienceMonths || 0;
  const location = data['c.location'] || data.location || '';

  // Convert months to years
  const experience = totalExperienceMonths >= 12
    ? `${Math.floor(totalExperienceMonths / 12)} years ${totalExperienceMonths % 12 > 0 ? `${totalExperienceMonths % 12} months` : ''}`
    : `${totalExperienceMonths} months`;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg flex-shrink-0 shadow-lg">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white drop-shadow-md truncate">{name}</h3>
          <p className="text-xs text-white/90 font-medium">Candidate Profile</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 bg-white/50 backdrop-blur-sm">
        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 font-medium flex-1">{phone}</span>
            <a
              href={`tel:${phone}`}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-sm transition-all duration-200"
            >
              Call
            </a>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 font-medium flex-1 truncate">{email}</span>
            <a
              href={`mailto:${email}`}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-sm transition-all duration-200"
            >
              Email
            </a>
          </div>
        )}

        {/* Current Role */}
        {currentRole && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 font-semibold">{currentRole}</span>
          </div>
        )}

        {/* Experience */}
        {totalExperienceMonths > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 font-medium">{experience} experience</span>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 font-medium">{location}</span>
          </div>
        )}

        {/* View Profile Button */}
        {id && (
          <div className="pt-3 mt-3 border-t border-slate-200">
            <a
              href={`/candidates/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Full Profile
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
