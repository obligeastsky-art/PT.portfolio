
import React, { useState, useRef } from 'react';
import { ProfileData, PortfolioItem, ExperienceItem, EducationItem, CertificationItem } from '../types';

interface AdminPanelProps {
  data: ProfileData;
  onUpdate: (data: ProfileData) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, onClose }) => {
  const [localData, setLocalData] = useState<ProfileData>(() => JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'general' | 'credentials' | 'portfolio' | 'cert-images' | 'guide'>('general');
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const certListInputRef = useRef<HTMLInputElement>(null);
  const [activePortfolioIdx, setActivePortfolioIdx] = useState<number | null>(null);

  const generateUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleUpdateItemById = (section: string, id: string, field: string, value: string) => {
    setLocalData(prev => {
      const list = [...(prev[section as keyof ProfileData] as any[])];
      const targetIdx = list.findIndex(item => item.id === id);
      if (targetIdx !== -1) list[targetIdx] = { ...list[targetIdx], [field]: value };
      return { ...prev, [section]: list };
    });
  };

  const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'portfolioItems') => {
    const newId = generateUniqueId(section);
    let newItem: any;
    if (section === 'experience') newItem = { id: newId, year: '2024-현재', title: '새로운 경력', description: '업무 내용을 입력하세요.' };
    else if (section === 'education') newItem = { id: newId, year: '2024', degree: '학위 명칭', institution: '교육 기관' };
    else if (section === 'certifications') newItem = { id: newId, date: '2024.01', title: '자격 명칭', organization: '발행 기관' };
    else if (section === 'portfolioItems') newItem = { id: newId, category: 'academic', title: '활동 제목', description: '활동 상세 설명', imageUrls: [], date: '2024' };

    setLocalData(prev => ({ ...prev, [section]: [newItem, ...(prev[section] as any[])] }));
  };

  const handleRemoveById = (section: keyof ProfileData, id: string) => {
    if (!window.confirm('정말 이 항목을 삭제하시겠습니까?')) return;
    setLocalData(prev => {
      const currentList = prev[section];
      if (Array.isArray(currentList)) {
        return { ...prev, [section]: currentList.filter((item: any) => item.id !== id) };
      }
      return prev;
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
        items[activePortfolioIdx].imageUrls = [...items[activePortfolioIdx].imageUrls, ...newImages];
        return { ...prev, portfolioItems: items };
      });
    }
  };

  const copyCodeToClipboard = () => {
    const fullCode = `import { ProfileData } from './types';\n\nexport const INITIAL_DATA: ProfileData = ${JSON.stringify(localData, null, 2)};`;
    navigator.clipboard.writeText(fullCode).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-teal-400 tracking-tighter uppercase">Portfolio CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'general', label: '기본 브랜딩' },
            { id: 'credentials', label: '경력 / 학업 / 자격' },
            { id: 'portfolio', label: '프로젝트 활동' },
            { id: 'cert-images', label: '증명서 사본' },
            { id: 'guide', label: '영구 저장 가이드 💡' }
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
          <button 
            onClick={copyCodeToClipboard} 
            className={`w-full py-4 ${copyFeedback ? 'bg-green-600' : 'bg-teal-500'} text-white font-black rounded-2xl hover:bg-teal-400 transition-all shadow-xl flex flex-col items-center justify-center`}
          >
            <span className="text-sm">{copyFeedback ? '복사 완료!' : 'GitHub용 코드 복사'}</span>
            {!copyFeedback && <span className="text-[10px] opacity-70">웹에서 바로 수정 가능</span>}
          </button>
          <button onClick={onClose} className="w-full py-2 text-slate-500 text-xs font-bold hover:text-white transition-colors">돌아가기</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-slate-900">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {activeTab === 'guide' && (
            <section className="bg-slate-950 p-10 rounded-[3rem] border-2 border-teal-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-teal-400 mb-6 tracking-tighter">컴퓨터에 폴더가 없어도 괜찮습니다!</h3>
              <div className="space-y-6 text-slate-300">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">1</div>
                  <p>여기서 사진과 내용을 모두 수정하고 왼쪽 하단의 <b>[GitHub용 코드 복사]</b> 버튼을 누릅니다.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">2</div>
                  <p>본인의 <b>GitHub 사이트</b>로 가서 <b>constants.ts</b> 파일을 엽니다.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">3</div>
                  <p>연필 아이콘(Edit)을 누르고, 기존 내용을 <b>전부 지운 뒤 복사한 코드를 붙여넣기</b> 하세요.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">4</div>
                  <p><b>Commit changes...</b> 버튼을 누르면 Netlify가 알아서 사이트를 새로 만들어줍니다.</p>
                </div>
                
                <div className="mt-10 p-8 bg-white/5 rounded-[2rem] border border-white/10 italic text-sm leading-relaxed">
                  💡 <b>왜 이렇게 하나요?</b> <br/>
                  내용을 소스 코드(GitHub)에 직접 넣어야만 전 세계 누구나 접속했을 때 수정된 내용이 보이기 때문입니다. 지금 복사하는 코드는 사진 데이터까지 모두 포함하고 있어 아주 강력합니다.
                </div>
              </div>
            </section>
          )}

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

          {/* ... Other tabs (credentials, portfolio, cert-images) ... */}
          {activeTab === 'credentials' && (
             <div className="space-y-12">
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">경력 사항</h3>
                  <button onClick={() => handleAddItem('experience')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
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
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-10 pb-20">
              <button onClick={() => handleAddItem('portfolioItems')} className="w-full py-8 bg-teal-600 text-white font-black rounded-3xl shadow-2xl hover:bg-teal-500 transition-all">+ 새로운 활동 프로젝트 추가</button>
              {localData.portfolioItems.map((item, idx) => (
                <div key={item.id} className="bg-slate-950 p-10 rounded-[4rem] border border-white/5 shadow-2xl relative">
                  <button onClick={() => handleRemoveById('portfolioItems', item.id)} className="absolute -top-4 -right-4 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 transition-transform">×</button>
                  <input value={item.title} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'title', e.target.value)} className="w-full text-2xl font-bold bg-slate-900 p-4 rounded-2xl border border-white/10 mb-4" />
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-slate-500">사진 관리 ({item.imageUrls.length})</label>
                    <button onClick={() => { setActivePortfolioIdx(idx); portfolioInputRef.current?.click(); }} className="text-teal-400 font-bold text-xs">+ 추가</button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {item.imageUrls.map((url, i) => (
                      <div key={i} className="w-24 h-24 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <input type="file" ref={portfolioInputRef} className="hidden" multiple onChange={(e) => processImageUpload(e, 'portfolio')} />
            </div>
          )}

          {activeTab === 'cert-images' && (
            <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">증명서 사본 관리</h3>
                <button onClick={() => certListInputRef.current?.click()} className="bg-teal-600 px-8 py-4 rounded-3xl font-black">+ 이미지 업로드</button>
                <input type="file" ref={certListInputRef} className="hidden" multiple onChange={(e) => processImageUpload(e, 'cert-list')} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {localData.certificationImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-white/5">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => setLocalData(p => ({...p, certificationImages: p.certificationImages.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 hover:opacity-100 flex items-center justify-center font-black">제거</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
