import React, { useState, useEffect, useRef } from 'react';

// --- HELPER COMPONENTS & HOOKS ---

const useTypingEffect = (text: string, speed: number, onFinished: () => void) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText(''); 
        if (text.length === 0) {
            onFinished();
            return;
        }
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(prev => prev + text.charAt(i));
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

const TypingLine: React.FC<{ text: string, onFinished?: () => void, speed?: number }> = ({ text, onFinished = () => {}, speed = 20 }) => {
    const displayedText = useTypingEffect(text, speed, onFinished);
    return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

const GlitchText: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
    const [glitchedText, setGlitchedText] = useState(text);
    const chars = '█▓▒░';
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                const index = Math.floor(Math.random() * text.length);
                const char = chars[Math.floor(Math.random() * chars.length)];
                setGlitchedText(text.substring(0, index) + char + text.substring(index + 1));
                setTimeout(() => setGlitchedText(text), 100);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [text]);
    return <span className={className}>{glitchedText}</span>;
}

const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops: number[] = Array(Math.floor(columns)).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        const interval = setInterval(draw, 40);
        return () => clearInterval(interval);
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-30" />;
};

const AsciiBorder: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="border-2 border-[#00cc00] p-1 my-4">
        <div className="border border-[#00cc00] p-4">
            <h2 className="text-center text-xl mb-4 text-[#00ffff]">
                <GlitchText text={`█▓▒░ ${title} ░▒▓█`} />
            </h2>
            {children}
        </div>
    </div>
);

// --- PUZZLE STAGE COMPONENTS ---

const PuzzleLanding: React.FC<{ onNavigate: (stage: string) => void }> = ({ onNavigate }) => {
    const [typed, setTyped] = useState(false);
    return (
        <div className="p-4">
            <pre className="text-sm md:text-base border-2 border-[#00cc00] p-4">
{`╔═══════════════════════════════════════════════════════════╗
║  [!] FIREWALL BREACHED - ACCESSING CLASSIFIED SYSTEM      ║
║  [!] WARNING: DATA CORRUPTION DETECTED                    ║
║  [!] PARTIAL FILE RECOVERY IN PROGRESS...                 ║
╚═══════════════════════════════════════════════════════════╝`}
            </pre>
            <TypingLine text="> ls -la /classified/" onFinished={() => setTyped(true)} speed={50}/>
            {typed && (
                <>
                <pre className="text-sm md:text-base mt-4 text-yellow-400">
{`
█████ FILE SYSTEM COMPROMISED █████

drwxr-x--- 2 root shadow    4096 May 21 14:32 .
drwxr-xr-x 8 root root      4096 May 21 14:30 ..
-rw-r----- 1 root shadow   [█████ CORRUPTED █████] .access_log
-rwxr-x--- 1 root shadow   8472 May 21 14:15 encryption_key_PART1.dat
-rwxr-x--- 1 root shadow   7361 May 21 14:16 security_protocol_PART2.dat  
-rwxr-x--- 1 root shadow   9284 May 21 14:17 brainstorm_protocol_PART3.dat

[WARNING] Files partially corrupted. Click to attempt recovery...
`}
                </pre>
                 <div className="flex flex-col md:flex-row gap-4 mt-4">
                     <button onClick={() => onNavigate('part1')} className="flex-1 p-4 border border-green-500 hover:bg-green-900 text-center">
                         <p>[ CLICK HERE: RECOVER ]</p>
                         <p className="font-bold">PART 1</p>
                    </button>
                     <button onClick={() => onNavigate('part2')} className="flex-1 p-4 border border-green-500 hover:bg-green-900 text-center">
                         <p>[ CLICK HERE: RECOVER ]</p>
                         <p className="font-bold">PART 2</p>
                    </button>
                     <button onClick={() => onNavigate('part3')} className="flex-1 p-4 border border-green-500 hover:bg-green-900 text-center">
                         <p>[ CLICK HERE: RECOVER ]</p>
                         <p className="font-bold">PART 3</p>
                     </button>
                 </div>
                </>
            )}
        </div>
    );
}

