import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
    onNavigateToFirewall: () => void;
}

// Fix: Replaced `string | JSX.Element` with `React.ReactNode` to resolve JSX namespace error.
const useTypingEffect = (text: React.ReactNode, speed: number, onFinished: () => void) => {
    // Fix: Replaced `string | JSX.Element` with `React.ReactNode` to resolve JSX namespace error.
    const [displayedText, setDisplayedText] = useState<React.ReactNode>('');

    useEffect(() => {
        setDisplayedText(''); 
        if (typeof text !== 'string') {
             setDisplayedText(text);
             setTimeout(onFinished, 0);
             return;
        }

        if (text.length === 0) {
            onFinished();
            return;
        }

        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(prev => (prev as string) + text.charAt(i));
            i++;
            if (i >= text.length) {
                clearInterval(intervalId);
                onFinished();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, onFinished]);

    return displayedText;
};

const Terminal: React.FC<TerminalProps> = ({ onNavigateToFirewall }) => {
    const [input, setInput] = useState('');
    // Fix: Replaced `(string | JSX.Element)[]` with `React.ReactNode[]` to resolve JSX namespace error.
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [isProcessing, setIsProcessing] = useState(true);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const endOfTerminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialLines = [
        'Drestien Network Secure Shell v2.4',
        'Authorization successful. Welcome, operative.',
        'Type "help" for a list of available commands.',
        ' '
    ];
    
    useEffect(() => {
        let lineIndex = 0;
        const typeNextLine = () => {
            if (lineIndex < initialLines.length) {
                setHistory(prev => [...prev, <TypingLine key={lineIndex} text={initialLines[lineIndex]} onFinished={typeNextLine} />]);
                lineIndex++;
            } else {
                setIsProcessing(false);
            }
        };
        typeNextLine();
    }, []);


    useEffect(() => {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (!isProcessing) {
            inputRef.current?.focus();
        }
    }, [isProcessing]);

    const processCommand = (command: string) => {
        const [cmd, ...args] = command.trim().toLowerCase().split(' ');
        // Fix: Replaced `(string | JSX.Element)[]` with `React.ReactNode[]` to resolve JSX namespace error.
        let output: React.ReactNode[] = [];

        switch (cmd) {
            case 'help':
                output = ['Available commands: ls, ping, nmap, clear, exit'];
                break;
            case 'ls':
            case 'sudo':
            case 'ssh':
                output = ['Permission denied'];
                break;
            case 'clear':
                setHistory([]);
                setIsProcessing(false);
                return;
            case 'exit':
                output = ['Disconnecting...'];
                // Could navigate away or just show a message
                break;
            case 'ping':
                output = [`Pinging ${args[0] || 'host'}...`, 'Host unreachable'];
                break;
            case 'nmap':
                if (args[0] === '172.3.67.1') {
                    output = [
                        'Starting Nmap 7.92 ( https://nmap.org ) at 2024-05-21 14:32 UTC',
                        'Nmap scan report for 172.3.67.1',
                        'Host is up (0.0021s latency).',
                        'Not shown: 998 closed tcp ports (reset)',
                        ' ',
                        'PORT      STATE   SERVICE',
                        '22/tcp    closed  ssh',
                        '80/tcp    closed  http',
                        <div key="firewall-link" className="whitespace-pre">8080/tcp  open    http-proxy -&gt; <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToFirewall(); }} className="text-cyan-400 underline hover:text-cyan-200">Access Firewall</a></div>,
                        ' ',
                        'Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds'
                    ];
                } else {
                    output = [`Connection timeout to host "${args[0] || ''}".`];
                }
                break;
            case '':
                break;
            default:
                output = [`command not found: ${cmd}`];
                break;
        }

        let outputIndex = 0;
        const typeNextOutput = () => {
            if (outputIndex < output.length) {
                 setHistory(prev => [...prev, <TypingLine key={Date.now() + outputIndex} text={output[outputIndex]} onFinished={typeNextOutput} />]);
                 outputIndex++;
            } else {
                 setIsProcessing(false);
            }
        }
        typeNextOutput();
    };
    
    // Fix: Replaced `string | JSX.Element` with `React.ReactNode` to resolve JSX namespace error.
    const TypingLine: React.FC<{text: React.ReactNode, onFinished: () => void}> = ({ text, onFinished }) => {
        const displayedText = useTypingEffect(text, 15, onFinished);
        return <div className="whitespace-pre-wrap">{displayedText}</div>;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isProcessing) return;

            const currentCommand = input.trim();
            setHistory(prev => [...prev, `operative@drestien-net ~ $ ${input}`]);
            
            if (currentCommand !== '') {
                 setCommandHistory(prev => [currentCommand, ...prev]);
            }
            setInput('');
            setHistoryIndex(-1);
            setIsProcessing(true);
            
            if (currentCommand === 'clear') {
                processCommand('clear');
            } else {
                setTimeout(() => processCommand(currentCommand), 100);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > -1) {
                const newIndex = Math.max(historyIndex - 1, -1);
                setHistoryIndex(newIndex);
                setInput(newIndex === -1 ? '' : commandHistory[newIndex]);
            }
        }
    };

    return (
        <div className="w-full h-[calc(100vh-4rem)] p-4" onClick={() => inputRef.current?.focus()}>
            <div className="h-full overflow-y-auto">
                {history.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
                {!isProcessing && (
                     <div className="flex">
                        <span className="mr-2">operative@drestien-net ~ $</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-[#00ff00] w-full"
                            autoFocus
                            autoComplete="off"
                        />
                        <span className="w-2 h-5 bg-[#00ff00] animate-pulse"></span>
                    </div>
                )}
                <div ref={endOfTerminalRef} />
            </div>
        </div>
    );
};

export default Terminal;