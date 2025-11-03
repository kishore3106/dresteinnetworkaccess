import React, { useState, useEffect } from 'react';

// Base64 encoded image for the admin profile (1x1 transparent gif)
const adminProfileImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-lg">
        <span className="text-green-400">{label}:</span>
        <span>{value}</span>
    </div>
);

const useCounter = (end: number, duration: number, start: number = 0) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        let startTime: number;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const current = Math.min(start + (progress / duration) * (end - start), end);
            setCount(Math.floor(current));
            if (current < end) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, start]);

    return count;
};


const ToolsPage: React.FC<{ onNavigateToTerminal: () => void; }> = ({ onNavigateToTerminal }) => {
    const uptime = useCounter(137, 2000, 135);
    const memory = useCounter(78, 3000, 70);

    return (
        <div className="w-full h-full p-4">
            <h1 className="text-4xl md:text-5xl text-center mb-4 glow-text" style={{'--glow-color': '#00ff00'} as React.CSSProperties}>DRESTIEN NETWORK TOOLS v2.4</h1>
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="w-full md:w-1/4 space-y-6">
                    <div className="p-4 border border-green-700 bg-black bg-opacity-30">
                        <h2 className="text-xl border-b border-green-900 pb-2 mb-2">SYSTEM STATUS</h2>
                        <Stat label="Uptime" value={`${uptime}d 11h 4m`} />
                        <Stat label="CPU Load" value={`${useCounter(15, 5000, 10)}%`} />
                        <Stat label="Memory" value={`${memory}%`} />
                        <Stat label="Network" value="STABLE" />
                    </div>
                    <div className="p-4 border border-cyan-600 glow-border">
                        <h2 className="text-xl border-b border-cyan-800 pb-2 mb-2 text-cyan-300">ADMINISTRATOR PROFILE</h2>
                        <img src={adminProfileImage} alt="System Administrator" className="mx-auto my-2 border-2 border-cyan-800" />
                        <Stat label="Name" value="Admin" />
                        <Stat label="Role" value="Network Security" />
                        <Stat label="Pet" value="Shadow" />
                        <div className="mt-2 pt-2 border-t border-cyan-800 text-center text-2xl tracking-widest">
                           <span className="text-cyan-400">Badge:</span> DELTA-9271
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-6">
                     <div className="p-4 border border-green-700 bg-black bg-opacity-30">
                        <h2 className="text-xl mb-2">1. Port Scanner</h2>
                        <p className="text-green-400 mb-2">Scan a target IP for open ports.</p>
                        <input type="text" placeholder="127.0.0.1" className="bg-gray-900 border border-green-800 p-1 w-full md:w-1/2 outline-none" disabled/>
                        <div className="text-red-500 text-sm mt-1">[OFFLINE - REQUIRES TERMINAL ACCESS]</div>
                     </div>
                     <div className="p-4 border border-green-700 bg-black bg-opacity-30">
                        <h2 className="text-xl mb-2">2. Network Analyzer</h2>
                        <p className="text-green-400">Capture and analyze network packets.</p>
                         <div className="text-red-500 text-sm mt-1">[OFFLINE - REQUIRES TERMINAL ACCESS]</div>
                     </div>
                     <div className="p-4 border border-green-700 bg-black bg-opacity-30">
                        <h2 className="text-xl mb-2">3. System Diagnostics</h2>
                        <p className="text-green-400">Run hardware and software integrity checks.</p>
                         <div className="text-red-500 text-sm mt-1">[OFFLINE - REQUIRES TERMINAL ACCESS]</div>
                     </div>
                     <div onClick={onNavigateToTerminal} className="p-4 border border-green-500 bg-green-900 bg-opacity-50 hover:bg-opacity-80 cursor-pointer text-center">
                        <h2 className="text-2xl mb-2">4. Terminal Access</h2>
                        <p className="text-green-300">Launch secure shell for direct network interaction.</p>
                        <button className="mt-2 bg-green-700 text-black px-4 py-1 font-bold">[ LAUNCH ]</button>
                     </div>
                </main>

            </div>
        </div>
    );
};

export default ToolsPage;