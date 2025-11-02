import React, { useState } from 'react';

interface FirewallPageProps {
    passwordResetStatus: boolean;
    onPasswordResetSuccess: () => void;
    onLoginSuccess: () => void;
}

type Stage = 'login' | 'forgot_q1' | 'forgot_q2' | 'reset_success';

const FirewallPage: React.FC<FirewallPageProps> = ({ passwordResetStatus, onPasswordResetSuccess, onLoginSuccess }) => {
    const [stage, setStage] = useState<Stage>(passwordResetStatus ? 'reset_success' : 'login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [error, setError] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (passwordResetStatus && username.toLowerCase() === 'admin' && password === 'temp_access_2024') {
            onLoginSuccess();
        } else {
            setLoginAttempts(prev => prev + 1);
            if (passwordResetStatus) {
                setError(`Access Denied. Invalid temporary credentials. Attempt ${loginAttempts + 1}/3`);
            } else {
                setError(`Access Denied. Authentication failed. Attempt ${loginAttempts + 1}/3`);
            }
             if (loginAttempts >= 2) {
                setError('ACCESS DENIED. SYSTEM LOCKED.');
            }
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (stage === 'forgot_q1') {
            if (answer1.toLowerCase() === 'shadow') {
                setStage('forgot_q2');
            } else {
                setError('Incorrect answer. Recovery failed.');
            }
        } else if (stage === 'forgot_q2') {
            if (answer2.toUpperCase() === 'DELTA-9271') {
                onPasswordResetSuccess();
                setStage('reset_success');
            } else {
                setError('Incorrect security code. Recovery failed.');
            }
        }
    };

    const renderContent = () => {
        switch (stage) {
            case 'login':
                return (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 w-full">
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-900 border border-cyan-700 p-2 outline-none focus:border-cyan-400 focus:glow-border" style={{'--glow-color': '#00ffff'} as React.CSSProperties} />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-cyan-700 p-2 outline-none focus:border-cyan-400 focus:glow-border" style={{'--glow-color': '#00ffff'} as React.CSSProperties}/>
                        </div>
                        <button type="submit" className="w-full bg-cyan-700 text-black p-2 font-bold hover:bg-cyan-500" disabled={loginAttempts >= 3}>[ LOGIN ]</button>
                        <a href="#" onClick={(e) => { e.preventDefault(); setStage('forgot_q1'); setError(''); }} className="block text-center text-sm text-cyan-400 hover:underline">Forgot Password?</a>
                    </form>
                );
            case 'forgot_q1':
                return (
                     <form onSubmit={handleForgotSubmit} className="space-y-4 w-full">
                        <label htmlFor="q1">Security Question 1: What is the system administrator's pet name?</label>
                        <input id="q1" type="text" value={answer1} onChange={e => setAnswer1(e.target.value)} className="w-full bg-gray-900 border border-cyan-700 p-2 outline-none focus:border-cyan-400"/>
                        <button type="submit" className="w-full bg-cyan-700 text-black p-2 font-bold hover:bg-cyan-500">[ Submit Answer ]</button>
                         <a href="#" onClick={(e) => { e.preventDefault(); setStage('login'); setError(''); }} className="text-sm text-cyan-400 hover:underline">&lt; Back to Login</a>
                    </form>
                );
            case 'forgot_q2':
                return (
                     <form onSubmit={handleForgotSubmit} className="space-y-4 w-full">
                        <label htmlFor="q2">Security Question 2: Enter the administrator's badge security code.</label>
                        <input id="q2" type="text" placeholder="XXXX-####" value={answer2} onChange={e => setAnswer2(e.target.value)} className="w-full bg-gray-900 border border-cyan-700 p-2 outline-none focus:border-cyan-400"/>
                        <button type="submit" className="w-full bg-cyan-700 text-black p-2 font-bold hover:bg-cyan-500">[ Submit Code ]</button>
                    </form>
                );
            case 'reset_success':
                return (
                    <div className="space-y-4 text-center w-full">
                        <p className="text-xl text-green-400">Password Reset Successful</p>
                        <div className="bg-black p-4 border border-green-700 text-left">
                            <p>New credentials:</p>
                            <p>Username: <span className="text-cyan-400">admin</span></p>
                            <p>Password: <span className="text-cyan-400">temp_access_2024</span></p>
                        </div>
                        <button onClick={() => setStage('login')} className="w-full bg-green-700 text-black p-2 font-bold hover:bg-green-500">[ Return to Login ]</button>
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-cyan-300">
            <div className="w-full max-w-md p-8 border-2 border-cyan-700 bg-black bg-opacity-70 space-y-4 glow-border">
                 <h1 className="text-3xl text-center glow-text pb-2">🔒 SECURE ACCESS GATEWAY</h1>
                 <p className="text-center text-sm">Drestien Network Infrastructure - Authorized Access Only</p>
                 {error && <p className="text-red-500 bg-red-900 bg-opacity-50 p-2 text-center border border-red-500">{error}</p>}
                 {renderContent()}
            </div>
        </div>
    );
};

export default FirewallPage;