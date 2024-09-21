

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import LottieAnimation from './LottieAnimation';
// import './Homepage.css';

// export default function Homepage() {
//     const [text, setText] = useState("");
//     const [corrections, setCorrections] = useState([]);
//     const [correctedText, setCorrectedText] = useState("");
//     const [isListening, setIsListening] = useState(false);

//     useEffect(() => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//         if (SpeechRecognition) {
//             const recognition = new SpeechRecognition();
//             recognition.onstart = () => {
//                 console.log("Microphone is on.");
//                 setIsListening(true);
//             };
//             recognition.onresult = (event) => {
//                 const spokenText = event.results[0][0].transcript;
//                 console.log("Captured speech:", spokenText);
//                 setText(spokenText);
//                 checkGrammar(spokenText);
//             };
//             recognition.onend = () => {
//                 console.log("Speech recognition ended.");
//                 setIsListening(false);
//             };

//             window.recognition = recognition;
//         } else {
//             console.error("SpeechRecognition API is not supported in this browser.");
//         }
//     }, []);

//     const startListening = () => {
//         console.log("Starting speech recognition...");
//         if (window.recognition) {
//             window.recognition.start();
//         } else {
//             alert("Speech Recognition is not supported in this browser.");
//         }
//     };

//     const checkGrammar = async (textToCheck) => {
//       const formattedText = textToCheck.charAt(0).toUpperCase() + textToCheck.slice(1);
//       console.log("Sending request to backend to check grammar with formatted text:", formattedText);
//       try {
//           const response = await axios.post("https://spoke-person.vercel.app/check_grammar", {
//               text: formattedText,
//           });
  
//           console.log("Response from backend:", response.data);
  
//           if (response.data.corrections.length === 0) {
//               setCorrections([{ mistake: "No mistakes found", correction: "Your sentence is correct!" }]);
//               speakText("Good, your line is correct!");
//           } else {
//               setCorrections(response.data.corrections);
//               setCorrectedText(response.data.correctedText);
//               speakText(`Your line is wrong. The correct sentence is: ${response.data.correctedText}`);
//           }
//       } catch (error) {
//           console.error("Error checking grammar:", error);
//       }
//   };
  
  

//     const speakText = (text) => {
//         console.log("Speaking corrected text:", text);
//         const utterance = new SpeechSynthesisUtterance(text);
//         window.speechSynthesis.speak(utterance);
//     };

//     return (
//         <div style={{ padding: '10px' }}>
//             <button onClick={startListening}>Speak</button>
//             <p>Captured Text: {text}</p>
//             <input
//                 type="text"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Type your sentence here"
//             />
//             <button onClick={() => checkGrammar(text)}>Check Grammar</button>

//             {corrections.length > 0 && (
//                 <div>
//                     <h3>Corrections:</h3>
//                     <ul>
//                         {corrections.map((correction, index) => (
//                             <li key={index}>
//                                 Mistake: {correction.mistake} --- Suggestion: {correction.correction}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {correctedText && (
//                 <div>
//                     <h3>Corrected Sentence:</h3>
//                     <p>{correctedText}</p>
//                 </div>
//             )}
//                         <LottieAnimation isListening={isListening} />

//         </div>
//     );
// }








import React, { useState, useEffect } from "react";
import axios from "axios";
import LottieAnimation from './LottieAnimation';
import Registration from './Registration'; // Import the Registration component
import './Homepage.css';

export default function Homepage() {
    const [text, setText] = useState("");
    const [corrections, setCorrections] = useState([]);
    const [correctedText, setCorrectedText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isContinuousSpeaking, setIsContinuousSpeaking] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [nameDisplay, setNameDisplay] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const name = "Brahma";

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.onstart = () => {
                console.log("Microphone is on.");
                setIsListening(true);
            };
            recognition.onresult = (event) => {
                const spokenText = event.results[0][0].transcript;
                console.log("Captured speech:", spokenText);
                setText(spokenText);
                checkGrammar(spokenText);
            };
            recognition.onend = () => {
                console.log("Speech recognition ended.");
                setIsListening(false);
                if (isContinuousSpeaking) {
                    recognition.start();
                }
            };

            window.recognition = recognition;
        } else {
            console.error("SpeechRecognition API is not supported in this browser.");
        }

        if (!hasGreeted) {
            speakText("Hi, welcome to the application!");
            setHasGreeted(true);
        }

        let index = 0;
        setNameDisplay("");
        const typingEffect = setInterval(() => {
            if (index < name.length) {
                setNameDisplay((prev) => prev + name[index]);
                index++;
            } else {
                clearInterval(typingEffect);
            }
        }, 200);

        return () => clearInterval(typingEffect);
    }, [hasGreeted, name]);

    const startListening = () => {
        console.log("Starting speech recognition...");
        if (window.recognition && !isListening) {
            window.recognition.start();
        }
    };

    const checkGrammar = async (textToCheck) => {
        const formattedText = textToCheck.charAt(0).toUpperCase() + textToCheck.slice(1);
        console.log("Sending request to backend to check grammar with formatted text:", formattedText);
        try {
            const response = await axios.post("https://spoke-person.vercel.app/check_grammar", {
                text: formattedText,
            });

            console.log("Response from backend:", response.data);

            if (response.data.corrections.length === 0) {
                setCorrections([{ mistake: "No mistakes found", correction: "Your sentence is correct!" }]);
                speakText("Good, your line is correct!");
            } else {
                setCorrections(response.data.corrections);
                setCorrectedText(response.data.correctedText);
                speakText(`Your line is wrong. The correct sentence is: ${response.data.correctedText}`);
            }
        } catch (error) {
            console.error("Error checking grammar:", error);
        }
    };

    const speakText = (text) => {
        console.log("Speaking:", text);
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const toggleContinuousSpeaking = () => {
        setIsContinuousSpeaking((prev) => !prev);
        if (!isContinuousSpeaking) {
            startListening();
            speakText(correctedText || text);
        } else {
            window.speechSynthesis.cancel();
            if (window.recognition) {
                window.recognition.stop();
            }
        }
    };

    const handleRegister = () => {
        setIsRegistered(true); // Set registration status
    };

    return (
        <div style={{ padding: '10px', textAlign: 'center' }}>
            {isRegistered ? ( // Check if the user is registered
                <>
                    <h1>{nameDisplay}</h1>
                    <button onClick={startListening}>Speak</button>
                    <button onClick={toggleContinuousSpeaking}>
                        {isContinuousSpeaking ? "Stop Speaking" : "Continuous Speak"}
                    </button>
                    <p>Captured Text: {text}</p>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your sentence here"
                    />
                    <button onClick={() => checkGrammar(text)}>Check Grammar</button>

                    {corrections.length > 0 && (
                        <div>
                            <h3>Corrections:</h3>
                            <ul>
                                {corrections.map((correction, index) => (
                                    <li key={index}>
                                        Mistake: {correction.mistake} --- Suggestion: {correction.correction}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {correctedText && (
                        <div>
                            <h3>Corrected Sentence:</h3>
                            <p>{correctedText}</p>
                        </div>
                    )}
                    <LottieAnimation isListening={isListening} />
                </>
            ) : (
                <Registration onRegister={handleRegister} /> // Render Registration component
            )}
        </div>
    );
}
