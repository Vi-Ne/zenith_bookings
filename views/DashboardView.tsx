
import React, { useState, useEffect } from 'react';
import { User, Booking, ReminderType, AppointmentType } from '../types';
import { ICONS, TIME_SLOTS } from '../constants';

interface DashboardViewProps {
  user: User;
  booking: Booking;
  onConfirm: (date: string, slot: string, notes: string, reminderType: ReminderType) => void;
  onLogout: () => void;
  onToggleAnalytics: () => void;
  history: Booking[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, booking, onConfirm, onLogout, onToggleAnalytics, history }) => {
  const [selectedDate, setSelectedDate] = useState(booking.date || '');
  const [selectedSlot, setSelectedSlot] = useState(booking.slot || '');
  const [notes, setNotes] = useState(booking.notes || '');
  const [reminder, setReminder] = useState<ReminderType>(booking.reminderType || ReminderType.EMAIL);
  const [tickerTime, setTickerTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setTickerTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nextDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const handleReschedule = () => {
    setSelectedDate('');
    setSelectedSlot('');
  };

  const isPast = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  };

  return (
    <div className="animate-fade-in relative pb-20">
      {/* Header HUD */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
        <div className="flex items-start gap-12">
          <div className="relative group">
            <div className="absolute -inset-2 bg-indigo-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={booking.expert?.avatar} 
              alt="Expert" 
              className="relative w-32 h-32 rounded-[3rem] object-cover border-8 border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute -bottom-2 -right-2 bg-slate-950 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl">
              <span className="mono text-[10px] font-black text-indigo-400">XP</span>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Live Infrastructure Monitoring</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-[0.8] mb-6">
              Welcome,<br />
              <span className="text-indigo-600">{user.name.split(' ')[0]}.</span>
            </h1>
            <p className="mono text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full inline-block">
              Assigned Specialist: {booking.expert?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/60 p-3 rounded-[2.5rem] border border-white/80 shadow-sm">
          <button onClick={onToggleAnalytics} className="px-10 py-5 bg-slate-950 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all transform hover:-translate-y-1">Control Suite</button>
          <button onClick={onLogout} className="w-16 h-16 flex items-center justify-center bg-white border border-slate-100 rounded-[1.8rem] text-slate-400 hover:text-red-500 hover:border-red-100 transition-all">
            <ICONS.LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {/* Scheduling Console */}
          <section className="bg-white/70 backdrop-blur-2xl rounded-[4rem] p-16 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] border border-white/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <ICONS.Calendar className="w-64 h-64 text-slate-900" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-16 flex items-center gap-4">
              Temporal Alignment
              <div className="h-px flex-1 bg-slate-100 ml-4"></div>
            </h2>

            <div className="space-y-24">
              <div>
                <div className="flex justify-between items-center mb-10">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">Coordinate Selection</label>
                  <span className="mono text-[9px] font-bold text-slate-300">UTC+00:00 Synchronized</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
                  {nextDates.map((date) => {
                    const d = new Date(date);
                    const isSelected = selectedDate === date;
                    return (
                      <button 
                        key={date} 
                        onClick={() => setSelectedDate(date)} 
                        className={`group p-10 rounded-[3rem] border-2 transition-all duration-700 relative ${
                          isSelected ? 'bg-slate-950 border-slate-950 text-white shadow-2xl -translate-y-8' : 'bg-white/50 border-slate-50 text-slate-400 hover:border-indigo-100 hover:text-indigo-600'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase mb-4 block opacity-40">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-6xl font-black tracking-tighter">{d.getDate()}</span>
                        {isSelected && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`transition-all duration-1000 ${!selectedDate ? 'opacity-10 grayscale pointer-events-none' : ''}`}>
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-10 block">Slot Authorization</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {TIME_SLOTS.map((slot) => (
                    <button 
                      key={slot} 
                      onClick={() => setSelectedSlot(slot)} 
                      className={`py-8 rounded-[1.8rem] font-black text-xs transition-all border-2 ${
                        selectedSlot === slot ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* History Log */}
          <section className="bg-white/50 backdrop-blur-xl rounded-[4rem] p-16 border border-white/80 shadow-sm relative">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Event Logs</h2>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {history.slice(0, 3).map((h, i) => (
                     <img key={i} src={h.expert?.avatar} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                   ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{history.length} Sessions Confirmed</span>
              </div>
            </div>
            
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((h) => (
                  <div key={h.bookingId} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2.5rem] bg-white border border-slate-50 group hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] transition-all transform hover:-translate-x-2">
                    <div className="flex items-center gap-8 mb-4 md:mb-0">
                      <div className="relative">
                        <img src={h.expert?.avatar} className="w-16 h-16 rounded-2xl object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Expert" />
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isPast(h.date) ? 'bg-slate-300' : 'bg-indigo-500 animate-pulse'}`}></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-slate-900 text-base">{h.type}</h4>
                          <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isPast(h.date) ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            {isPast(h.date) ? 'ARCHIVED' : 'ACTIVE'}
                          </span>
                        </div>
                        <p className="mono text-[9px] font-bold text-slate-300 uppercase tracking-widest">Protocol Lead: {h.expert?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="mono text-[9px] font-black text-slate-200 uppercase tracking-widest mb-1">Timestamp</p>
                        <p className="text-sm font-black text-slate-700">{h.date} | {h.slot}</p>
                      </div>
                      <div className="text-right">
                        <p className="mono text-[9px] font-black text-slate-200 uppercase tracking-widest mb-1">Authorization ID</p>
                        <p className="text-sm font-mono font-bold text-indigo-500">{h.bookingId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
                <p className="mono text-[10px] font-black uppercase tracking-[0.5em] text-slate-200">System Cache Empty: No historical data</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar HUD */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="bg-white rounded-[4.5rem] shadow-[0_80px_120px_-40px_rgba(0,0,0,0.12)] overflow-hidden group border border-slate-50 sticky top-12">
            <div className="h-72 relative bg-slate-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&fit=crop" 
                alt="Office" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-125 transition-transform duration-[40s] ease-linear" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <div className="absolute top-10 left-10 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <div className="p-16 -mt-24 relative z-10">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.6em] mb-4 block">Final Authorization</span>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-12">{booking.type}</h3>
              
              <div className="space-y-8 mb-16">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <span className="mono text-[9px] font-black text-slate-300 uppercase">Specialist Unit</span>
                  <span className="text-sm font-black text-slate-900">{booking.expert?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <span className="mono text-[9px] font-black text-slate-300 uppercase">Target Window</span>
                  <span className="text-sm font-black text-slate-900">{selectedDate || 'AWAITING INPUT'}</span>
                </div>
              </div>

              <div className="space-y-6">
                <button 
                  disabled={!selectedDate || !selectedSlot} 
                  onClick={() => onConfirm(selectedDate, selectedSlot, notes, reminder)} 
                  className={`w-full py-8 rounded-[2.8rem] font-black text-xs uppercase tracking-[0.5em] transition-all relative overflow-hidden group/btn ${
                    selectedDate && selectedSlot ? 'bg-slate-950 text-white shadow-[0_32px_64px_-16px_rgba(79,70,229,0.4)] hover:bg-indigo-600 hover:-translate-y-2' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className="relative z-10">Authorize Session</span>
                  {selectedDate && selectedSlot && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>}
                </button>
                <button 
                  onClick={handleReschedule}
                  className="w-full py-5 rounded-[2.2rem] border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-3"
                >
                  <ICONS.Edit className="w-5 h-5" />
                  Calibrate Parameters
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-950 rounded-[3rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="mono text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6">System Clock (Local)</p>
            <p className="text-4xl font-mono font-bold text-white tracking-widest">{tickerTime}</p>
            <div className="mt-8 flex gap-1">
               {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < 6 ? 'bg-indigo-500' : 'bg-white/10'}`}></div>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardView;
