
import React from 'react';
import { ProfileData } from '../types';

interface ProfessionalDetailsProps {
  data: ProfileData;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({ data }) => {
  return (
    <section id="credentials" className="py-24 bg-slate-900 transition-colors duration-1000 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Experience Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">경력사항</h2>
            </div>
            <div className="relative pl-8 border-l-2 border-white/10 space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-slate-900 border-2 border-teal-400 rounded-full"></div>
                  <span className="text-sm font-bold text-teal-400 tracking-wider">{exp.year}</span>
                  <h4 className="text-lg font-bold text-white mt-1">{exp.title}</h4>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">학업사항</h2>
            </div>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-6 bg-white/5 rounded-2xl shadow-sm border border-white/10 hover:border-teal-400 transition-all hover:shadow-md group">
                  <span className="text-xs font-bold text-teal-400 block mb-1">{edu.year}</span>
                  <h4 className="text-lg font-bold text-white leading-tight group-hover:text-teal-300 transition-colors">{edu.degree}</h4>
                  <p className="text-gray-400 text-sm mt-1">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Licenses & Certifications Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">면허 및 자격</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors hover:shadow-sm group">
                  {/* 날짜 상자 수정: 너비 확장 및 중앙 정렬 강화 */}
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-24 text-[10px] font-black text-orange-400 bg-orange-500/10 px-2 rounded-lg border border-orange-500/20 tracking-tighter">
                    {cert.date}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-bold text-white leading-snug group-hover:text-orange-300 transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                      {cert.organization}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default ProfessionalDetails;
