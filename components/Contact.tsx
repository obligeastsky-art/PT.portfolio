
import React, { useState } from 'react';
import { ProfileData } from '../types';

interface ContactProps {
  data: ProfileData;
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copyStatus, setCopyStatus] = useState<'email' | 'phone' | null>(null);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(type);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <section id="contact" className="py-24 bg-[#0a192f] transition-colors duration-1000 scroll-mt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Information</h2>
          <p className="text-gray-400 mb-12">전문적인 협업이나 채용 제안은 아래 연락처를 클릭하여 복사 후 문의 부탁드립니다.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div 
              onClick={() => handleCopy(data.email, 'email')}
              className={`relative bg-white/5 p-10 rounded-[2.5rem] shadow-xl border border-white/10 hover:border-teal-500/30 transition-all duration-300 group cursor-pointer active:scale-95 ${copyStatus === 'email' ? 'ring-2 ring-teal-500 border-teal-500 shadow-teal-500/20' : ''}`}
            >
              {copyStatus === 'email' && (
                <div className="absolute top-6 right-6 bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg">
                  복사되었습니다!
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors ${copyStatus === 'email' ? 'bg-teal-500 text-white' : 'bg-white/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 0-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Email Address</h3>
              <p className="text-2xl font-bold text-white break-all">{data.email}</p>
              <p className="text-[10px] text-teal-400 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Click to Copy</p>
            </div>

            {/* Phone Card */}
            <div 
              onClick={() => handleCopy(data.phone, 'phone')}
              className={`relative bg-white/5 p-10 rounded-[2.5rem] shadow-xl border border-white/10 hover:border-teal-500/30 transition-all duration-300 group cursor-pointer active:scale-95 ${copyStatus === 'phone' ? 'ring-2 ring-teal-500 border-teal-500 shadow-teal-500/20' : ''}`}
            >
              {copyStatus === 'phone' && (
                <div className="absolute top-6 right-6 bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg">
                  복사되었습니다!
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors ${copyStatus === 'phone' ? 'bg-teal-500 text-white' : 'bg-white/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Phone Number</h3>
              <p className="text-2xl font-bold text-white">{data.phone}</p>
              <p className="text-[10px] text-teal-400 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Click to Copy</p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center gap-6">
            <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-teal-400 hover:border-teal-400 transition-all shadow-sm hover:shadow-md">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-teal-400 hover:border-teal-400 transition-all shadow-sm hover:shadow-md">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
