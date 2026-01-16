
import React from 'react';
import { ProfileData } from '../types';

interface HeroProps {
  data: ProfileData;
  onShowCerts: () => void;
}

const Hero: React.FC<HeroProps> = ({ data, onShowCerts }) => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-40 bg-slate-950 relative overflow-hidden scroll-mt-20 transition-colors duration-1000">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/20 to-transparent -z-10 opacity-70"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-900/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-bold mb-8 uppercase tracking-widest">
            Expert Physical Therapist
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.15] text-white mb-8 whitespace-pre-wrap">
            {data.headline}
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-400 mb-12 font-medium leading-relaxed max-w-2xl">
            {data.subHeadline}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToContact}
              className="px-10 py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-900/20 hover:bg-teal-500 transition-all transform hover:-translate-y-1"
            >
              연락처 확인하기
            </button>
            <button 
              onClick={onShowCerts}
              className="px-10 py-4 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-bold text-lg hover:border-teal-500/30 hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              면허 및 자격 증명
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  );
};

export default Hero;
