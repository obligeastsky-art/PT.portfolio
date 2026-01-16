
import React from 'react';

interface FooterProps {
  onAdminToggle: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminToggle }) => {
  return (
    <footer className="bg-slate-950 py-16 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-10">
           <a href="#" className="text-2xl font-black tracking-tighter text-white">
            PT.<span className="text-teal-400">PORTFOLIO</span>
          </a>
        </div>
        
        <p className="text-slate-500 text-sm mb-8 font-medium">
          © 2026 Physical Therapist Dong-Cheon Jang. All Rights Reserved.
        </p>
        
        <div className="flex justify-center flex-wrap gap-x-10 gap-y-4 text-xs font-black text-slate-600 uppercase tracking-widest">
          <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
          <button 
            onClick={onAdminToggle}
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
