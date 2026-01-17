
import React, { useState, useRef, useEffect } from 'react';
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
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const certListInputRef = useRef<HTMLInputElement>(null);
  const [activePortfolioIdx, setActivePortfolioIdx] = useState<number | null>(null);

  // 데이터 용량 계산 (MB 단위)
  useEffect(() => {
    const size = new Blob([JSON.stringify(localData)]).size;
    setTotalSize(Number((size / 1024 / 1024).toFixed(2)));
  }, [localData]);

  const generateUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 이미지 압축 및 리사이징 엔진
  const optimizeImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // JPEG로 압축하여 용량 대폭 절감
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleUpdateItemById = (section: string, id: string, field: string, value: string) => {
    setLocalData(prev => {
      const list = [...(prev[section as keyof ProfileData] as any[])];
      const targetIdx = list.findIndex(item => item.id === id);
      if (targetIdx !== -1) list[targetIdx] = { ...list[targetIdx], [field]: value };
      return { ...prev, [section]: list };
    });
  };

  const handleAddItem = (section: 'experience' | 'education' | 'certifications' | 'portfolioItems' | 'expertise') => {
    const newId = generateUniqueId(section);
    let newItem: any;
    if (section === 'experience') newItem = { id: newId, year: '2024-현재', title: '새로운 경력', description: '업무 내용을 입력하세요.' };
    else if (section === 'education') newItem = { id: newId, year: '2024', degree: '학위 명칭', institution: '교육 기관' };
    else if (section === 'certifications') newItem = { id: newId, date: '2024.01.01', title: '자격 명칭', organization: '발행 기관' };
    else if (section === 'portfolioItems') newItem = { id: newId, category: 'project', title: '새로운 활동 제목', description: '활동에 대한 상세 설명을 입력하세요.', imageUrls: [], date: '2024.01' };
    else if (section === 'expertise') newItem = { label: '새 지표', value: '0' };

    setLocalData(prev => ({ ...prev, [section]: [newItem, ...(prev[section] as any[])] }));
  };

  const handleRemoveById = (e: React.MouseEvent, section: keyof ProfileData, id: string) => {
    e.stopPropagation();
    if (!window.confirm('정말 이 항목을 삭제하시겠습니까?')) return;
    setLocalData(prev => {
      const list = prev[section];
      if (Array.isArray(list)) {
        return { ...prev, [section]: list.filter((item: any) => item.id !== id) };
      }
      return prev;
    });
  };

  const handleRemoveExpertise = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!window.confirm('정말 이 항목을 삭제하시겠습니까?')) return;
    setLocalData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateExpertise = (index: number, field: 'label' | 'value', value: string) => {
    setLocalData(prev => {
      const newList = [...prev.expertise];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, expertise: newList };
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

    const optimizedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const rawBase64 = await readFile(file);
        return await optimizeImage(rawBase64);
      })
    );

    if (type === 'profile') {
      setLocalData(prev => ({ ...prev, profileImageUrl: optimizedImages[0] }));
    } else if (type === 'cert-list') {
      setLocalData(prev => ({ ...prev, certificationImages: [...prev.certificationImages, ...optimizedImages] }));
    } else if (type === 'portfolio' && activePortfolioIdx !== null) {
      setLocalData(prev => {
        const items = [...prev.portfolioItems];
        items[activePortfolioIdx].imageUrls = [...items[activePortfolioIdx].imageUrls, ...optimizedImages];
        return { ...prev, portfolioItems: items };
      });
    }
    // 인풋 초기화
    e.target.value = '';
  };

  const handleSaveToSite = () => {
    onUpdate(localData);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const copyCodeToClipboard = () => {
    if (totalSize > 15) {
      alert(`현재 데이터 용량이 ${totalSize}MB로 너무 큽니다. 사진 개수를 줄이거나 더 작은 사진을 사용해주세요. (15MB 이하 권장)`);
      return;
    }
    const fullCode = `import { ProfileData } from './types';\n\nexport const INITIAL_DATA: ProfileData = ${JSON.stringify(localData, null, 2)};`;
    navigator.clipboard.writeText(fullCode).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    }).catch(err => {
      console.error("복사 실패:", err);
      alert("데이터가 너무 커서 복사에 실패했습니다. 사진을 몇 장 지우고 다시 시도해주세요.");
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-teal-400 tracking-tighter uppercase">Portfolio CMS</h2>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalSize > 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Data Size: {totalSize} MB
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-sm">
          {[
            { id: 'general', label: '기본 브랜딩 (지표 수정)' },
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
            onClick={handleSaveToSite}
            className={`w-full py-4 ${saveFeedback ? 'bg-green-600' : 'bg-white text-slate-950'} font-black rounded-2xl transition-all shadow-xl active:scale-95 flex flex-col items-center justify-center`}
          >
            <span className="text-sm">{saveFeedback ? '저장 완료!' : '사이트에 즉시 저장'}</span>
            {!saveFeedback && <span className="text-[10px] opacity-70">현재 브라우저 전용</span>}
          </button>
          
          <button 
            onClick={copyCodeToClipboard} 
            className={`w-full py-4 ${copyFeedback ? 'bg-green-600' : 'bg-teal-500'} text-white font-black rounded-2xl hover:bg-teal-400 transition-all shadow-xl flex flex-col items-center justify-center`}
          >
            <span className="text-sm">{copyFeedback ? '복사 완료!' : 'GitHub용 코드 복사'}</span>
            {!copyFeedback && <span className="text-[10px] opacity-70">영구 저장용</span>}
          </button>
          <button onClick={onClose} className="w-full py-2 text-slate-500 text-xs font-bold hover:text-white transition-colors">돌아가기</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-slate-900">
        <div className="max-w-4xl mx-auto space-y-10 pb-20 text-white">
          
          {activeTab === 'general' && (
            <div className="space-y-10">
              <section className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                <h3 className="text-xl font-black mb-4">프로필 기본 설정</h3>
                <div className="flex gap-8 items-start">
                  <div className="w-32 h-40 bg-slate-800 rounded-2xl overflow-hidden relative group shrink-0 border border-white/10">
                    <img src={localData.profileImageUrl} className="w-full h-full object-cover" />
                    <button onClick={() => profileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold transition-opacity">변경 (자동압축)</button>
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => processImageUpload(e, 'profile')} />
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

              <section className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">프로필 핵심 지표 (Box 내용)</h3>
                  <button onClick={() => handleAddItem('expertise')} className="bg-teal-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-500 transition-colors">+ 추가</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localData.expertise.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-6 rounded-2xl border border-white/5 space-y-3 relative group">
                      <button 
                        onClick={(e) => handleRemoveExpertise(e, idx)} 
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ×
                      </button>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">라벨 (예: 임상 경력)</label>
                        <input 
                          value={item.label} 
                          onChange={(e) => handleUpdateExpertise(idx, 'label', e.target.value)} 
                          className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">수치 (줄바꿈 가능)</label>
                        <textarea 
                          value={item.value} 
                          onChange={(e) => handleUpdateExpertise(idx, 'value', e.target.value)} 
                          className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-teal-400 font-black leading-tight"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'credentials' && (
             <div className="space-y-12">
              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">경력 사항</h3>
                  <button onClick={() => handleAddItem('experience')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {localData.experience.map((item) => (
                    <div key={item.id} className="relative p-6 bg-slate-900 rounded-2xl border border-white/5 group">
                      <button onClick={(e) => handleRemoveById(e, 'experience', item.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black z-10">×</button>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <input value={item.year} onChange={(e) => handleUpdateItemById('experience', item.id, 'year', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 text-teal-400 font-bold" placeholder="기간 (예: 2024-현재)" />
                        <input value={item.title} onChange={(e) => handleUpdateItemById('experience', item.id, 'title', e.target.value)} className="col-span-3 bg-slate-950 p-3 rounded-xl border border-white/10 font-bold" placeholder="직함 / 소속" />
                      </div>
                      <textarea value={item.description} onChange={(e) => handleUpdateItemById('experience', item.id, 'description', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-slate-400 text-sm" rows={2} placeholder="상세 내용" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">학업 사항</h3>
                  <button onClick={() => handleAddItem('education')} className="bg-teal-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-teal-500">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {localData.education.map((item) => (
                    <div key={item.id} className="relative p-6 bg-slate-900 rounded-2xl border border-white/5 group">
                      <button onClick={(e) => handleRemoveById(e, 'education', item.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black z-10">×</button>
                      <div className="grid grid-cols-4 gap-4">
                        <input value={item.year} onChange={(e) => handleUpdateItemById('education', item.id, 'year', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 text-teal-400 font-bold" placeholder="연도 (예: 2024)" />
                        <div className="col-span-3 space-y-2">
                          <input value={item.degree} onChange={(e) => handleUpdateItemById('education', item.id, 'degree', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 font-bold" placeholder="학위 명칭" />
                          <input value={item.institution} onChange={(e) => handleUpdateItemById('education', item.id, 'institution', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-sm text-slate-400" placeholder="교육 기관" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">면허 및 자격</h3>
                  <button onClick={() => handleAddItem('certifications')} className="bg-orange-600 px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-orange-500">+ 추가</button>
                </div>
                <div className="space-y-4">
                  {localData.certifications.map((item) => (
                    <div key={item.id} className="relative p-6 bg-slate-900 rounded-2xl border border-white/5 group">
                      <button onClick={(e) => handleRemoveById(e, 'certifications', item.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black z-10">×</button>
                      <div className="grid grid-cols-4 gap-4">
                        <input value={item.date} onChange={(e) => handleUpdateItemById('certifications', item.id, 'date', e.target.value)} className="bg-slate-950 p-3 rounded-xl border border-white/10 text-orange-400 font-bold" placeholder="날짜 (예: 2024.01.01)" />
                        <div className="col-span-3 space-y-2">
                          <input value={item.title} onChange={(e) => handleUpdateItemById('certifications', item.id, 'title', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 font-bold" placeholder="자격 명칭" />
                          <input value={item.organization} onChange={(e) => handleUpdateItemById('certifications', item.id, 'organization', e.target.value)} className="w-full bg-slate-950 p-3 rounded-xl border border-white/10 text-sm text-slate-400" placeholder="발행 기관" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-10">
              <button onClick={() => handleAddItem('portfolioItems')} className="w-full py-8 bg-teal-600 text-white font-black rounded-3xl shadow-2xl hover:bg-teal-500 transition-all">+ 새로운 활동 프로젝트 추가</button>
              {localData.portfolioItems.map((item, idx) => (
                <div key={item.id} className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative space-y-6">
                  <button 
                    onClick={(e) => handleRemoveById(e, 'portfolioItems', item.id)} 
                    className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-2xl hover:scale-110 transition-transform z-20 cursor-pointer"
                  >
                    ×
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">활동 제목</label>
                      <input value={item.title} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'title', e.target.value)} className="w-full text-lg font-bold bg-slate-900 p-4 rounded-2xl border border-white/10 focus:border-teal-500 outline-none" placeholder="활동 제목을 입력하세요" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">연도 / 날짜</label>
                      <input value={item.date} onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'date', e.target.value)} className="w-full text-lg font-bold bg-slate-900 p-4 rounded-2xl border border-white/10 focus:border-teal-500 outline-none text-teal-400" placeholder="2024.01" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">카테고리</label>
                    <select 
                      value={item.category} 
                      onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'category', e.target.value)} 
                      className="w-full bg-slate-900 p-4 rounded-2xl border border-white/10 focus:border-teal-500 outline-none font-bold"
                    >
                      <option value="academic">학술 / 강연 (Academic)</option>
                      <option value="content">콘텐츠 / 저술 (Content)</option>
                      <option value="community">커뮤니티 (Community)</option>
                      <option value="project">프로젝트 (Project)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">상세 설명</label>
                    <textarea 
                      value={item.description} 
                      onChange={(e) => handleUpdateItemById('portfolioItems', item.id, 'description', e.target.value)} 
                      className="w-full bg-slate-900 p-4 rounded-2xl border border-white/10 focus:border-teal-500 outline-none text-slate-300 leading-relaxed" 
                      rows={4} 
                      placeholder="활동에 대한 상세한 내용을 입력하세요..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">활동 사진 관리 ({item.imageUrls.length})</label>
                      <button onClick={() => { setActivePortfolioIdx(idx); portfolioInputRef.current?.click(); }} className="bg-white/5 px-4 py-2 rounded-xl text-teal-400 font-black text-xs hover:bg-white/10 transition-colors border border-white/5">+ 사진 추가 (자동 최적화)</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-900 scrollbar-track-transparent">
                      {item.imageUrls.map((url, i) => (
                        <div key={i} className="w-24 h-24 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-white/10 relative group/img shadow-lg">
                          <img src={url} className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newItems = [...localData.portfolioItems];
                              newItems[idx].imageUrls = newItems[idx].imageUrls.filter((_, imgIdx) => imgIdx !== i);
                              setLocalData({...localData, portfolioItems: newItems});
                            }}
                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-xs font-black transition-opacity"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                      {item.imageUrls.length === 0 && (
                        <div className="w-full py-10 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                          등록된 사진이 없습니다
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <input type="file" ref={portfolioInputRef} className="hidden" accept="image/*" multiple onChange={(e) => processImageUpload(e, 'portfolio')} />
            </div>
          )}

          {activeTab === 'cert-images' && (
            <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">증명서 사본 관리</h3>
                <button onClick={() => certListInputRef.current?.click()} className="bg-teal-600 px-8 py-4 rounded-3xl font-black">+ 이미지 업로드 (자동최적화)</button>
                <input type="file" ref={certListInputRef} className="hidden" accept="image/*" multiple onChange={(e) => processImageUpload(e, 'cert-list')} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {localData.certificationImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-white/5 group shadow-xl">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocalData(p => ({...p, certificationImages: p.certificationImages.filter((_, i) => i !== idx)}));
                      }} 
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-black transition-opacity"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <section className="bg-slate-950 p-10 rounded-[3rem] border-2 border-teal-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-teal-400 mb-6 tracking-tighter">데이터 용량 관련 안내</h3>
              <div className="space-y-6 text-slate-300">
                <p>이미지 압축 엔진이 자동으로 작동하여 고화질 사진을 최적화하지만, 그럼에도 수십 장의 사진을 올리면 <b>GitHub 복사 시 오류</b>가 날 수 있습니다.</p>
                <p>현재 데이터 크기가 <b>10MB 이상</b>이라면 불필요한 사진을 삭제하시는 것을 권장합니다.</p>
                <hr className="border-white/5" />
                <h4 className="text-xl font-bold">영구 저장 방법</h4>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">1</div>
                  <p>수정을 마친 뒤 왼쪽 하단의 <b>[GitHub용 코드 복사]</b> 버튼을 누릅니다.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">2</div>
                  <p>본인의 <b>GitHub 사이트</b>로 가서 <b>constants.ts</b> 파일을 엽니다.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-black shrink-0">3</div>
                  <p>기존 내용을 <b>전부 지운 뒤 복사한 코드를 붙여넣기</b> 하고 <b>Commit changes...</b>를 누르세요.</p>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
