
import React, { useState } from 'react';
import { ProfileData, PortfolioItem } from '../types';

interface PortfolioProps {
  data: ProfileData;
}

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'content' | 'community' | 'project'>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = filter === 'all' 
    ? data.portfolioItems 
    : data.portfolioItems.filter(item => item.category === filter);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'academic', label: '학술/강연' },
    { id: 'content', label: '콘텐츠/저술' },
    { id: 'community', label: '커뮤니티' },
    { id: 'project', label: '프로젝트' },
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#042f2e] transition-colors duration-1000 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Activities & Impact</h2>
          <p className="text-teal-100/60">
            임상을 넘어 학술, 교육, 콘텐츠 제작 등 다양한 분야에서 활동하며 물리치료의 가치를 확장하고 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat.id 
                  ? 'bg-teal-500 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-teal-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group bg-slate-900/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 border border-white/5 flex flex-col h-full cursor-pointer hover:border-teal-500/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={item.imageUrls[0] || "https://picsum.photos/seed/placeholder/600/400"} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                {item.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                    +{item.imageUrls.length - 1} images
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <span className="text-teal-400 text-xs font-bold mb-2">{item.date}</span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {item.description}
                </p>
                <div className="text-teal-400 font-bold text-sm flex items-center gap-2 group/btn mt-auto">
                  상세보기 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
            <div className="relative w-full max-w-5xl bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">{selectedItem.title}</h2>
                <button onClick={() => setSelectedItem(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    {selectedItem.imageUrls.map((url, i) => (
                      <img key={i} src={url} className="w-full rounded-2xl shadow-sm border border-white/10" alt={`${selectedItem.title} ${i+1}`} />
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 text-xs font-bold rounded-full mb-4 uppercase tracking-widest border border-teal-500/30">
                        {selectedItem.category} | {selectedItem.date}
                      </span>
                      <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <p className="text-gray-500">등록된 활동이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