const PuzzlePart1: React.FC<{ onSolve: () => void }> = ({ onSolve }) => {
    const [step1Solved, setStep1Solved] = useState(false);
    const [step2Solved, setStep2Solved] = useState(false);
    const [step3Solved, setStep3Solved] = useState(false);
    const [step4Solved, setStep4Solved] = useState(false);
    const [finalSolved, setFinalSolved] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    const [stepInput, setStepInput] = useState('');
    const [finalInput, setFinalInput] = useState('');
    const [error, setError] = useState('');

    const verifyStep = (step: number) => {
        setError('');
        const userInput = stepInput.trim().toLowerCase();
        let correct = false;

        switch (step) {
            case 1:
                correct = userInput === 'encrypt' || userInput === 'the first clue is encrypt';
                if (correct) { setStep1Solved(true); setActiveStep(2); }
                break;
            case 2:
                correct = userInput === 'test';
                if (correct) { setStep2Solved(true); setActiveStep(3); }
                break;
            case 3:
                correct = userInput === 'secret code';
                if (correct) { setStep3Solved(true); setActiveStep(4); }
                break;
            case 4:
                correct = userInput === 'keyword';
                if (correct) { setStep4Solved(true); setActiveStep(5); }
                break;
        }
        
        if (correct) {
            setStepInput('');
        } else {
            setError('ERROR: INVALID INPUT - ACCESS DENIED');
            setTimeout(() => setError(''), 2000);
        }
    }
    
    const verifyFinal = () => {
         setError('');
        if (finalInput.trim().toLowerCase() === 'cipher') {
            setFinalSolved(true);
        } else {
            setError('ERROR: INCORRECT FRAGMENT - TRY AGAIN');
            setTimeout(() => setError(''), 2000);
        }
    }
    
    const allCluesCollected = step1Solved && step2Solved && step3Solved && step4Solved;
    
    return (
        <div className="p-2 md:p-4 text-sm md:text-base">
            <pre className="border-2 border-[#00cc00] p-2 text-[#00ffff]">
{`╔════════════════════════════════════════════════════════════════╗
║ █▓▒░ ACCESSING FILE: encryption_key_PART1.dat ░▒▓█            ║
║ STATUS: [████████░░] 80% RECOVERED                             ║
║ DATA INTEGRITY: COMPROMISED                                    ║
╚════════════════════════════════════════════════════════════════╝`}
            </pre>
            <AsciiBorder title="INVESTIGATION PROTOCOL">
                {/* STEP 1 */}
                {activeStep === 1 && (
                    <div>
                        <h3 className="text-lg">STEP 1: CRYPTOGRAPHIC DATABASE SEARCH</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                            {`> OBJECTIVE: Locate target's encrypted message
> ENCODED MESSAGE FOUND: "VGhlIGZpcnN0IGNsdWUgaXMgRU5DUllQVA=="
> ACTION REQUIRED: Decode the Base64 string`}
                        </p>
                        <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label htmlFor="step1">Enter decoded message:</label>
                            <input id="step1" value={stepInput} onChange={e => setStepInput(e.target.value)} disabled={step1Solved} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={() => verifyStep(1)} disabled={step1Solved} className="border px-2 hover:bg-green-900">{step1Solved ? '[VERIFIED]' : '[VERIFY]'}</button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {activeStep === 2 && (
                    <div>
                        <h3 className="text-lg mt-4">STEP 2: HASH CRACKING</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> HASH TYPE: MD5
> HASH VALUE: 098f6bcd4621d373cade4e832627b4f6
> ACTION: Use hash cracker to find plaintext`}
                        </p>
                        <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label htmlFor="step2">Enter cracked hash:</label>
                            <input id="step2" value={stepInput} onChange={e => setStepInput(e.target.value)} disabled={step2Solved} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={() => verifyStep(2)} disabled={step2Solved} className="border px-2 hover:bg-green-900">{step2Solved ? '[VERIFIED]' : '[VERIFY]'}</button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {activeStep === 3 && (
                     <div>
                        <h3 className="text-lg mt-4">STEP 3: CIPHER WHEEL ANALYSIS</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> ENCODED TEXT: "FRPERG PBQR"
> ACTION: Decode using ROT13`}
                        </p>
                        <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label htmlFor="step3">Enter decoded ROT13:</label>
                            <input id="step3" value={stepInput} onChange={e => setStepInput(e.target.value)} disabled={step3Solved} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={() => verifyStep(3)} disabled={step3Solved} className="border px-2 hover:bg-green-900">{step3Solved ? '[VERIFIED]' : '[VERIFY]'}</button>
                        </div>
                    </div>
                )}

                {/* STEP 4 */}
                {activeStep === 4 && (
                     <div>
                        <h3 className="text-lg mt-4">STEP 4: HEXADECIMAL TRACE</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> HEX DATA: 4B 45 59 57 4F 52 44
> ACTION: Convert hex to ASCII text.`}
                        </p>
                        <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label htmlFor="step4">Enter ASCII result:</label>
                            <input id="step4" value={stepInput} onChange={e => setStepInput(e.target.value)} disabled={step4Solved} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={() => verifyStep(4)} disabled={step4Solved} className="border px-2 hover:bg-green-900">{step4Solved ? '[VERIFIED]' : '[VERIFY]'}</button>
                        </div>
                    </div>
                )}
                
                 {/* STEP 5 FINAL ASSEMBLY */}
                {allCluesCollected && !finalSolved && (
                     <div>
                        <h3 className="text-lg mt-4">STEP 5: FINAL ASSEMBLY</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> CLUES COLLECTED: [ENCRYPT], [test], [SECRET CODE], [KEYWORD]
> NEW INSTRUCTION: The fragment is hidden in the CONTEXT. What is the primary subject of all cryptographic operations?`}
                        </p>
                        <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label htmlFor="step5">Enter the key fragment:</label>
                            <input id="step5" value={finalInput} onChange={e => setFinalInput(e.target.value)} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={verifyFinal} className="border px-2 hover:bg-green-900">[VERIFY]</button>
                        </div>
                    </div>
                )}
            </AsciiBorder>
            
            {error && <p className="text-red-500 text-center animate-pulse">{error}</p>}
            
            {finalSolved && (
                 <div className="border-2 border-green-500 p-4 my-4 text-center">
                     <p className="text-xl text-cyan-400">✓ ALL PROTOCOLS VERIFIED</p>
                     <pre className="text-xs text-green-400 my-4">
{`         ██████╗ ██╗██████╗ ██╗  ██╗███████╗██████╗
        ██╔════╝ ██║██╔══██╗██║  ██║██╔════╝██╔══██╗
        ██║      ██║██████╔╝███████║█████╗  ██████╔╝
        ██║      ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗
        ╚██████╗ ██║██║     ██║  ██║███████╗██║  ██║
         ╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`}
                     </pre>
                     <p>FRAGMENT 1: CIPHER</p>
                     <p>VERIFICATION CODE: EK-047-ALPHA</p>
                     <button onClick={onSolve} className="mt-4 border p-2 w-full hover:bg-green-900">[ CONTINUE TO PART 2 ] →</button>
                 </div>
            )}
        </div>
    );
};

