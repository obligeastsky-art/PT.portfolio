
import React from 'react';
import { ProfileData } from '../types';

interface AboutProps {
  data: ProfileData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <section id="about" className="py-24 bg-slate-950 transition-colors duration-1000 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 relative">
            {/* 프로필 이미지 박스 */}
            <div className="aspect-[3/4] md:aspect-[4/5] bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)] border border-white/10 transform hover:scale-[1.01] transition-transform duration-700">
              <img 
                src={data.profileImageUrl || "https://picsum.photos/seed/pt-professional/800/1000"} 
                alt={`${data.name} 물리치료사 프로필`} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* 자격증 요약 태그 (이미지 위 오버레이) */}
            <div className="absolute -bottom-6 -right-6 bg-teal-600 p-6 md:p-8 rounded-[2rem] shadow-2xl text-white hidden md:block border border-white/20 z-10 backdrop-blur-lg">
              <p className="text-[10px] font-black opacity-80 mb-2 uppercase tracking-[0.25em]">Therapy Vision</p>
              <p className="text-lg font-bold leading-tight whitespace-pre-wrap italic">
                "{data.philosophyHighlight}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 mt-12 lg:mt-0">
            <span className="text-teal-400 font-black uppercase tracking-[0.4em] text-xs mb-6 block">Professional Profile</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-[1.1]">
              환자의 일상을 되찾는<br/>핵심 움직임 전문가
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12 whitespace-pre-wrap font-medium">
              {data.philosophy}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
              {data.expertise.map((item, idx) => (
                <div key={idx} className="p-5 md:p-6 bg-white/5 rounded-[1.5rem] text-center border border-white/5 hover:border-teal-500/50 hover:bg-white/10 transition-all group cursor-default flex flex-col justify-center min-h-[100px]">
                  <p className="text-teal-400 text-xl md:text-2xl font-black mb-1 group-hover:scale-105 transition-transform tracking-tight whitespace-pre-wrap leading-tight">{item.value}</p>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
