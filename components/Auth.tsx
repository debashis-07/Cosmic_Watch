
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { username: string }) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) return alert("Username too short");
    onLogin({ username });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-md p-8 glass-panel rounded-2xl border border-cyan-500/20 shadow-2xl relative z-10">
        <button onClick={onBack} className="absolute top-6 left-6 text-slate-500 hover:text-cyan-400 transition-colors">
          &larr; BACK
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2 uppercase tracking-tighter">
            {isLogin ? 'MISSION LOGIN' : 'RECRUITMENT'}
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            {isLogin ? 'Enter Credentials for Access' : 'Create an Account for NASA Insights'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] text-cyan-500 uppercase tracking-widest mb-2">Username</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-900 border border-cyan-900/50 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="e.g. Astro-Explorer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] text-cyan-500 uppercase tracking-widest mb-2">Security Code</label>
            <input 
              required
              type="password" 
              className="w-full bg-slate-900 border border-cyan-900/50 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold py-4 rounded transition-all shadow-lg shadow-cyan-900/40 uppercase tracking-widest"
          >
            {isLogin ? 'INITIATE UPLINK' : 'REQUEST CLEARANCE'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
          >
            {isLogin ? "DON'T HAVE CLEARANCE? SIGN UP" : "ALREADY HAVE CLEARANCE? LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