const PuzzlePart2: React.FC<{ onSolve: () => void }> = ({ onSolve }) => {
    const [solvedChallenges, setSolvedChallenges] = useState([false, false, false, false, false]);
    const [inputs, setInputs] = useState(['', '', '', '', '', '', '', '', '', '']);
    const [finalInput, setFinalInput] = useState('');
    const [error, setError] = useState('');
    const [finalSolved, setFinalSolved] = useState(false);

    const handleVerify = (challengeIndex: number, inputIndex1: number, answer1: string, inputIndex2: number = -1, answer2: string = '') => {
        setError('');
        const val1 = inputs[inputIndex1].trim().toLowerCase();
        const val2 = inputIndex2 !== -1 ? inputs[inputIndex2].trim().toLowerCase() : '';

        const correct1 = val1 === answer1.toLowerCase();
        const correct2 = inputIndex2 !== -1 ? val2 === answer2.toLowerCase() : true;

        if (correct1 && correct2) {
            setSolvedChallenges(prev => {
                const newSolved = [...prev];
                newSolved[challengeIndex] = true;
                return newSolved;
            });
        } else {
            setError('ERROR: INVALID DATA - ANALYSIS FAILED');
            setTimeout(() => setError(''), 2000);
        }
    };
    
    const handleFinalVerify = () => {
         setError('');
        if (finalInput.trim().toLowerCase() === 'pol') {
            setFinalSolved(true);
        } else {
            setError('ERROR: FRAGMENT MISMATCH - PROTOCOL REJECTED');
            setTimeout(() => setError(''), 2000);
        }
    }

    const updateInput = (index: number, value: string) => {
        setInputs(prev => {
            const newInputs = [...prev];
            newInputs[index] = value;
            return newInputs;
        });
    };
    
    const allChallengesSolved = solvedChallenges.every(s => s);

    const renderChallenge = (index: number, title: string, code: string, task: string, inputsConfig: {label: string, answer: string, inputIndex: number}[]) => {
        const isSolved = solvedChallenges[index];
        const isPreviousSolved = index === 0 || solvedChallenges[index - 1];
        if (!isPreviousSolved) return null;

        return (
             <div className="mt-4">
                <h3 className="text-lg text-yellow-300">{title}</h3>
                <pre className="bg-black border border-gray-700 p-2 my-2 text-sm whitespace-pre-wrap">{code}</pre>
                <p className="text-green-300">{task}</p>
                <div className="border border-[#00cc00] p-2 my-2 space-y-2">
                    {inputsConfig.map(config => (
                        <div key={config.inputIndex} className="flex items-center gap-2">
                             <label htmlFor={`c${index}i${config.inputIndex}`}>{config.label}</label>
                            <input id={`c${index}i${config.inputIndex}`} value={inputs[config.inputIndex]} onChange={e => updateInput(config.inputIndex, e.target.value)} disabled={isSolved} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                        </div>
                    ))}
                     <button onClick={() => handleVerify(index, inputsConfig[0].inputIndex, inputsConfig[0].answer, inputsConfig.length > 1 ? inputsConfig[1].inputIndex : -1, inputsConfig.length > 1 ? inputsConfig[1].answer : '')} disabled={isSolved} className="border px-2 w-full hover:bg-green-900">{isSolved ? '[VERIFIED]' : '[VERIFY]'}</button>
                </div>
            </div>
        )
    };
    
    return (
        <div className="p-2 md:p-4 text-sm md:text-base">
             <pre className="border-2 border-[#00cc00] p-2 text-yellow-400">
{`╔════════════════════════════════════════════════════════════════╗
║ █▓▒░ ACCESSING FILE: security_protocol_PART2.dat ░▒▓█         ║
║ STATUS: [██████░░░░] 60% RECOVERED                             ║
║ WARNING: ADVANCED PROGRAMMING ANALYSIS REQUIRED                ║
╚════════════════════════════════════════════════════════════════╝`}
            </pre>
            <AsciiBorder title="CODING PROTOCOL CHALLENGES">
                {renderChallenge(0, "CHALLENGE 1: RECURSIVE PUZZLE SOLVER", `#include <stdio.h> ...\nint main() {\n ...\n int cipher = (max_num * 2) + (max_depth * 5);\n printf("System Code: %d\\n", cipher);\n ...\n}`, "Run this code and find the 'System Code' output and the number with the longest sequence.", [
                    {label: 'System Code:', answer: '609', inputIndex: 0},
                    {label: 'Longest Sequence #:', answer: '27', inputIndex: 1}
                ])}
                {renderChallenge(1, "CHALLENGE 2: MATRIX MANIPULATION CIPHER", `#include <stdio.h> ...\nvoid rotate_matrix(int mat[3][3]) { ... }\nint main() {\n ...\n printf("%c", matrix[i][i]);\n ...\n}`, "Run and decode the diagonal message and find the checksum.", [
                    {label: 'Decoded Word:', answer: 'POL', inputIndex: 2},
                    {label: 'Checksum:', answer: '660', inputIndex: 3}
                ])}
                {renderChallenge(2, "CHALLENGE 3: LINKED LIST TRAVERSAL PUZZLE", `#include <stdio.h> ...\nint main() {\n ...\n if (position % 2 == 0) { printf("%c", current->data); }\n ...\n}`, "Decode the message from even-positioned nodes and find the pattern count.", [
                    {label: 'Decoded Message:', answer: 'POL', inputIndex: 4},
                    {label: 'Pattern Count:', answer: '3', inputIndex: 5}
                ])}
                 {renderChallenge(3, "CHALLENGE 4: BIT MANIPULATION CRYPTOGRAPHY", `#include <stdio.h> ...\nint main() {\n ...\n extract_chars(decrypted);\n ...\n}`, "Run and extract the decrypted sequence and verification hash.", [
                    {label: 'Decrypted Sequence:', answer: 'POLICE', inputIndex: 6},
                    {label: 'Verification Hash:', answer: '6405', inputIndex: 7}
                ])}
                 {renderChallenge(4, "CHALLENGE 5: RECURSIVE BACKTRACKING MAZE", `#include <stdio.h> ...\nint main() {\n ...\n printf("%c", 80 - (cell_num % 10));\n ...\n}`, "Run the maze solver and decode the hidden message and path length.", [
                    {label: 'Decoded Message:', answer: 'POL', inputIndex: 8},
                    {label: 'Path Length:', answer: '13', inputIndex: 9}
                ])}

                {allChallengesSolved && !finalSolved && (
                     <div className="mt-4">
                        <h3 className="text-lg text-yellow-300">FINAL ASSEMBLY</h3>
                        <p className="text-green-300 pt-2 mt-2 border-t border-dashed border-green-800">
                            Look at Challenge 2, 3, 4, 5 decoded words/messages. What common 3-letter sequence appears?
                        </p>
                         <div className="border border-[#00cc00] p-2 my-2 space-x-2 flex">
                            <label>ENTER FRAGMENT 2:</label>
                            <input value={finalInput} onChange={e => setFinalInput(e.target.value)} className="flex-grow bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                            <button onClick={handleFinalVerify} className="border px-2 hover:bg-green-900">[VERIFY]</button>
                        </div>
                    </div>
                )}
            </AsciiBorder>
             {error && <p className="text-red-500 text-center animate-pulse">{error}</p>}
             {finalSolved && (
                 <div className="border-2 border-green-500 p-4 my-4 text-center">
                     <p className="text-xl text-cyan-400">✓ ALL CODE CHALLENGES SOLVED</p>
                     <pre className="text-green-400 my-4">
{`         ██████╗  ██████╗ ██╗
         ██╔══██╗██╔═══██╗██║
         ██████╔╝██║   ██║██║
         ██╔═══╝ ██║   ██║██║
         ██║     ╚██████╔╝███████╗
         ╚═╝      ╚═════╝ ╚══════╝`}
                     </pre>
                     <p>FRAGMENT 2: POL</p>
                     <p>VERIFICATION CODE: SP-193-BETA</p>
                     <p>DIFFICULTY: EXPERT</p>
                     <button onClick={onSolve} className="mt-4 border p-2 w-full hover:bg-green-900">[ CONTINUE TO PART 3 ] →</button>
                 </div>
            )}
        </div>
    );
};

