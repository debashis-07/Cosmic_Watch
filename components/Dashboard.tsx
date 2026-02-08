
import React, { useState, useEffect, useMemo } from 'react';
import { fetchTodayNEOs } from '../services/nasaService';
import { AsteroidRecord, RiskLevel } from '../types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import AsteroidsScene from './AsteroidsScene';
import Chatbot from './Chatbot';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, CartesianGrid 
} from 'recharts';

// Fix: Use uppercase aliases for Three.js intrinsic elements to resolve TypeScript JSX errors
const Color = 'color' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const getRiskLevel = (ast: AsteroidRecord): RiskLevel => {
  if (ast.is_hazardous && ast.kilometers_diameter > 0.1) return 'Potentially Hazardous';
  if (ast.is_hazardous || ast.miss_distance_km < 5000000) return 'Watch';
  return 'Safe';
};

const Dashboard: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [asteroids, setAsteroids] = useState<AsteroidRecord[]>([]);
  const [selectedAst, setSelectedAst] = useState<AsteroidRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>(JSON.parse(localStorage.getItem(`watchlist_${user.username}`) || '[]'));

  useEffect(() => {
    fetchTodayNEOs().then((data) => {
      setAsteroids(data);
      if (data.length > 0) setSelectedAst(data[0]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(`watchlist_${user.username}`, JSON.stringify(watchlist));
  }, [watchlist, user.username]);

  const toggleWatchlist = (nasa_id: string) => {
    setWatchlist(prev => prev.includes(nasa_id) ? prev.filter(id => id !== nasa_id) : [...prev, nasa_id]);
  };

  const filteredAsteroids = useMemo(() => {
    return asteroids.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  }, [asteroids, search]);

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 font-orbitron">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-cyan-400 tracking-widest animate-pulse">ESTABLISHING UPLINK TO NASA...</p>
    </div>
  );

  const risk = selectedAst ? getRiskLevel(selectedAst) : 'Safe';
  const riskColor = risk === 'Potentially Hazardous' ? 'text-red-500' : risk === 'Watch' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden relative">
      {/* Top Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-cyan-900/30 glass-panel z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            CW
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-lg tracking-tighter text-cyan-400 glow-cyan">COSMIC WATCH</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">NASA MISSION CONTROL INTERFACE</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">AUTHORIZED PERSONNEL</p>
            <p className="text-sm font-semibold text-cyan-100">{user.username}</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-1 border border-cyan-800 rounded text-xs hover:bg-cyan-900/20 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Asteroid List */}
        <aside className="w-80 border-r border-cyan-900/30 flex flex-col glass-panel z-10">
          <div className="p-4 border-b border-cyan-900/30">
            <input 
              type="text" 
              placeholder="SEARCH OBJECTS..."
              className="w-full bg-slate-900/50 border border-cyan-900/50 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-orbitron transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredAsteroids.map((ast) => (
              <div 
                key={ast.nasa_id}
                onClick={() => setSelectedAst(ast)}
                className={`p-4 border-b border-cyan-900/10 cursor-pointer transition-all hover:bg-cyan-900/10 ${selectedAst?.nasa_id === ast.nasa_id ? 'bg-cyan-900/20 border-l-4 border-l-cyan-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm truncate w-48">{ast.name}</h3>
                  {ast.is_hazardous && (
                    <span className="text-[10px] bg-red-950 text-red-500 border border-red-900 px-1 rounded">HAZARD</span>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Ø {ast.kilometers_diameter.toFixed(3)} KM</span>
                  <span>{watchlist.includes(ast.nasa_id) ? '⭐ WATCHLIST' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center - 3D Visualization */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
            <Color attach="background" args={['#020617']} />
            <AmbientLight intensity={0.4} />
            <PointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Earth />
            <AsteroidsScene 
              asteroids={asteroids} 
              onSelect={setSelectedAst} 
              selectedId={selectedAst?.nasa_id || null} 
            />
            <OrbitControls enablePan={true} enableZoom={true} minDistance={3} maxDistance={30} />
          </Canvas>

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none">
            <div className="glass-panel p-3 rounded-lg border border-cyan-500/20">
              <p className="text-[10px] text-cyan-400/60 uppercase">Monitored Objects</p>
              <p className="text-2xl font-orbitron">{asteroids.length}</p>
            </div>
            <div className="glass-panel p-3 rounded-lg border border-red-500/20">
              <p className="text-[10px] text-red-400/60 uppercase">Threat Indicators</p>
              <p className="text-2xl font-orbitron text-red-500">{asteroids.filter(a => a.is_hazardous).length}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Details & Graphs */}
        <aside className="w-96 border-l border-cyan-900/30 flex flex-col glass-panel z-10 overflow-y-auto">
          {selectedAst ? (
            <div className="p-6 space-y-8">
              {/* Header */}
              <section>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-orbitron font-bold text-cyan-400 uppercase leading-none">{selectedAst.name}</h2>
                  <button 
                    onClick={() => toggleWatchlist(selectedAst.nasa_id)}
                    className={`text-xl transition-colors ${watchlist.includes(selectedAst.nasa_id) ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    ★
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4 tracking-widest">NASA ID: {selectedAst.nasa_id}</p>
                <div className={`text-xs font-bold uppercase py-1 px-3 border inline-block rounded ${riskColor} border-current bg-opacity-10 bg-white`}>
                  {risk}
                </div>
              </section>

              {/* Detail Metrics */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 p-3 rounded border border-cyan-900/20">
                  <p className="text-[10px] text-slate-500 uppercase">Diameter</p>
                  <p className="text-lg font-orbitron text-cyan-100">{selectedAst.kilometers_diameter.toFixed(3)} <span className="text-[10px]">KM</span></p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded border border-cyan-900/20">
                  <p className="text-[10px] text-slate-500 uppercase">Relative Velocity</p>
                  <p className="text-lg font-orbitron text-cyan-100">{Math.round(selectedAst.velocity_kph).toLocaleString()} <span className="text-[10px]">KPH</span></p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded border border-cyan-900/20">
                  <p className="text-[10px] text-slate-500 uppercase">Miss Distance</p>
                  <p className="text-lg font-orbitron text-cyan-100">{(selectedAst.miss_distance_km / 1000000).toFixed(2)} <span className="text-[10px]">M KM</span></p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded border border-cyan-900/20">
                  <p className="text-[10px] text-slate-500 uppercase">Close Approach</p>
                  <p className="text-sm font-orbitron text-cyan-100">{selectedAst.close_approach_date}</p>
                </div>
              </section>

              {/* Image Placeholder */}
              <section>
                <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-cyan-900/30">
                  <img 
                    src={`https://picsum.photos/seed/${selectedAst.nasa_id}/400/225`} 
                    alt="Asteroid Visual" 
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-cyan-500 font-mono">ENHANCED SENSOR IMAGING: {selectedAst.nasa_id}</div>
                </div>
              </section>

              {/* Charts */}
              <section className="space-y-6">
                <div className="h-48">
                  <p className="text-[10px] text-slate-500 uppercase mb-2">Distance From Earth (Comparative List)</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredAsteroids.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Bar dataKey="miss_distance_km" name="Miss Distance (km)">
                        {filteredAsteroids.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.nasa_id === selectedAst.nasa_id ? '#22d3ee' : '#1e293b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-48">
                  <p className="text-[10px] text-slate-500 uppercase mb-2">Velocity Trends (Regional Objects)</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredAsteroids.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }}
                        itemStyle={{ color: '#ef4444' }}
                      />
                      <Line type="monotone" dataKey="velocity_kph" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="font-orbitron text-xs tracking-widest">SELECT AN OBJECT FOR DETAILED ANALYSIS</p>
            </div>
          )}
        </aside>
      </main>

      {/* Chatbot Overlay */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
