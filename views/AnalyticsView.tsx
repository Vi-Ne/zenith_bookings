
import React from 'react';

interface AnalyticsViewProps {
  onBack: () => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Intelligence Suite</h2>
          <p className="text-slate-500 font-medium">Real-time session diagnostics and professional growth telemetry.</p>
        </div>
        <button onClick={onBack} className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl">Return to Control</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3.5rem] p-12 shadow-xl border border-slate-50">
            <div className="flex justify-between items-end mb-12">
              <h3 className="text-2xl font-black">Session Intensity</h3>
              <span className="text-[10px] font-black text-green-500">↑ 12.4% vs Last Period</span>
            </div>
            <div className="h-64 flex items-end gap-3">
              {[40, 70, 45, 90, 65, 85, 100, 75, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-t-xl relative group">
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-slate-900" 
                    style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[8px] font-black text-slate-300 uppercase tracking-widest">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Asset Allocation</h4>
              <div className="space-y-6">
                {[
                  { l: 'Advisory', v: '78%' },
                  { l: 'Technical', v: '92%' },
                  { l: 'Strategic', v: '64%' }
                ].map(item => (
                  <div key={item.l}>
                    <div className="flex justify-between text-[10px] font-black mb-2">
                      <span>{item.l}</span>
                      <span>{item.v}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: item.v }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Readiness Score</h4>
               <div className="text-7xl font-black text-slate-900 tracking-tighter mb-2">A+</div>
               <p className="text-xs font-bold text-slate-500 leading-relaxed">System parameters are optimal for your next tier-1 consultation.</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-70">Live Ecosystem Feed</h4>
            <div className="space-y-8">
              {[
                'New slot authorized in London (UK)',
                'Expert Selection: Elena Vostrikov',
                'Infrastructure health check complete',
                'Global session volume spike detected'
              ].map((msg, i) => (
                <div key={i} className="flex gap-4 items-start border-l border-white/20 pl-4">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 animate-pulse"></div>
                  <p className="text-xs font-bold opacity-90">{msg}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 relative z-10">Security Tier</h4>
            <p className="text-4xl font-black text-slate-900 relative z-10">Tier 5</p>
            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-2 relative z-10">Max Authorization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
