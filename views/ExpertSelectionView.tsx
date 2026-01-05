
import React, { useMemo, useState, useEffect } from 'react';
import { Expert, AppointmentType } from '../types';
import { ICONS } from '../constants';
import { apiService } from '../api-service';

interface ExpertSelectionViewProps {
  onSelect: (expert: Expert) => void;
  serviceType: AppointmentType;
}

const SPECIALTY_VISUALS: Record<string, string> = {
  'Global Operations & M&A': "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  'Venture Scaling & Growth': "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  'Executive Leadership': "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
  'Internal Medicine & Genetics': "https://images.unsplash.com/photo-1532187863486-abf51ad9f69d?auto=format&fit=crop&q=80&w=800",
  'Preventative Health': "https://images.unsplash.com/photo-1505751172107-573225a91703?auto=format&fit=crop&q=80&w=800",
  'System Integrity & Security': "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  'High Availability Systems': "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
  'Aesthetic Direction': "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
  'User Experience & Behavior': "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
  'Corporate Compliance': "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
  'Intellectual Property': "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800"
};

const EXPERTS: Expert[] = [
  // Business Consultation
  { 
    id: 'c1', 
    name: 'Dr. Alistair Thorne', 
    title: 'Senior Strategic Director', 
    specialty: 'Global Operations & M&A', 
    rating: '5.0', 
    field: AppointmentType.CONSULTATION, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Former Fortune 500 consultant specializing in hyper-scale operations and cross-border acquisitions.',
    keyAreas: ['Strategic Scaling', 'Operational Efficiency', 'Market Entry']
  },
  { 
    id: 'c2', 
    name: 'Sarah Jenkins', 
    title: 'Market Analyst & Principal', 
    specialty: 'Venture Scaling & Growth', 
    rating: '4.9', 
    field: AppointmentType.CONSULTATION, 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Expert in identifying high-growth opportunities and designing resilient market strategies for startups.',
    keyAreas: ['Growth Hacking', 'Equity Structure', 'Venture Debt']
  },
  { 
    id: 'c3', 
    name: 'Robert Vance', 
    title: 'Managing Partner', 
    specialty: 'Executive Leadership', 
    rating: '5.0', 
    field: AppointmentType.CONSULTATION, 
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    bio: 'Executive coach focused on high-performance leadership culture and organizational transformation.',
    keyAreas: ['C-Suite Coaching', 'Culture Design', 'Change Management']
  },
  
  // Health Checkup
  { 
    id: 'm1', 
    name: 'Dr. Elena Vostrikov', 
    title: 'Chief Medical Officer', 
    specialty: 'Internal Medicine & Genetics', 
    rating: '5.0', 
    field: AppointmentType.MEDICAL, 
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=400&h=400&fit=crop',
    bio: 'Renowned researcher in precision medicine and long-term preventative health management.',
    keyAreas: ['Genomics', 'Metabolic Health', 'Preventative Care']
  },
  { 
    id: 'm2', 
    name: 'Dr. James Halloway', 
    title: 'Consultant Physician', 
    specialty: 'Preventative Health', 
    rating: '4.8', 
    field: AppointmentType.MEDICAL, 
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    bio: 'Pioneer in longevity science and personalized wellness programs for high-stress professionals.',
    keyAreas: ['Longevity', 'Stress Recovery', 'Performance Nutrition']
  },
  
  // Technical Support
  { 
    id: 't1', 
    name: 'Kevin Aris', 
    title: 'Cloud Infrastructure Lead', 
    specialty: 'System Integrity & Security', 
    rating: '4.9', 
    field: AppointmentType.TECH, 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'Architect of global cloud systems with a focus on zero-trust security and high-redundancy frameworks.',
    keyAreas: ['Zero Trust', 'Multi-Cloud', 'Security Audits']
  },
  { 
    id: 't2', 
    name: 'Linus Sterling', 
    title: 'DevOps Architect', 
    specialty: 'High Availability Systems', 
    rating: '5.0', 
    field: AppointmentType.TECH, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Specialist in automated delivery pipelines and large-scale Kubernetes orchestration.',
    keyAreas: ['Kubernetes', 'CI/CD', 'Observability']
  },
  
  // Design Review
  { 
    id: 'd1', 
    name: 'Julian Saint-Clair', 
    title: 'Creative Principal', 
    specialty: 'Aesthetic Direction', 
    rating: '5.0', 
    field: AppointmentType.DESIGN, 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Award-winning designer focused on visual storytelling and ultra-premium brand experiences.',
    keyAreas: ['Visual Identity', 'Brand Strategy', 'Typography']
  },
  { 
    id: 'd2', 
    name: 'Mina Sato', 
    title: 'UI/UX Lead', 
    specialty: 'User Experience & Behavior', 
    rating: '4.9', 
    field: AppointmentType.DESIGN, 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Psychology-driven design lead creating intuitive digital interfaces for complex enterprise systems.',
    keyAreas: ['Behavioral UX', 'Interaction Design', 'Product Testing']
  },
  
  // Legal Advice
  { 
    id: 'l1', 
    name: 'Marcus Chen', 
    title: 'Legal Counsel', 
    specialty: 'Corporate Compliance', 
    rating: '4.8', 
    field: AppointmentType.LEGAL, 
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    bio: 'Top-tier corporate attorney advising on regulatory navigation and governance structures.',
    keyAreas: ['Compliance', 'Risk Management', 'Governance']
  },
  { 
    id: 'l2', 
    name: 'Helena Troy', 
    title: 'Senior Attorney', 
    specialty: 'Intellectual Property', 
    rating: '5.0', 
    field: AppointmentType.LEGAL, 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    bio: 'IP specialist protecting digital assets and international patent portfolios.',
    keyAreas: ['Patent Law', 'Asset Protection', 'Trademark']
  }
];

