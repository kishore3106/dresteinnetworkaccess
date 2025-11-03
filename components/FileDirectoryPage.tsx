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

// A new, standardized, and beautifully styled PuzzleInput component.
const PuzzleInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    onVerify: () => void;
    disabled?: boolean;
    buttonText?: string;
    maxLength?: number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange, onVerify, disabled = false, buttonText = '[VERIFY]', maxLength, onKeyDown }) => (
    <div className="border border-green-700 p-3 my-4 flex items-center gap-4 bg-black/30">
        <label htmlFor={`puzzle-input-${label}`} className="text-green-400 whitespace-nowrap">{label}</label>
        <input
            id={`puzzle-input-${label}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            maxLength={maxLength}
            onKeyDown={onKeyDown}
            className="flex-grow bg-transparent border-b-2 border-green-700 focus:border-cyan-400 outline-none px-2"
            autoFocus={!disabled}
        />
        <button
            onClick={onVerify}
            disabled={disabled}
            className="border border-green-500 px-4 py-1 text-green-400 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
            {buttonText}
        </button>
    </div>
);


// --- PUZZLE STAGE COMPONENTS ---

const PuzzleLanding: React.FC<{ onNavigate: (stage: string) => void, recoveredFragments: Record<string, boolean> }> = ({ onNavigate, recoveredFragments }) => {
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
-rwxr-x--- 1 root shadow   9284 May 21 14:17 access_codes_PART3.dat

[WARNING] Files partially corrupted. Click to attempt recovery...
`}
                </pre>
                 <div className="flex flex-col md:flex-row gap-4 mt-4">
                     <button onClick={() => onNavigate('part1')} className={`flex-1 p-4 border ${recoveredFragments.part1 ? 'border-gray-500 text-gray-500' : 'border-green-500 hover:bg-green-900'} text-center`} disabled={recoveredFragments.part1}>
                         <p>[ {recoveredFragments.part1 ? 'RECOVERED' : 'CLICK HERE: RECOVER'} ]</p>
                         <p className="font-bold">PART 1</p>
                    </button>
                     <button onClick={() => onNavigate('part2')} className={`flex-1 p-4 border ${recoveredFragments.part2 ? 'border-gray-500 text-gray-500' : 'border-green-500 hover:bg-green-900'} text-center`} disabled={recoveredFragments.part2}>
                         <p>[ {recoveredFragments.part2 ? 'RECOVERED' : 'CLICK HERE: RECOVER'} ]</p>
                         <p className="font-bold">PART 2</p>
                    </button>
                     <button onClick={() => onNavigate('part3')} className={`flex-1 p-4 border ${recoveredFragments.part3 ? 'border-gray-500 text-gray-500' : 'border-green-500 hover:bg-green-900'} text-center`} disabled={recoveredFragments.part3}>
                         <p>[ {recoveredFragments.part3 ? 'RECOVERED' : 'CLICK HERE: RECOVER'} ]</p>
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
                correct = userInput === 'encrypt';
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
            onSolve();
        } else {
            setError('ERROR: INCORRECT FRAGMENT - TRY AGAIN');
            setTimeout(() => setError(''), 2000);
        }
    }
    
    const allCluesCollected = step1Solved && step2Solved && step3Solved && step4Solved;
    
    if (finalSolved) {
        return (
            <div className="p-2 md:p-4">
                 <pre className="text-sm md:text-base border-2 border-[#00cc00] p-4 text-[#00ffff]">
{`╔══════════════════════════════════════════════════════════╗
║  ✓ ALL CLUES DECODED                                     ║
║  ✓ ENCRYPTION PROTOCOLS VERIFIED                         ║
║                                                          ║
║    ██████╗ ██╗██████╗ ██╗  ██╗███████╗██████╗             ║
║   ██╔════╝ ██║██╔══██╗██║  ██║██╔════╝██╔══██╗            ║
║   ██║      ██║██████╔╝███████║█████╗  ██████╔╝            ║
║   ██║      ██║██╔═══╝ ██╔══██║██╔══╝  ██╔█╔═╝             ║
║   ╚██████╗ ██║██║     ██║  ██║███████╗██║ █║               ║
║    ╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝╚═╝                ║
║                                                          ║
║  FRAGMENT 1: CIPHER                                      ║
║  STATUS: SECURED                                         ║
║  VERIFICATION CODE: EK-451-ALPHA                         ║
║                                                          ║
║  Progress: 1/3 fragments recovered                       ║
║  Returning to file directory...                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`}
                 </pre>
            </div>
        )
    }

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
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                {/* STEPS */}
                <div className={activeStep !== 1 ? 'opacity-50' : ''}>
                    <h3 className="text-lg">STEP 1: CRYPTOGRAPHIC DATABASE SEARCH</h3>
                    <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> ENCODED MESSAGE FOUND: "VGhlIGZpcnN0IGNsdWUgaXMgRU5DUllQVA=="\n> ACTION REQUIRED: Decode the Base64 string`}
                    </p>
                    <PuzzleInput 
                        label="Decoded:"
                        value={stepInput}
                        onChange={setStepInput}
                        onVerify={() => verifyStep(1)}
                        onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(1); }}
                        disabled={step1Solved}
                        buttonText={step1Solved ? '[VERIFIED]' : '[VERIFY]'}
                    />
                </div>

                {step1Solved && (
                    <div className={activeStep !== 2 ? 'opacity-50' : ''}>
                        <h3 className="text-lg mt-4">STEP 2: HASH CRACKING</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> HASH VALUE: 098f6bcd4621d373cade4e832627b4f6\n> ACTION: Use MD5 cracker to find plaintext`}
                        </p>
                        <PuzzleInput 
                           label="Cracked:"
                           value={stepInput}
                           onChange={setStepInput}
                           onVerify={() => verifyStep(2)}
                           onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(2); }}
                           disabled={step2Solved}
                           buttonText={step2Solved ? '[VERIFIED]' : '[VERIFY]'}
                        />
                    </div>
                )}
                
                {step2Solved && (
                     <div className={activeStep !== 3 ? 'opacity-50' : ''}>
                        <h3 className="text-lg mt-4">STEP 3: CIPHER WHEEL ANALYSIS</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> ENCODED TEXT: "FRPERG PBQR"\n> ACTION: Decode using ROT13`}
                        </p>
                        <PuzzleInput 
                           label="ROT13:"
                           value={stepInput}
                           onChange={setStepInput}
                           onVerify={() => verifyStep(3)}
                           onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(3); }}
                           disabled={step3Solved}
                           buttonText={step3Solved ? '[VERIFIED]' : '[VERIFY]'}
                        />
                    </div>
                )}

                {step3Solved && (
                     <div className={activeStep !== 4 ? 'opacity-50' : ''}>
                        <h3 className="text-lg mt-4">STEP 4: HEXADECIMAL TRACE</h3>
                        <p className="border-t border-dashed border-green-800 pt-2 mt-2 text-green-300">
                        {`> HEX DATA: 4B 45 59 57 4F 52 44\n> ACTION: Convert hex to ASCII`}
                        </p>
                        <PuzzleInput 
                           label="ASCII:"
                           value={stepInput}
                           onChange={setStepInput}
                           onVerify={() => verifyStep(4)}
                           onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(4); }}
                           disabled={step4Solved}
                           buttonText={step4Solved ? '[VERIFIED]' : '[VERIFY]'}
                        />
                    </div>
                )}
            </AsciiBorder>
            
            {allCluesCollected && (
                 <AsciiBorder title="FINAL DECRYPTION">
                    <p className="text-center">Synthesize the recovered keywords to form the final data fragment.</p>
                    <p className="text-center text-cyan-400 my-2 text-xl">
                        ENCRYPT + TEST + SECRET CODE + KEYWORD = ???
                    </p>
                    <PuzzleInput 
                       label="Fragment 1:"
                       value={finalInput}
                       onChange={setFinalInput}
                       onVerify={verifyFinal}
                       onKeyDown={(e) => { if (e.key === 'Enter') verifyFinal(); }}
                       buttonText='[SUBMIT]'
                    />
                </AsciiBorder>
            )}
        </div>
    );
}

const PuzzlePart2: React.FC<{ onSolve: () => void }> = ({ onSolve }) => {
    // State for each step's solution status
    const [step1Solved, setStep1Solved] = useState(false);
    const [step2Solved, setStep2Solved] = useState(false);
    const [step3Solved, setStep3Solved] = useState(false);
    const [step4Solved, setStep4Solved] = useState(false);
    const [step5Solved, setStep5Solved] = useState(false);

    // State for the final puzzle solution
    const [finalSolved, setFinalSolved] = useState(false);

    // Current step the user is on
    const [activeStep, setActiveStep] = useState(1);

    // Input for the current step/final puzzle
    const [currentInput, setCurrentInput] = useState('');
    const [error, setError] = useState('');

    const verifyStep = (step: number) => {
        setError('');
        const userInput = currentInput.trim().toLowerCase();
        let correctAnswer = '';

        switch (step) {
            case 1: correctAnswer = 'pol'; break;
            case 2: correctAnswer = '1'; break;
            case 3: correctAnswer = '6'; break;
            case 4: correctAnswer = 'g'; break;
            case 5: correctAnswer = '6'; break;
        }

        if (userInput === correctAnswer) {
            switch(step) {
                case 1: setStep1Solved(true); break;
                case 2: setStep2Solved(true); break;
                case 3: setStep3Solved(true); break;
                case 4: setStep4Solved(true); break;
                case 5: setStep5Solved(true); break;
            }
            setActiveStep(prev => prev + 1);
            setCurrentInput('');
        } else {
            setError('INCORRECT. ANALYSIS FAILED.');
            setTimeout(() => setError(''), 2000);
        }
    };
    
    const verifyFinal = () => {
        setError('');
        if (currentInput.trim().toLowerCase() === 'pol') {
            setFinalSolved(true);
            onSolve();
        } else {
            setError('ERROR: INCORRECT FRAGMENT - SYSTEM LOCKOUT IMMINENT');
            setTimeout(() => setError(''), 2000);
        }
    }
    
    // The final solved screen
    if (finalSolved) {
        return (
            <div className="p-2 md:p-4">
                 <pre className="text-sm md:text-base border-2 border-[#00cc00] p-4 text-[#00ffff]">
{`╔══════════════════════════════════════════════════════════╗
║  ✓ CODE ANALYSIS COMPLETE                                ║
║  ✓ ALL ALGORITHMS VERIFIED                               ║
║                                                          ║
║         ██████╗  ██████╗ ██╗                             ║
║         ██╔══██╗██╔═══██╗██║                             ║
║         ██████╔╝██║   ██║██║                             ║
║         ██╔═══╝ ██║   ██║██║                             ║
║         ██║     ╚██████╔╝███████╗                        ║
║         ╚═╝      ╚═════╝ ╚══════╝                        ║
║                                                          ║
║  FRAGMENT 2: POL                                         ║
║  STATUS: SECURED                                         ║
║  VERIFICATION CODE: SP-193-BETA                          ║
║                                                          ║
║  Progress: 2/3 fragments recovered                       ║
║  Returning to file directory...                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`}
                 </pre>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-4 text-sm md:text-base">
            <pre className="border-2 border-[#00cc00] p-2 text-[#00ffff]">
{`╔════════════════════════════════════════════════════════════════╗
║ █▓▒░ ACCESSING FILE: security_protocol_PART2.dat ░▒▓█         ║
║ STATUS: [██████░░░░] 60% RECOVERED                             ║
║ WARNING: SEVERE DATA CORRUPTION                                ║
╚════════════════════════════════════════════════════════════════╝`}
            </pre>
            <pre className="mt-4">
{`[CRITICAL ERROR - PROGRAMMING ANALYSIS REQUIRED]
════════════════════════════════════════════════════════════════`}
            </pre>
            {error && <p className="text-red-500 text-center my-2 animate-pulse">{error}</p>}

            {/* Step 1 */}
            <div className={activeStep === 1 ? '' : 'opacity-40'}>
                <pre className="whitespace-pre-wrap">
{`
█▓▒░ STEP 1: CODE COMPILATION ANALYSIS ░▒▓█

> OBJECTIVE: Analyze the following C code snippet
> TASK: Predict the output without running it

CODE FRAGMENT:
\`\`\`c
#include <stdio.h>
int main() {
    int x = 80;
    int y = 79;
    int z = 76;
    printf("%c%c%c", x, y, z);
    return 0;
}
\`\`\`

> ACTION: What does this program print?`}
                </pre>
                <PuzzleInput label="Output:" value={currentInput} onChange={setCurrentInput} onVerify={() => verifyStep(1)} onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(1); }} disabled={activeStep !== 1} />
            </div>

            {/* Step 2 */}
            {step1Solved && <div className={activeStep === 2 ? '' : 'opacity-40'}>
                <pre className="whitespace-pre-wrap">
{`════════════════════════════════════════════════════════════════
█▓▒░ STEP 2: LOGIC GATE SIMULATION [UNLOCKED] ░▒▓█

> INTELLIGENCE: Target uses Boolean logic for verification
> CIRCUIT DIAGRAM FOUND:

INPUT A = 1 (TRUE)
INPUT B = 0 (FALSE)  
INPUT C = 1 (TRUE)

LOGIC OPERATIONS:
X = A AND B
Y = NOT X
Z = Y OR C

> TASK: Calculate final output Z`}
                </pre>
                <PuzzleInput label="Value of Z (0 or 1):" value={currentInput} onChange={setCurrentInput} onVerify={() => verifyStep(2)} onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(2); }} disabled={activeStep !== 2} maxLength={1}/>
            </div>}
            
            {/* Step 3 */}
            {step2Solved && <div className={activeStep === 3 ? '' : 'opacity-40'}>
                <pre className="whitespace-pre-wrap">
{`════════════════════════════════════════════════════════════════
█▓▒░ STEP 3: ALGORITHM TRACE [UNLOCKED] ░▒▓█

> INTERCEPTED: Sorting algorithm execution trace
> CODE SNIPPET:
\`\`\`c
int arr[] = {3, 1, 4, 1, 5};
// After mysterious sorting algorithm
// Result: {1, 1, 3, 4, 5}
\`\`\`

> QUESTION: How many SWAP operations were performed?
> Use Bubble Sort logic to determine`}
                </pre>
                 <PuzzleInput label="Number of swaps:" value={currentInput} onChange={setCurrentInput} onVerify={() => verifyStep(3)} onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(3); }} disabled={activeStep !== 3} />
            </div>}
            
            {/* Step 4 */}
            {step3Solved && <div className={activeStep === 4 ? '' : 'opacity-40'}>
                 <pre className="whitespace-pre-wrap">
{`════════════════════════════════════════════════════════════════
█▓▒░ STEP 4: POINTER ARITHMETIC [UNLOCKED] ░▒▓█

> ADVANCED C ANALYSIS
> CODE FRAGMENT:
\`\`\`c
#include <stdio.h>
int main() {
    char str[] = "PROGRAM";
    char *ptr = str;
    ptr += 3;
    printf("%c", *ptr);
    return 0;
}
\`\`\`
> TASK: What character is printed?`}
                </pre>
                <PuzzleInput label="Character printed:" value={currentInput} onChange={setCurrentInput} onVerify={() => verifyStep(4)} onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(4); }} disabled={activeStep !== 4} maxLength={1} />
            </div>}

            {/* Step 5 */}
            {step4Solved && <div className={activeStep === 5 ? '' : 'opacity-40'}>
                 <pre className="whitespace-pre-wrap">
{`════════════════════════════════════════════════════════════════
█▓▒░ STEP 5: BITWISE OPERATION [UNLOCKED] ░▒▓█

> FINAL VERIFICATION: Bitwise XOR challenge
> CODE:
\`\`\`c
int a = 5;    // Binary: 0101
int b = 3;    // Binary: 0011
int result = a ^ b;  // XOR operation
printf("%d", result);
\`\`\`
> TASK: Calculate the result of XOR operation`}
                </pre>
                <PuzzleInput label="XOR result:" value={currentInput} onChange={setCurrentInput} onVerify={() => verifyStep(5)} onKeyDown={(e) => { if (e.key === 'Enter') verifyStep(5); }} disabled={activeStep !== 5} />
            </div>}

            {/* Final Assembly */}
            {step5Solved && <div>
                <pre className="whitespace-pre-wrap">
{`════════════════════════════════════════════════════════════════
█▓▒░ FINAL ASSEMBLY - DECODE THE FRAGMENT ░▒▓█

COLLECTED DATA FROM ALL STEPS:

STEP 1 Output: POL
STEP 2 Result: 1
STEP 3 Swaps: 6
STEP 4 Character: G
STEP 5 XOR Result: 6

DECRYPTION PROTOCOL:
"If step 1 output was correct, what 3-letter word did you find?"
`}
                </pre>
                <PuzzleInput 
                    label="Fragment 2 (3 letters):"
                    value={currentInput}
                    onChange={setCurrentInput}
                    onVerify={verifyFinal}
                    onKeyDown={(e) => { if (e.key === 'Enter') verifyFinal(); }}
                    maxLength={3}
                />
            </div>}
        </div>
    );
}


