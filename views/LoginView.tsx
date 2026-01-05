
import React, { useState, useEffect } from 'react';
import { User, AppointmentType } from '../types';
import { ICONS } from '../constants';
import { apiService } from '../api-service';

interface LoginViewProps {
  onLogin: (user: User, type: AppointmentType) => void;
}

const DIVISION_IMAGES: Record<AppointmentType, string> = {
  [AppointmentType.CONSULTATION]: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  [AppointmentType.MEDICAL]: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
  [AppointmentType.TECH]: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  [AppointmentType.DESIGN]: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200",
  [AppointmentType.LEGAL]: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"
};

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<AppointmentType>(AppointmentType.CONSULTATION);
  const [heroImage, setHeroImage] = useState(DIVISION_IMAGES[AppointmentType.CONSULTATION]);

  useEffect(() => {
    setHeroImage(DIVISION_IMAGES[type]);
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      // Save to database in background
      apiService.saveUser(name, email);
      // Continue with login immediately
      onLogin({ name, email }, type);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden bg-white/40 backdrop-blur-3xl rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.12)] border border-white/60 animate-fade-in-up">
      {/* Left Column: Cinematic Visual HUD */}
      <div className="hidden lg:block lg:w-5/12 relative group overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <img 
            key={heroImage}
            src={heroImage} 
            alt="Division Hero" 
            className="absolute inset-0 w-full h-full object-cover animate-fade-in scale-110 hover:scale-125 transition-transform duration-[30s] ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-slate-900/60 to-indigo-600/20"></div>
        
        {/* Tactical Overlays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="w-full h-1 bg-indigo-400 absolute animate-[scan_4s_linear_infinite]"></div>
           <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
              {Array.from({length: 36}).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/5"></div>
              ))}
           </div>
        </div>

        <div className="absolute inset-0 p-20 flex flex-col justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
              <ICONS.Calendar className="text-white w-8 h-8" />
            </div>
            <div className="text-white">
              <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-60">Zenith Protocol</p>
              <p className="mono text-xs font-bold text-indigo-400">INIT_PHASE_01</p>
            </div>
          </div>

          <div className="text-white">
            <div className="mb-8 flex gap-3">
              {[1,2,3].map(i => <div key={i} className="w-10 h-1.5 bg-indigo-500 rounded-full"></div>)}
            </div>
            <h2 className="text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
              The Next<br /><span className="text-indigo-400">Frontier.</span>
            </h2>
            <p className="text-indigo-100/60 text-xl leading-relaxed max-w-sm font-medium">
              Access the world's most sophisticated booking infrastructure. Secure your objective.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Authorization Form */}
      <div className="w-full lg:w-7/12 p-12 md:p-20 lg:p-32 bg-white/40">
        <div className="max-w-md mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 shadow-xl">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              Secure Entry Point
            </div>
            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Identity.</h1>
            <p className="text-slate-500 font-medium text-xl">Establish communication with the network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Operator Profile</label>
              <div className="group relative">
                <div className="absolute inset-0 bg-indigo-600/5 rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <ICONS.User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Full Legal Name"
                  className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[2rem] py-8 pl-20 pr-10 focus:outline-none focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 text-lg shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Secure Email</label>
              <input
                required
                type="email"
                placeholder="protocol@zenith.network"
                className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[2rem] py-8 px-10 focus:outline-none focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 text-lg shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Service Division</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-[2rem] py-8 px-10 focus:outline-none focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-black appearance-none cursor-pointer text-lg"
                  value={type}
                  onChange={(e) => setType(e.target.value as AppointmentType)}
                >
                  {Object.values(AppointmentType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <ICONS.ChevronRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.6em] py-9 px-12 rounded-[3rem] flex items-center justify-center gap-6 transition-all transform hover:-translate-y-2 active:scale-95 shadow-[0_48px_80px_-24px_rgba(79,70,229,0.4)] group mt-10"
            >
              <span>Initialize Authorization</span>
              <ICONS.ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginView;
