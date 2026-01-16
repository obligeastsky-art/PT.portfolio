
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
    <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-40 bg-slate-950 relative overflow-hidden scroll-mt-20">
      {/* 전문적인 분위기를 위한 그라데이션 오버레이 */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-l from-blue-900/10 via-slate-950/40 to-slate-950 -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-black uppercase tracking-widest">
              Licensed Physical Therapist
            </span>
            <span className="w-12 h-px bg-white/10"></span>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Master of Science</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] text-white mb-10 tracking-tighter">
            {data.headline.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i === 0 && <br/>}
              </React.Fragment>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-14 font-medium leading-relaxed max-w-2xl border-l-4 border-teal-600 pl-8">
            {data.subHeadline}
          </p>
          
          <div className="flex flex-wrap gap-5">
            <button 
              onClick={scrollToContact}
              className="px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-teal-900/40 hover:bg-teal-500 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              협업 및 채용 문의
            </button>
            <button 
              onClick={onShowCerts}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg hover:border-teal-500/30 hover:bg-white/10 transition-all flex items-center gap-3 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              증명서 확인
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
