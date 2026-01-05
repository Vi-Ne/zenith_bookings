
import React, { useEffect } from 'react';
import { User, Booking } from '../types';
import { ICONS } from '../constants';
import { apiService } from '../api-service';

interface ConfirmationViewProps {
  user: User;
  booking: Booking;
  onBack: () => void;
  onLogout: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({ user, booking, onBack, onLogout }) => {
  useEffect(() => {
    // Save booking to database in background
    const saveBookingAsync = async () => {
      try {
        const success = await apiService.saveBooking(booking, user.email);
        if (success) {
          console.log('✅ Booking saved successfully');
        } else {
          console.error('❌ Failed to save booking');
        }
      } catch (error) {
        console.error('❌ Error saving booking:', error);
      }
    };
    saveBookingAsync();
  }, [booking, user.email]);
  return (
    <div className="animate-scale-in max-w-6xl mx-auto pb-24">
      <div className="bg-white/90 backdrop-blur-3xl rounded-[5rem] overflow-hidden shadow-[0_100px_160px_-40px_rgba(0,0,0,0.15)] border border-white/60 relative">
        <div className="flex flex-col xl:flex-row">
          {/* AI Visual HUD */}
          <div className="w-full xl:w-7/12 h-[650px] xl:h-auto relative overflow-hidden bg-slate-950">
            {booking.aiImageUrl ? (
              <img 
                src={booking.aiImageUrl} 
                alt="System Visualization" 
                className="w-full h-full object-cover animate-fade-in transition-transform duration-[60s] ease-linear scale-100 hover:scale-125 opacity-70" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                 <div className="w-24 h-24 border-t-4 border-indigo-500 rounded-full animate-spin mb-8"></div>
                 <p className="mono text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Synthesizing Environment...</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/100 hidden xl:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent xl:hidden"></div>
            
            <div className="absolute top-12 left-12 z-20">
              <div className="px-8 py-3 bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-white/20 text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-4 shadow-2xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                Live Environment Optimized
              </div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 xl:right-auto z-20 xl:w-80">
               <div className="p-8 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/10">
                  <p className="mono text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Diagnostics</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-white/60 font-bold uppercase"><span>Latency</span><span>12ms</span></div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-4/5 bg-indigo-400"></div></div>
                    <div className="flex justify-between text-[10px] text-white/60 font-bold uppercase"><span>Encryption</span><span>256-bit</span></div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-full bg-green-400"></div></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="w-full xl:w-5/12 p-20 md:p-24 bg-white relative z-10 flex flex-col">
            <div className="mb-20">
              <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(79,70,229,0.5)] rotate-[8deg] border-4 border-white mb-16 group hover:rotate-0 transition-transform duration-700">
                <ICONS.CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="inline-block px-4 py-1.5 bg-green-50 rounded-lg text-[10px] font-black text-green-600 uppercase tracking-widest mb-6">
                Status: Authorization Confirmed
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">Protocol<br />Established.</h1>
              <p className="text-slate-400 font-bold text-xl leading-relaxed">
                Security clearance granted for <span className="text-indigo-600 font-black">{booking.expert?.name}</span>.
              </p>
            </div>

            <div className="space-y-16 mb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <span className="mono text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Auth Token</span>
                  <p className="text-2xl font-mono font-black text-indigo-600 tracking-tight drop-shadow-sm">{booking.bookingId}</p>
                </div>
                <div className="space-y-3">
                  <span className="mono text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Window ID</span>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{booking.slot}</p>
                </div>
              </div>
              
              <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex items-center gap-8 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={booking.expert?.avatar} className="w-20 h-20 rounded-[1.8rem] object-cover border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Expert" />
                <div>
                  <p className="mono text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Lead</p>
                  <p className="text-2xl font-black text-slate-900">{booking.expert?.name}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{booking.type}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-6">
              <button 
                onClick={onLogout} 
                className="w-full py-9 bg-slate-950 text-white font-black text-xs uppercase tracking-[0.6em] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:bg-indigo-600 transition-all transform hover:-translate-y-2 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Deploy Protocol</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </button>
              <button onClick={onBack} className="w-full py-5 text-slate-300 font-black text-[10px] uppercase tracking-[0.4em] hover:text-slate-900 transition-all">
                Recalibrate Parameters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationView;