const PuzzlePart3: React.FC<{ onSolve: () => void }> = ({ onSolve }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));
    const [currentInput, setCurrentInput] = useState('');
    const [error, setError] = useState('');
    const [finalSolved, setFinalSolved] = useState(false);

    const questions = [
        { title: "SECURITY PRINCIPLE", question: 'What 2-3 word phrase describes designing security from the start?\n(Hint: "___ by Design")', label: "Answer:" },
        { title: "AUTHENTICATION", question: 'What authentication method uses something you ARE (fingerprint, face)?', label: "Answer:" },
        { title: "ENCRYPTION", question: "What does AES stand for? (Full form, 3 words)", label: "Answer:" },
        { title: "ZERO-DAY", question: 'Complete the term: "____-day vulnerability"\n(What number describes unknown exploits with no advance warning?)', label: "Answer (word or digit):" },
        { title: "NETWORK SECURITY", question: 'What 3-letter acronym protects your network traffic when using public WiFi?\n(Virtual Private ___)', label: "Answer (3 letters):" },
        { title: "ZERO TRUST", question: 'In "Zero Trust Security", how many entities are trusted by default?', label: "Answer (number):" },
        { title: "CRYPTOGRAPHY", question: "What does CIA Triad stand for in security?\n(Three words: C___, I___, A___)", label: "Answer:" },
        { title: "INCIDENT RESPONSE", question: "What is the first phase of incident response?\n(Hint: Starts with P)", label: "Answer:" },
        { title: "MALWARE", question: "What type of malware disguises itself as legitimate software?\n(Named after a Greek war story)", label: "Answer:" },
        { title: "OSI MODEL", question: "In the OSI model, which layer number is the Application layer?", label: "Answer (number):" },
    ];

    const verifyStep = (stepIndex: number) => {
        setError('');
        const userInput = currentInput.trim().toLowerCase();
        if (userInput.length === 0) {
            setError('INPUT REQUIRED.');
            setTimeout(() => setError(''), 2000);
            return;
        }

        let isCorrect = false;
        switch (stepIndex) {
            case 0: isCorrect = userInput.includes('by design') || userInput.includes('by default'); break;
            case 1: isCorrect = userInput.includes('biometric'); break;
            case 2: isCorrect = userInput === 'advanced encryption standard'; break;
            case 3: isCorrect = userInput === '0' || userInput === 'zero'; break;
            case 4: isCorrect = userInput === 'vpn'; break;
            case 5: isCorrect = userInput === '0' || userInput === 'zero' || userInput === 'none'; break;
            case 6: isCorrect = userInput.includes('confidentiality') && userInput.includes('integrity') && userInput.includes('availability'); break;
            case 7: isCorrect = userInput === 'preparation' || userInput === 'prepare'; break;
            case 8: isCorrect = userInput === 'trojan' || userInput === 'trojan horse'; break;
            case 9: isCorrect = userInput === '7' || userInput === 'seven'; break;
            default: break;
        }

        if (isCorrect) {
            const newAnswers = [...answers];
            newAnswers[stepIndex] = currentInput.trim();
            setAnswers(newAnswers);
            setActiveStep(prev => prev + 1);
            setCurrentInput('');
        } else {
            setError('INCORRECT DATA. RE-EVALUATE.');
            setTimeout(() => setError(''), 2500);
        }
    };
    
    const verifyFinal = () => {
        setError('');
        if (currentInput.trim() === "-007") {
            setFinalSolved(true);
            onSolve();
        } else {
            setError('FINAL CODE INCORRECT. DECRYPTION FAILED.');
            setTimeout(() => setError(''), 2500);
        }
    };

    if (finalSolved) {
        return (
             <div className="p-2 md:p-4">
                 <pre className="text-sm md:text-base border-2 border-[#00cc00] p-4 text-[#00ffff]">
{`╔══════════════════════════════════════════════════════════╗
║  ✓ BRAINSTORM ANALYSIS COMPLETE                          ║
║  ✓ CREATIVE PROTOCOLS VERIFIED                           ║
║                                                          ║
║        ███████╗  ██████╗  ██████╗ ███████╗               ║
║        ╚══════╝ ██╔═████╗██╔═████╗╚════██║               ║
║        ███████╗ ██║██╔██║██║██╔██║    ██╔╝               ║
║        ╚══════╝ ████╔╝██║████╔╝██║   ██╔╝                ║
║                 ╚██████╔╝╚██████╔╝   ██║                 ║
║                  ╚═════╝  ╚═════╝    ╚═╝                 ║
║                                                          ║
║  FRAGMENT 3: -007                                        ║
║  STATUS: SECURED                                         ║
║  VERIFICATION CODE: BP-777-GAMMA                         ║
║                                                          ║
║  Progress: 3/3 fragments recovered                       ║
║  Returning to file directory...                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`}
                 </pre>
            </div>
        )
    }
    
    const SecurityQuestionStep: React.FC<{ step: number; title: string; question: string; label: string; }> = ({ step, title, question, label }) => (
        <div className={activeStep === step ? '' : 'opacity-40'}>
            <pre className="whitespace-pre-wrap mt-4">
{`█▓▒░ QUESTION ${step}: ${title} ░▒▓█

${question}`}
            </pre>
            <PuzzleInput
                label={label}
                value={currentInput}
                onChange={setCurrentInput}
                onVerify={() => verifyStep(step - 1)}
                disabled={activeStep !== step}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); verifyStep(step - 1); } }}
            />
        </div>
    );

    return (
        <div className="p-2 md:p-4 text-sm md:text-base">
            <pre className="border-2 border-[#00cc00] p-2 text-[#00ffff]">
{`╔════════════════════════════════════════════════════════════════╗
║ █▓▒░ ACCESSING FILE: access_codes_PART3.dat ░▒▓█              ║
║ STATUS: [███████░░░] 70% RECOVERED                             ║
║ FINAL FRAGMENT - ANALYST ASSESSMENT PROTOCOL                   ║
╚════════════════════════════════════════════════════════════════╝`}
            </pre>
            <pre className="mt-4 whitespace-pre-wrap">
{`[SECURITY INTELLIGENCE EVALUATION - 10 QUESTIONS]
════════════════════════════════════════════════════════════════`}
            </pre>
            {error && <p className="text-red-500 text-center my-2 animate-pulse">{error}</p>}
            
            {questions.map((q, i) => (
                activeStep > i && <SecurityQuestionStep key={i} step={i + 1} {...q} />
            ))}

            {activeStep > 10 && <div>
                <pre className="whitespace-pre-wrap mt-4">
{`█▓▒░ FRAGMENT DECRYPTION PROTOCOL ░▒▓█

ALL QUESTIONS ANSWERED. EXTRACTING HIDDEN PATTERN...

DECODING METHOD:
────────────────
> Isolate the answers from the number-related questions.

> Q4: Zero-day vulnerability → Answer: "0"
> Q6: Zero Trust entities → Answer: "0"
> Q10: OSI Application layer → Answer: "7"

> ASSEMBLE THE FRAGMENT.
> Format hint: -XXX (dash and three digits)`}
                </pre>
                 <PuzzleInput 
                    label="Final Code:"
                    value={currentInput}
                    onChange={setCurrentInput}
                    onVerify={verifyFinal}
                    maxLength={4}
                    onKeyDown={(e) => { if (e.key === 'Enter') verifyFinal() }}
                 />
            </div>}

        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

const FileDirectoryPage: React.FC<{ onReset: () => void }> = ({ onReset }) => {
    const [stage, setStage] = useState('landing');
    const [recoveredFragments, setRecoveredFragments] = useState({
        part1: false,
        part2: false,
        part3: false,
    });

    const handleSolve = (part: 'part1' | 'part2' | 'part3') => {
        setRecoveredFragments(prev => ({ ...prev, [part]: true }));
        setTimeout(() => {
            setStage('landing');
        }, 3000);
    };

    const allRecovered = recoveredFragments.part1 && recoveredFragments.part2 && recoveredFragments.part3;

    const renderStage = () => {
        if (allRecovered) {
             return (
                <div className="p-4">
                    <AsciiBorder title="SYSTEM RECOVERY COMPLETE">
                         <TypingLine text="> All fragments recovered. Assembling master file..." onFinished={() => {}} speed={50}/>
                         <pre className="text-green-400 mt-4 text-center text-xl">
{`
  ██████╗  █████╗ ███████╗███████╗██████╗ 
 ██╔════╝ ██╔══██╗██╔════╝██╔════╝██╔══██╗
 ██║  ███╗███████║█████╗  █████╗  ██████╔╝
 ██║   ██║██╔══██║██╔══╝  ██╔══╝  ██╔══██╗
 ╚██████╔╝██║  ██║███████╗███████╗██║  ██║
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
`}
                        </pre>
                        <p className="text-center text-2xl mt-4">FINAL FRAGMENT: <span className="text-cyan-400">CIPHER-POL--007</span></p>
                        <p className="text-center mt-2">You have successfully bypassed the Drestien Network security.</p>
                        <div className="text-center mt-8">
                            <button onClick={onReset} className="p-2 border border-red-500 text-red-500 hover:bg-red-900">[ END SIMULATION ]</button>
                        </div>
                   </AsciiBorder>
                </div>
            );
        }

        switch (stage) {
            case 'landing':
                return <PuzzleLanding onNavigate={setStage} recoveredFragments={recoveredFragments}/>;
            case 'part1':
                return <PuzzlePart1 onSolve={() => handleSolve('part1')} />;
            case 'part2':
                return <PuzzlePart2 onSolve={() => handleSolve('part2')} />;
            case 'part3':
                return <PuzzlePart3 onSolve={() => handleSolve('part3')} />;
            default:
                return <div>Error: Unknown stage</div>;
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto">
            <MatrixRain />
            {renderStage()}
        </div>
    );
};

export default FileDirectoryPage;