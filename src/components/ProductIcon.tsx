import React from 'react';

interface ProductIconProps {
  type?: string;
  name: string;
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ type, name, className = 'w-12 h-12' }) => {
  // Return appropriate SVG representation
  switch (type) {
    case 'soccer':
      return (
        <div className={`${className} bg-slate-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 48 48" className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="24" cy="24" r="20" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
            <polygon points="24,14 31,19 28,27 20,27 17,19" fill="#1e293b" />
            <line x1="24" y1="4" x2="24" y2="14" stroke="#1e293b" strokeWidth="2" />
            <line x1="41" y1="16" x2="31" y2="19" stroke="#1e293b" strokeWidth="2" />
            <line x1="36" y1="36" x2="28" y2="27" stroke="#1e293b" strokeWidth="2" />
            <line x1="12" y1="36" x2="20" y2="27" stroke="#1e293b" strokeWidth="2" />
            <line x1="7" y1="16" x2="17" y2="19" stroke="#1e293b" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'bottle-large':
      return (
        <div className={`${className} bg-sky-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="3" width="8" height="4" rx="1" fill="#0284c7" />
            <path d="M10 7 H22 L24 14 V41 C24 43 22 45 19 45 H13 C10 45 8 43 8 41 V14 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="8.5" y="19" width="15" height="12" fill="#0284c7" />
            <text x="16" y="27" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">CLUB</text>
            <text x="16" y="30" fill="#ffffff" fontSize="3" textAnchor="middle">1500ml</text>
          </svg>
        </div>
      );

    case 'bottle-small':
      return (
        <div className={`${className} bg-sky-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="13" y="6" width="6" height="3" rx="1" fill="#0284c7" />
            <path d="M11 9 H21 L22 15 V38 C22 40 20 42 18 42 H14 C12 42 10 40 10 38 V15 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="10.5" y="19" width="11" height="9" fill="#0284c7" />
            <text x="16" y="25" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">CLUB</text>
            <text x="16" y="28" fill="#ffffff" fontSize="2.5" textAnchor="middle">600ml</text>
          </svg>
        </div>
      );

    case 'gallon':
      return (
        <div className={`${className} bg-sky-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 40 48" className="w-full h-full" fill="none">
            <rect x="16" y="2" width="8" height="4" rx="1" fill="#0369a1" />
            <path d="M14 6 H26 L29 12 V38 C29 42 27 44 20 44 C13 44 11 42 11 38 V12 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            <ellipse cx="20" cy="24" rx="6" ry="6" fill="#0369a1" />
            <text x="20" y="26" fill="#ffffff" fontSize="4" fontWeight="bold" textAnchor="middle">19L</text>
          </svg>
        </div>
      );

    case 'juice':
      return (
        <div className={`${className} bg-amber-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="4" width="8" height="3" rx="1" fill="#ea580c" />
            <path d="M10 7 H22 L23 16 V38 C23 41 21 43 18 43 H14 C11 43 9 41 9 38 V16 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />
            <circle cx="16" cy="26" r="5" fill="#ea580c" />
            <text x="16" y="28" fill="#ffffff" fontSize="3.5" fontWeight="bold" textAnchor="middle">FLR</text>
          </svg>
        </div>
      );

    case 'coffee':
      return (
        <div className={`${className} bg-amber-100 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="4" width="8" height="3" rx="1" fill="#78350f" />
            <path d="M10 7 H22 L23 15 V38 C23 41 21 43 18 43 H14 C11 43 9 41 9 38 V15 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <rect x="9.5" y="18" width="13" height="11" fill="#b45309" />
            <text x="16" y="25" fill="#fef3c7" fontSize="3.5" fontWeight="bold" textAnchor="middle">GOLDA</text>
          </svg>
        </div>
      );

    case 'energy':
    case 'isotonic':
      return (
        <div className={`${className} bg-cyan-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="4" width="8" height="3" rx="1" fill="#0284c7" />
            <path d="M10 7 H22 L23 15 V39 C23 42 21 43 18 43 H14 C11 43 9 42 9 39 V15 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" />
            <rect x="9.5" y="17" width="13" height="14" fill="#0284c7" />
            <text x="16" y="24" fill="#ffffff" fontSize="3.5" fontWeight="bold" textAnchor="middle">POCARI</text>
            <text x="16" y="28" fill="#ffffff" fontSize="2.8" textAnchor="middle">SWEAT</text>
          </svg>
        </div>
      );

    case 'isotonic-large':
      return (
        <div className={`${className} bg-cyan-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="2" width="8" height="3" rx="1" fill="#0284c7" />
            <path d="M9 5 H23 L25 14 V41 C25 43 22 45 19 45 H13 C10 45 7 43 7 41 V14 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" />
            <rect x="7.5" y="17" width="17" height="15" fill="#0284c7" />
            <text x="16" y="24" fill="#ffffff" fontSize="3.5" fontWeight="bold" textAnchor="middle">POCARI</text>
            <text x="16" y="28" fill="#ffffff" fontSize="3" textAnchor="middle">900ml</text>
          </svg>
        </div>
      );

    case 'tea':
      return (
        <div className={`${className} bg-emerald-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="4" width="8" height="3" rx="1" fill="#15803d" />
            <path d="M10 7 H22 L23 15 V39 C23 42 21 43 18 43 H14 C11 43 9 42 9 39 V15 Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
            <rect x="9.5" y="18" width="13" height="12" fill="#15803d" />
            <text x="16" y="25" fill="#ffffff" fontSize="3.2" fontWeight="bold" textAnchor="middle">JAVANA</text>
          </svg>
        </div>
      );

    case 'milk':
      return (
        <div className={`${className} bg-rose-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 32 48" className="w-full h-full" fill="none">
            <rect x="12" y="5" width="8" height="3" rx="1" fill="#e11d48" />
            <path d="M10 8 H22 L23 16 V38 C23 41 21 43 18 43 H14 C11 43 9 41 9 38 V16 Z" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
            <rect x="9.5" y="18" width="13" height="11" fill="#e11d48" />
            <text x="16" y="25" fill="#ffffff" fontSize="3.5" fontWeight="bold" textAnchor="middle">MILKU</text>
          </svg>
        </div>
      );

    case 'stadium':
      return (
        <div className={`${className} bg-emerald-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 48 48" className="w-full h-full text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="10" width="36" height="28" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
            <line x1="24" y1="10" x2="24" y2="38" stroke="#059669" strokeWidth="2" />
            <circle cx="24" cy="24" r="6" stroke="#059669" strokeWidth="2" />
            <rect x="6" y="18" width="6" height="12" stroke="#059669" strokeWidth="2" />
            <rect x="36" y="18" width="6" height="12" stroke="#059669" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'bike':
      return (
        <div className={`${className} bg-indigo-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 48 48" className="w-full h-full text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="32" r="7" stroke="#4338ca" strokeWidth="2.5" />
            <circle cx="36" cy="32" r="7" stroke="#4338ca" strokeWidth="2.5" />
            <path d="M12 32 L22 18 L30 18 L36 32 M22 18 L25 32 L12 32 M30 18 L24 25" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 14 H33" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 15 H24" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'noodle':
      return (
        <div className={`${className} bg-red-50 flex items-center justify-center rounded-lg p-1`}>
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <rect x="8" y="12" width="32" height="24" rx="3" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <rect x="10" y="16" width="28" height="8" fill="#dc2626" />
            <text x="24" y="22" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">INDOMIE</text>
            <circle cx="24" cy="30" r="3" fill="#f59e0b" />
          </svg>
        </div>
      );

    default:
      // Generic clean initial avatar with character
      return (
        <div className={`${className} bg-slate-100 text-slate-700 font-bold flex items-center justify-center rounded-lg border border-slate-200 text-sm`}>
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
