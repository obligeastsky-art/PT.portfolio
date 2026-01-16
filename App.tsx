
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ProfessionalDetails from './components/ProfessionalDetails';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import { ProfileData } from './types';
import { INITIAL_DATA } from './constants';

type ViewState = 'site' | 'login' | 'admin';

const App: React.FC = () => {
  const [data, setData] = useState<ProfileData>(INITIAL_DATA);
  const [view, setView] = useState<ViewState>('site');
  const [showCertViewer, setShowCertViewer] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('pt_portfolio_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const handleUpdateData = (newData: ProfileData) => {
    setData(newData);
    localStorage.setItem('pt_portfolio_data', JSON.stringify(newData));
  };

  if (view === 'admin') {
    return <AdminPanel data={data} onUpdate={handleUpdateData} onClose={() => setView('site')} />;
  }

  if (view === 'login') {
    return <AdminLogin onLoginSuccess={() => setView('admin')} onCancel={() => setView('site')} />;
  }

  return (
    <div className="min-h-screen relative bg-slate-950 text-white selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <Header isAdmin={false} onAdminToggle={() => setView('login')} />
      
      <main>
        <Hero data={data} onShowCerts={() => setShowCertViewer(true)} />
        <About data={data} />
        <ProfessionalDetails data={data} />
        <Portfolio data={data} />
        <Contact data={data} />
      </main>

      <Footer onAdminToggle={() => setView('login')} />
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-teal-500 transition-all z-40 transform hover:scale-110 border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Certification Viewer Modal */}
      {showCertViewer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setShowCertViewer(false)}></div>
          <div className="relative w-full max-w-6xl bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Licenses & Credentials</h2>
                <p className="text-sm text-teal-400 font-bold mt-1 uppercase tracking-widest">장동천 물리치료사 증명서 사본</p>
              </div>
              <button onClick={() => setShowCertViewer(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
              {data.certificationImages && data.certificationImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.certificationImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setFullscreenImg(img)}
                      className="group relative bg-slate-800 rounded-[2rem] overflow-hidden border border-white/5 shadow-xl cursor-zoom-in hover:border-teal-500/50 transition-all flex flex-col items-center justify-center min-h-[300px]"
                    >
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img 
                          src={img} 
                          alt={`Credential ${idx + 1}`} 
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-sm italic">증명서 파일이 아직 등록되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Overlay */}
      {fullscreenImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 transition-all animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setFullscreenImg(null)}
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-all hover:rotate-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full h-full flex items-center justify-center" onClick={() => setFullscreenImg(null)}>
            <img 
              src={fullscreenImg} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.4); }
      `}</style>
    </div>
  );
};

export default App;
