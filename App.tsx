import React, { useState } from 'react';
import { Page } from './types';
import ToolsPage from './components/ToolsPage';
import Terminal from './components/Terminal';
import FirewallPage from './components/FirewallPage';
import FileDirectoryPage from './components/FileDirectoryPage';

interface Progress {
    passwordReset: boolean;
    loggedIn: boolean;
}

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Tools);
    const [progress, setProgress] = useState<Progress>({
        passwordReset: false,
        loggedIn: false,
    });

    const updateProgress = (newProgress: Partial<Progress>) => {
        setProgress(prev => ({ ...prev, ...newProgress }));
    };

    const navigateTo = (page: Page) => setCurrentPage(page);

    const handlePasswordReset = () => {
        updateProgress({ passwordReset: true });
    };

    const handleLogin = () => {
        updateProgress({ loggedIn: true });
        navigateTo(Page.FileDirectory);
    };
    
    const handleReset = () => {
        setProgress({ passwordReset: false, loggedIn: false });
        setCurrentPage(Page.Tools);
    }

    const renderPage = () => {
        switch (currentPage) {
            case Page.Tools:
                return <ToolsPage onNavigateToTerminal={() => navigateTo(Page.Terminal)} />;
            case Page.Terminal:
                return <Terminal onNavigateToFirewall={() => navigateTo(Page.Firewall)} />;
            case Page.Firewall:
                return <FirewallPage passwordResetStatus={progress.passwordReset} onPasswordResetSuccess={handlePasswordReset} onLoginSuccess={handleLogin} />;
            case Page.FileDirectory:
                 return <FileDirectoryPage onReset={handleReset} />;
            default:
                return <ToolsPage onNavigateToTerminal={() => navigateTo(Page.Terminal)} />;
        }
    };

    return (
        <div className="min-h-screen relative text-lg p-4 sm:p-8 pt-20">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b-2 border-green-700 p-3 flex justify-between items-center text-lg">
                <h1 className="text-2xl glow-text" style={{'--glow-color': '#00ff00'} as React.CSSProperties}>DRESTIEN NETWORK v2.4</h1>
                <nav className="flex gap-6 items-center">
                    <button 
                        onClick={() => navigateTo(Page.Tools)} 
                        className="hover:text-cyan-400 transition-colors duration-200"
                    >
                        [ ROOT ]
                    </button>
                    <button 
                        onClick={handleReset} 
                        className="text-red-500 hover:text-red-300 transition-colors duration-200"
                    >
                        [ RESET SIMULATION ]
                    </button>
                </nav>
            </header>
            {renderPage()}
        </div>
    );
};

export default App;