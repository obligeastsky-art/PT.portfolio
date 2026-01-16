
import React from 'react';
import { ProfileData } from '../types';

interface AboutProps {
  data: ProfileData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <section id="about" className="py-24 bg-[#1e3a8a] transition-colors duration-1000 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={data.profileImageUrl || "https://picsum.photos/seed/doctor/800/1000"} 
                alt="Profile" 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-teal-600 p-8 rounded-2xl shadow-xl text-white hidden md:block border border-white/20">
              <p className="text-sm font-medium opacity-80 mb-1">치료 철학</p>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap italic">
                "{data.philosophyHighlight || "환자의 완벽한 복귀가 제 최고의 보람입니다."}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Professional Philosophy</h2>
            <p className="text-xl text-blue-100/80 leading-relaxed mb-12 whitespace-pre-wrap">
              {data.philosophy}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {data.expertise.map((item, idx) => (
                <div key={idx} className="p-6 bg-white/5 rounded-2xl text-center border border-white/10 hover:border-teal-400 transition-colors group">
                  <p className="text-teal-400 text-2xl font-bold mb-1 group-hover:scale-110 transition-transform">{item.value}</p>
                  <p className="text-blue-200/60 text-sm font-medium">{item.label}</p>
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