const ExpertSelectionView: React.FC<ExpertSelectionViewProps> = ({ onSelect, serviceType }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperts = async () => {
      setLoading(true);
      const dbExperts = await apiService.getExperts(serviceType);
      
      // If no experts from database, use fallback experts
      if (dbExperts.length === 0) {
        const fallbackExperts = EXPERTS.filter(expert => expert.field === serviceType);
        setExperts(fallbackExperts);
      } else {
        setExperts(dbExperts);
      }
      
      setLoading(false);
    };
    loadExperts();
  }, [serviceType]);

  const filteredExperts = useMemo(() => {
    return experts.filter(expert => expert.field === serviceType);
  }, [experts, serviceType]);

  return (
    <div className="animate-fade-in pb-32">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-4 px-6 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8 shadow-sm">
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-600">{serviceType} Command</span>
        </div>
        <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]">Select<br />Specialist.</h2>
        <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">
          Synchronizing with elite practitioners in the <span className="text-indigo-600 font-black">{serviceType}</span> sector.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[5rem] border border-slate-100 shadow-inner flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-indigo-500 rounded-full animate-spin mb-8"></div>
            <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-sm">Loading Specialists...</p>
          </div>
        ) : filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <button
              key={expert.id}
              onClick={() => onSelect(expert)}
              className="group relative bg-white rounded-[4.5rem] overflow-hidden border border-slate-100 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] hover:shadow-[0_80px_160px_-24px_rgba(79,70,229,0.15)] transition-all duration-1000 text-left flex flex-col transform hover:-translate-y-6"
            >
              {/* Specialty Showcase Image */}
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={SPECIALTY_VISUALS[expert.specialty] || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"} 
                  className="w-full h-full object-cover transition-transform duration-[40s] group-hover:scale-125 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100" 
                  alt="Specialty Visual" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                
                {/* Profile Badge Overlay */}
                <div className="absolute bottom-0 left-12 flex items-end gap-8 translate-y-12">
                   <div className="relative">
                      <div className="absolute -inset-4 bg-indigo-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img 
                        src={expert.avatar} 
                        className="relative w-40 h-40 rounded-[3rem] object-cover border-8 border-white shadow-2xl transition-transform duration-700 group-hover:scale-105" 
                        alt={expert.name} 
                      />
                      <div className="absolute -bottom-2 -right-2 bg-slate-950 text-white text-[11px] font-black px-5 py-2 rounded-2xl border-4 border-white shadow-xl">
                        ★ {expert.rating}
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Content Container */}
              <div className="p-12 pt-24">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-xl">{expert.field}</span>
                      <span className="mono text-[10px] font-bold text-slate-300">UNIT_{expert.id.toUpperCase()}</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 leading-tight mb-2">{expert.name}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{expert.title}</p>
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-950 rounded-[1.8rem] flex items-center justify-center text-white shadow-xl transform group-hover:rotate-[360deg] transition-transform duration-1000">
                    <ICONS.ArrowRight className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3">Mission Bio</h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                      "{expert.bio}"
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Core Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.keyAreas.map((area, i) => (
                        <span key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                     <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Available for Sync</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase">Authorization Required</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-40 text-center bg-white rounded-[5rem] border-dashed border-4 border-slate-100 shadow-inner flex flex-col items-center justify-center">
            <ICONS.Calendar className="w-20 h-20 text-slate-100 mb-8" />
            <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-sm">System Idle: Division Assets Offline</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertSelectionView;
