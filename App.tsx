
import React, { useState, useEffect } from 'react';
import { Step, AppState, User, AppointmentType, Booking, ReminderType, Expert } from './types';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ConfirmationView from './views/ConfirmationView';
import ExpertSelectionView from './views/ExpertSelectionView';
import AnalyticsView from './views/AnalyticsView';
import AdminPanel from './views/AdminPanel';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'zenith_bookings_history';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: Step.LOGIN,
    user: null,
    booking: null,
  });
  const [history, setHistory] = useState<Booking[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);

  // Admin panel keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load history when user changes
  useEffect(() => {
    if (state.user) {
      const storedHistory = localStorage.getItem(`${STORAGE_KEY}_${state.user.email}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory([]);
      }
    }
  }, [state.user]);

  const saveToHistory = (newBooking: Booking) => {
    if (state.user) {
      const updatedHistory = [newBooking, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`${STORAGE_KEY}_${state.user.email}`, JSON.stringify(updatedHistory));
    }
  };

  const handleLogin = (user: User, type: AppointmentType) => {
    setState({
      ...state,
      user,
      step: Step.EXPERT_SELECTION,
      booking: {
        type,
        date: '',
        slot: '',
        bookingId: '',
        notes: '',
        reminderType: ReminderType.EMAIL,
      },
    });
  };

  const handleExpertSelect = (expert: Expert) => {
    if (state.booking) {
      setState({
        ...state,
        booking: { ...state.booking, expert },
        step: Step.DASHBOARD,
      });
    }
  };

  const generateAIVisual = async (booking: Booking): Promise<string | undefined> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Hyper-realistic conceptual 3D render of a professional ${booking.type} workspace. High-end materials, cinematic lighting, 8k resolution. Context: Session with ${booking.expert?.name}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (error) {
      console.error("Background sync failed:", error);
    }
    return undefined;
  };

  const handleBooking = (date: string, slot: string, notes: string, reminderType: ReminderType) => {
    const bookingId = 'ZN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    if (state.booking) {
      const tempBooking = { ...state.booking, date, slot, bookingId, notes, reminderType };
      
      // Save to local storage history
      saveToHistory(tempBooking);

      // Navigate to confirmation page instantly
      setState({
        ...state,
        booking: tempBooking,
        step: Step.CONFIRMATION,
      });

      // Trigger AI image generation in the background
      generateAIVisual(tempBooking).then(aiUrl => {
        if (aiUrl) {
          setState(prev => ({
            ...prev,
            booking: prev.booking ? { ...prev.booking, aiImageUrl: aiUrl } : null
          }));
        }
      });
    }
  };

  const handleLogout = () => {
    setState({ step: Step.LOGIN, user: null, booking: null });
    setHistory([]);
  };

  const toggleAnalytics = () => {
    setState({ ...state, step: state.step === Step.ANALYTICS ? Step.DASHBOARD : Step.ANALYTICS });
  };

  const steps = [Step.LOGIN, Step.EXPERT_SELECTION, Step.DASHBOARD, Step.CONFIRMATION];

  return (
    <div className="min-h-screen py-8 px-4 md:py-16 selection:bg-indigo-100 selection:text-indigo-900 relative transition-colors duration-1000">
      <div className="fixed inset-0 -z-20 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-indigo-200/20 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-slate-200/30 rounded-full blur-[180px]"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {state.step !== Step.LOGIN && (
          <div className="mb-20 flex justify-center items-center gap-4">
            {steps.map((s, idx) => {
              const currentIdx = steps.indexOf(state.step === Step.ANALYTICS ? Step.DASHBOARD : state.step);
              const isActive = steps[currentIdx] === s;
              const isCompleted = currentIdx > idx;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                      isActive ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-110' : (isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-100 text-slate-300')
                    }`}>
                      {isCompleted ? '✓' : `0${idx + 1}`}
                    </div>
                  </div>
                  {idx < steps.length - 1 && <div className={`w-12 h-px ${isCompleted ? 'bg-slate-900' : 'bg-slate-200'}`}></div>}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <main className="transition-all duration-300">
          {state.step === Step.LOGIN && <LoginView onLogin={handleLogin} />}
          {state.step === Step.EXPERT_SELECTION && state.booking && <ExpertSelectionView onSelect={handleExpertSelect} serviceType={state.booking.type} />}
          {state.step === Step.DASHBOARD && state.user && state.booking && (
            <DashboardView 
              user={state.user} 
              booking={state.booking} 
              onConfirm={handleBooking} 
              onLogout={handleLogout} 
              onToggleAnalytics={toggleAnalytics}
              history={history}
            />
          )}
          {state.step === Step.ANALYTICS && state.user && <AnalyticsView onBack={toggleAnalytics} />}
          {state.step === Step.CONFIRMATION && state.booking && state.user && (
            <ConfirmationView user={state.user} booking={state.booking} onBack={() => setState({...state, step: Step.DASHBOARD})} onLogout={handleLogout} />
          )}
        </main>
        
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </div>
    </div>
  );
};

export default App;
