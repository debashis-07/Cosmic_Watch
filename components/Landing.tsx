
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';

// Fix: Use uppercase aliases for Three.js intrinsic elements to resolve TypeScript JSX errors
const Color = 'color' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const Landing: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="relative h-screen w-screen bg-slate-950 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Color attach="background" args={['#020617']} />
          <AmbientLight intensity={0.5} />
          <PointLight position={[15, 15, 15]} intensity={2.5} color="#fff" />
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          <Earth />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Hero UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none">
        <div className="text-center px-6 pointer-events-auto">
          <div className="inline-block border border-cyan-500/30 px-4 py-1 rounded-full mb-6 bg-cyan-950/20 backdrop-blur-sm">
             <span className="text-[10px] text-cyan-400 font-orbitron tracking-[0.4em] uppercase">Global Monitoring Active</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-orbitron font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            COSMIC WATCH
          </h1>
          <p className="text-lg md:text-xl text-cyan-200/60 font-light tracking-[0.2em] uppercase mb-12 max-w-2xl mx-auto">
            Real-Time Near-Earth Object Monitoring Powered by NASA
          </p>
          
          <button 
            onClick={onEnter}
            className="group relative px-12 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-orbitron font-bold tracking-widest overflow-hidden transition-all hover:text-slate-950"
          >
            <div className="absolute inset-0 w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full -z-10"></div>
            ENTER MISSION CONTROL
          </button>
        </div>
      </div>

      {/* Tech Decals */}
      <div className="absolute bottom-10 left-10 hidden md:block border-l border-cyan-500/50 pl-4 py-2 opacity-40">
        <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Network: Deep Space Grid</p>
        <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Uplink: Primary NASA Feed</p>
      </div>
      <div className="absolute top-10 right-10 hidden md:block text-right border-r border-cyan-500/50 pr-4 py-2 opacity-40">
        <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">System Status: Nominal</p>
        <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Latency: 24ms</p>
      </div>
    </div>
  );
};

export default Landing;
