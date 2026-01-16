
import React, { useState, useRef } from 'react';
import { ProfileData, PortfolioItem, ExperienceItem, EducationItem, CertificationItem } from '../types';

interface AdminPanelProps {
  data: ProfileData;
  onUpdate: (data: ProfileData) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, onClose }) => {
  // 깊은 복사를 사용하여 초기 상태 설정
  const [localData, setLocalData] = useState<ProfileData>(() => JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'general' | 'credentials' | 'portfolio' | 'cert-images'>('general');
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const certListInputRef = useRef<HTMLInputElement>(null);
  const [activePortfolioIdx, setActivePortfolioIdx] = useState<number | null>(null);

  // --- 고유 ID 생성기 (삭제를 위해 매우 중요) ---
  const generateUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // --- [핵심] 삭제 로직: ID 기반으로 필터링 ---
  // 이 함수는 주어진 섹션에서 특정 ID를 가진 항목을 완벽하게 제거합니다.
  const handleRemoveById = (section: keyof ProfileData, id: string) => {
    if (!window.confirm('정말 이 항목을 삭제하시겠습니까?')) return;
    
    setLocalData(prev => {
      const currentList = prev[section];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [section]: currentList.filter((item: any) => item.id !== id)
        };
      }
      return prev;
    });
  };

  // --- 섹션 비우기 (초기화) ---
  const handleClearSection = (section: keyof ProfileData) => {
    if (!window.confirm('해당 섹션의 모든 내용을 삭제하시겠습니까?')) return;
    setLocalData(prev => ({ ...prev, [section]: [] }));
  };

  // --- 항목 추가 로직 ---
  const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'portfolioItems') => {
    const newId = generateUniqueId(section);
    let newItem: any;

    if (section === 'experience') {
      newItem = { id: newId, year: '2024-현재', title: '새로운 경력', description: '업무 내용을 입력하세요.' };
    } else if (section === 'education') {
      newItem = { id: newId, year: '2024', degree: '학위 명칭', institution: '교육 기관' };
    } else if (section === 'certifications') {
      newItem = { id: newId, date: '2024.01', title: '자격 명칭', organization: '발행 기관' };
    } else if (section === 'portfolioItems') {
      newItem = { id: newId, category: 'academic', title: '활동 제목', description: '활동 상세 설명', imageUrls: [], date: '2024' };
    }

    setLocalData(prev => ({
      ...prev,
      [section]: [newItem, ...(prev[section] as any[])]
    }));
  };

  // --- 항목 업데이트 로직 ---
  const handleUpdateItemById = (section: string, id: string, field: string, value: string) => {
    setLocalData(prev => {
      const list = [...(prev[section as keyof ProfileData] as any[])];
      const targetIdx = list.findIndex(item => item.id === id);
      if (targetIdx !== -1) {
        list[targetIdx] = { ...list[targetIdx], [field]: value };
      }
      return { ...prev, [section]: list };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const processImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cert-list' | 'portfolio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const readFile = (file: File) => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });

    if (type === 'profile') {
      const base64 = await readFile(files[0]);
      setLocalData(prev => ({ ...prev, profileImageUrl: base64 }));
    } else if (type === 'cert-list') {
      const newImages = await Promise.all(Array.from(files).map(f => readFile(f)));
      setLocalData(prev => ({ ...prev, certificationImages: [...prev.certificationImages, ...newImages] }));
    } else if (type === 'portfolio' && activePortfolioIdx !== null) {
      const newImages = await Promise.all(Array.from(files).map(f => readFile(f)));
      setLocalData(prev => {
        const items = [...prev.portfolioItems];
        const currentId = items[activePortfolioIdx].id;
        const idx = items.findIndex(it => it.id === currentId);
        if (idx !== -1) {
          items[idx].imageUrls = [...items[idx].imageUrls, ...newImages];
        }
        return { ...prev, portfolioItems: items };
      });
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-teal-400 tracking-tighter uppercase">Portfolio CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'general', label: '기본 브랜딩' },
            { id: 'credentials', label: '경력 / 학업 / 자격' },
            { id: 'portfolio', label: '프로젝트 활동' },
            { id: 'cert-images', label: '증명서 사본' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-teal-600 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3">
          <button onClick={() => { onUpdate(localData); alert('데이터가 저장되었습니다.'); onClose(); }} className="w-full py-4 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-400 active:scale-95 transition-all shadow-xl">전체 저장하기</button>
          <button onClick={onClose} className="w-full py-2 text-slate-500 text-xs font-bold hover:text-white transition-colors">닫기</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-900">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {activeTab === 'general' && (
            <section className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
              <h3 className="text-xl font-black mb-4">프로필 기본 설정</h3>
              <div className="flex gap-8 items-start">
                <div className="w-32 h-40 bg-slate-800 rounded-2xl overflow-hidden relative group shrink-0 border border-white/10">
                  <img src={localData.profileImageUrl} className="w-full h-full object-cover" />
                  <button onClick={() => profileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold transition-opacity">변경</button>
                  <input type="file" ref={profileInputRef} className="hidden" onChange={(e) => processImageUpload(e, 'profile')} />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">메인 헤드라인</label>
                    <textarea name="headline" value={localData.headline} onChange={handleInputChange} className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 outline-none focus:border-teal-500 text-lg font-bold" rows={2} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">상세 소속 및 직함</label>
                    <input name="subHeadline" value={localData.subHeadline} onChange={handleInputChange} className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 outline-none focus:border-teal-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">치료 철학</label>
                <textarea name="philosophy" value={localData.philosophy} onChange={handleInputChange} className="w-full bg-slate-900 p-4 rounded-xl border border-white/10 outline-none focus:border-teal-500 leading-relaxed" rows={4} />
              </div>
            </section>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-12">
              {/* Experience */}
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">경력 사항</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleClearSection('experience')} className="text-[10px] font-bold text-red-500 border border-red-500/10 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">비우기</button>
                    <button onClick={() => handleAddItem('experience')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {localData.experience.map((item) => (
                    <div key={item.id} className="relative p-6 bg-slate-900 rounded-2xl border border-white/5 group">
                      <button onClick={() => handleRemoveById('experience', item.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black">×</button>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <input value={item.year} onChange={(e) => handleUpdateItemById('experience', item.id, 'year', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 text-teal-400 font-bold" />
                        <input value={item.title} onChange={(e) => handleUpdateItemById('experience', item.id, 'title', e.target.value)} className="col-span-3 bg-slate-950 p-3 rounded-xl border border-white/10 font-bold" />
                      </div>
                      <textarea value={item.description} onChange={(e) => handleUpdateItemById('experience', item.id, 'description', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-slate-400 text-sm" rows={2} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">학업 사항</h3>
                  <button onClick={() => handleAddItem('education')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {localData.education.map((item) => (
                    <div key={item.id} className="relative p-6 bg-slate-900 rounded-2xl border border-white/5 group">
                      <button onClick={() => handleRemoveById('education', item.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black">×</button>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <input value={item.year} onChange={(e) => handleUpdateItemById('education', item.id, 'year', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 text-teal-400 font-bold" />
                        <input value={item.degree} onChange={(e) => handleUpdateItemById('education', item.id, 'degree', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 font-bold" />
                      </div>
                      <input value={item.institution} onChange={(e) => handleUpdateItemById('education', item.id, 'institution', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">자격 및 면허</h3>
                  <button onClick={() => handleAddItem('certifications')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
                </div>
                <div className="space-y-3">
                  {localData.certifications.map((item) => (
                    <div key={item.id} className="relative p-4 bg-slate-900 rounded-2xl border border-white/5 flex gap-4 items-center group">
                      <input value={item.date} onChange={(e) => handleUpdateItemById('certifications', item.id, 'date', e.target.value)} className="w-24 bg-slate-950 p-3 rounded-xl border border-white/10 text-xs text-orange-400 font-black" />
                      <div className="flex-1">
                        <input value={item.title} onChange={(e) => handleUpdateItemById('certifications', item.id, 'title', e.target.value)} className="w-full bg-slate-950 p-2 rounded-xl border border-white/10 font-bold text-sm" />
                        <input value={item.organization} onChange={(e) => handleUpdateItemById('certifications', item.id, 'organization', e.target.value)} className="w-full bg-slate-950 p-2 rounded-xl border border-white/10 text-[10px] text-slate-500" />
                      </div>
                      <button onClick={() => handleRemoveById('certifications', item.id)} className="bg-red-500/10 text-red-500 w-10 h-10 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-10 pb-20">
              <button onClick={() => handleAddItem('portfolioItems')} className="w-full py-8 bg-teal-600 text-white font-black rounded-3xl shadow-2xl hover:bg-teal-500 transition-all">+ 새로운 활동 프로젝트 추가</button>
              <div className="space-y-12">
                {localData.portfolioItems.map((item, idx) => (
                  <div key={item.id} className="bg-slate-950 p-10 rounded-[4rem] border border-white/5 shadow-2xl relative">
                    <button onClick={() => handleRemoveById('portfolioItems', item.id)} className="absolute -top-4 -right-4 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 transition-transform">×</button>
                    <div className="grid grid-cols-2 gap-6 mb-8 pr-10">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">활동 제목</label>
                        <input value={item.title} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'title', e.target.value)} className="w-full text-xl font-bold bg-slate-900 p-4 rounded-2xl border border-white/10 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">기간</label>
                        <input value={item.date} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'date', e.target.value)} className="w-full text-teal-400 font-bold bg-slate-900 p-4 rounded-2xl border border-white/10 outline-none" />
                      </div>
                    </div>
                    <div className="mb-8">
                      <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">상세 설명</label>
                      <textarea value={item.description} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'description', e.target.value)} className="w-full bg-slate-900 p-5 rounded-2xl border border-white/10 text-slate-400 leading-relaxed outline-none" rows={4} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase">사진 관리 ({item.imageUrls.length})</label>
                        <button onClick={() => { setActivePortfolioIdx(idx); portfolioInputRef.current?.click(); }} className="text-teal-400 font-bold text-xs hover:underline">+ 사진 추가</button>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {item.imageUrls.map((url, imgIdx) => (
                          <div key={imgIdx} className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden group border border-white/10">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => {
                                setLocalData(prev => {
                                  const list = [...prev.portfolioItems];
                                  list[idx].imageUrls = list[idx].imageUrls.filter((_, i) => i !== imgIdx);
                                  return { ...prev, portfolioItems: list };
                                });
                              }}
                              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black text-red-400 transition-opacity"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <input type="file" ref={portfolioInputRef} className="hidden" multiple onChange={(e) => processImageUpload(e, 'portfolio')} />
            </div>
          )}

          {activeTab === 'cert-images' && (
            <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">증명서 사본 관리</h3>
                <button onClick={() => certListInputRef.current?.click()} className="bg-teal-600 px-8 py-4 rounded-3xl font-black shadow-xl">+ 이미지 업로드</button>
                <input type="file" ref={certListInputRef} className="hidden" multiple onChange={(e) => processImageUpload(e, 'cert-list')} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {localData.certificationImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden group border border-white/5">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setLocalData(p => ({...p, certificationImages: p.certificationImages.filter((_, i) => i !== idx)}))}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-black transition-opacity"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