const PuzzlePart3: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [answers, setAnswers] = useState(Array(10).fill(''));
    const [verifiedSteps, setVerifiedSteps] = useState(Array(10).fill(false));
    const [fragment3Code, setFragment3Code] = useState('');
    const [fragment3Solved, setFragment3Solved] = useState(false);
    const [masterKey, setMasterKey] = useState('');
    const [masterKeySolved, setMasterKeySolved] = useState(false);
    const [error, setError] = useState('');

    const updateAnswer = (index: number, value: string) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = value;
            return newAnswers;
        });
    };
    
    const verifyStep = (index: number, expectedAnswer?: string) => {
        setError('');
        const userAnswer = answers[index].trim();
        let isCorrect = false;
        if (expectedAnswer) {
            isCorrect = userAnswer.toLowerCase() === expectedAnswer.toLowerCase();
        } else {
            isCorrect = userAnswer !== '';
        }

        if(isCorrect) {
            setVerifiedSteps(prev => {
                const newSteps = [...prev];
                newSteps[index] = true;
                return newSteps;
            });
        } else {
            setError('ERROR: INVALID RESPONSE');
            setTimeout(() => setError(''), 2000);
        }
    }
    
    const verifyFragment3 = () => {
        setError('');
        if(fragment3Code.trim() === '-007') {
            setFragment3Solved(true);
        } else {
            setError('ERROR: INCORRECT FINAL CODE');
            setTimeout(() => setError(''), 2000);
        }
    }

    const activateProtocol = () => {
        setError('');
        if(masterKey.trim().toLowerCase() === 'cipherpol-007') {
            setMasterKeySolved(true);
        } else {
            setError('DECRYPTION FAILED. SYSTEM SECURITY ALERTED.');
        }
    }
    
    const allStepsVerified = verifiedSteps.every(v => v);

    const renderStep = (index: number, question: string, hint: string, expectedAnswer?: string, type: 'text' | 'char' | 'digit' | 'phrase' = 'text' ) => {
        const isVerified = verifiedSteps[index];
        const isPreviousVerified = index === 0 || verifiedSteps[index - 1];
        if(!isPreviousVerified) return null;

        let placeholder = "___________";
        if(type === 'char' || type === 'digit') placeholder = "_";

        return (
             <div className="mt-4">
                <h3 className="text-lg">STEP {index + 1} — {question}</h3>
                <p className="text-green-300 italic text-sm">{hint}</p>
                <div className="border border-[#00cc00] p-2 my-2 flex items-center gap-2">
                    <input value={answers[index]} onChange={e => updateAnswer(index, e.target.value)} disabled={isVerified} placeholder={placeholder} className="w-full bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                     <button onClick={() => verifyStep(index, expectedAnswer)} disabled={isVerified} className="border px-2 hover:bg-green-900">{isVerified ? '[VERIFIED]' : '[VERIFY]'}</button>
                </div>
            </div>
        )
    };
    

    return (
        <div className="p-2 md:p-4 text-sm md:text-base">
            <pre className="border-2 border-[#00cc00] p-2 text-[#00ffff]">
{`╔════════════════════════════════════════════════════════════════╗
║ █▓▒░ ACCESSING FILE: brainstorm_protocol_PART3.dat ░▒▓█       ║
║ STATUS: [███████░░░] 70% RECOVERED                             ║
║ WARNING: FRAGMENT CONTAINS BRAINSTORM MODULES                  ║
╚════════════════════════════════════════════════════════════════╝`}
            </pre>
            
            {!masterKeySolved && (
            <AsciiBorder title="BRAINSTORMING PROTOCOL MATRIX">
                {!fragment3Solved && (
                    <>
                        <p className="text-center">Answer each prompt. After all 10 are answered, collect characters from the specified answers to reveal the hidden final code.</p>
                        {renderStep(0, "CONTEXT IDENTIFICATION", "Name one high-level goal an organization should prioritize when designing a secure system (one word).")}
                        {renderStep(1, "SYMBOL FINDER", "What single punctuation symbol commonly separates prefixes from numeric codes (enter one character)?", "-","char")}
                        {renderStep(2, "NUMERIC CLUE (DIGIT)", "Which single digit commonly represents 'none' or 'zero' (enter one character)?", "0", "digit")}
                        {renderStep(3, "NUMERIC CLUE (DIGIT)", "Repeat the previous numeric clue — which digit represents 'empty' or 'off' (one character)?", "0", "digit")}
                        {renderStep(4, "LUCKY DIGIT", "Which single digit is commonly considered 'lucky' in many cultures (enter one character)?", "7", "digit")}
                        {renderStep(5, "ETHICS SNAPSHOT", "Give one short phrase (2–3 words) that captures the ethical principle designers should adopt when building security features.")}
                        {renderStep(6, "USABILITY FOCUS", "Name one quick change that improves security without hurting usability (one short phrase).")}
                        {renderStep(7, "THREAT MODEL", "In two words, describe the most important actor to consider when threat modeling.")}
                        {renderStep(8, "SIMPLE METRIC", "Give one concise metric (term) you could track to measure security posture.")}
                        {renderStep(9, "CREATIVE TAGLINE", "Give a short (≤4 words) inspirational tagline that could go on a security team's internal memo.")}
                    
                        {allStepsVerified && (
                             <div className="mt-6 border-t-2 border-dashed border-green-700 pt-4">
                                <h3 className="text-lg text-yellow-300">FINAL ASSEMBLY - EXTRACT THE SECRET</h3>
                                 <p className="text-green-300">TAKE:<br/>- Step 2 — the entire answer<br/>- Step 3 — the entire answer<br/>- Step 4 — the entire answer<br/>- Step 5 — the entire answer</p>
                                <div className="border border-[#00cc00] p-2 my-2 flex items-center gap-2">
                                     <label>ENTER FINAL CODE:</label>
                                     <input value={fragment3Code} onChange={e => setFragment3Code(e.target.value)} placeholder="____" className="w-full bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                                     <button onClick={verifyFragment3} className="border px-2 hover:bg-green-900">[VERIFY]</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {fragment3Solved && (
                    <div className="mt-6 border-t-2 border-dashed border-green-700 pt-4">
                        <p className="text-xl text-cyan-400 text-center">✓ FRAGMENT 3 RECOVERED: <span className="font-bold">-007</span></p>
                        <h3 className="text-lg text-yellow-300 mt-4">MASTER KEY ASSEMBLY</h3>
                        <p>Fragment 1: CIPHER</p>
                        <p>Fragment 2: POL</p>
                        <p>Fragment 3: -007</p>
                        <div className="border border-[#00cc00] p-2 my-2 space-y-2">
                             <label htmlFor="master_key">ENTER COMPLETE MASTER KEY:</label>
                             <input id="master_key" value={masterKey} onChange={e => setMasterKey(e.target.value)} placeholder="xxxxxxx-xxx" className="w-full bg-black border-b border-green-700 outline-none focus:border-cyan-400" />
                             <button onClick={activateProtocol} className="w-full border p-2 hover:bg-green-900">[ACTIVATE DECRYPTION PROTOCOL]</button>
                         </div>
                    </div>
                )}

            </AsciiBorder>
            )}

            {error && <p className="text-red-500 text-center animate-pulse">{error}</p>}

            {masterKeySolved && (
                 <div className="border-2 border-cyan-500 p-4 my-4 text-center">
                      <pre className="text-cyan-300 my-4 text-xs md:text-sm">
{`  ███████╗██╗   ██╗ ██████╗ ██████╗███████╗███████╗███████╗
  ██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
  ███████╗██║   ██║██║     ██║     █████╗  ███████╗███████╗
  ╚════██║██║   ██║██║     ██║     ██╔══╝  ╚════██║╚════██║
  ███████║╚██████╔╝╚██████╗╚██████╗███████╗███████║███████║
  ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝`}
                      </pre>
                     <p className="text-xl">MASTER DECRYPTION KEY: CIPHERPOL-007</p>
                     <p className="my-4">Mission Status: COMPLETE</p>
                     <p>You may now proceed.</p>
                     <button onClick={onComplete} className="mt-4 border p-2 w-full hover:bg-cyan-700">[ PROCEED TO FINAL MISSION ] →</button>
                 </div>
            )}
        </div>
    );
};


const FileDirectoryPage: React.FC<{ onReset: () => void }> = ({ onReset }) => {
    const [stage, setStage] = useState('landing'); // landing, part1, part2, part3

    const renderContent = () => {
        switch(stage) {
            case 'part1':
                return <PuzzlePart1 onSolve={() => setStage('part2')} />;
            case 'part2':
                return <PuzzlePart2 onSolve={() => setStage('part3')} />;
            case 'part3':
                return <PuzzlePart3 onComplete={onReset} />; // Reset simulation on completion
            case 'landing':
            default:
                return <PuzzleLanding onNavigate={(part) => setStage(part)} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-black text-[#00ff00] font-mono relative z-0">
            <MatrixRain />
            <main className="max-w-4xl mx-auto p-2 md:p-4 relative z-10">
                {renderContent()}
            </main>
        </div>
    );
};

export default FileDirectoryPage;