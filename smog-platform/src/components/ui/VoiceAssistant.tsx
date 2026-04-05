"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported
    if ("window" in globalThis && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleQuery(text);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setResponse("Sorry, I couldn't hear that. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleQuery = (query: string) => {
    const q = query.toLowerCase();
    let reply = "I'm not sure about that. Try asking about smog, AQI, or ozone.";

    if (q.includes("what is") && q.includes("smog")) {
      reply = "Photochemical smog is a mixture of pollutants that form when nitrogen oxides and volatile organic compounds react in the presence of sunlight, creating ground-level ozone.";
    } else if (q.includes("aqi") || q.includes("air quality")) {
      reply = "AQI stands for Air Quality Index. It runs from 0 to 500. The higher the AQI value, the greater the level of air pollution and the greater the health concern.";
    } else if (q.includes("delhi") || q.includes("india")) {
      reply = "Delhi experiences severe smog largely due to vehicle emissions, industrial pollution, and crop stubble burning in neighboring states during winter.";
    } else if (q.includes("fix") || q.includes("solution")) {
      reply = "We can reduce smog by transitioning to electric vehicles, expanding green cover, and implementing strict industrial emission standards.";
    } else if (q.includes("ozone")) {
      reply = "Ground-level ozone is the primary component of photochemical smog. Unlike the protective stratospheric ozone layer, ground-level ozone is toxic to humans and plants.";
    } else if (q.includes("health") || q.includes("dangerous")) {
      reply = "Smog can irritate your eyes, nose, and throat, trigger asthma attacks, and cause long-term respiratory diseases and cardiovascular issues.";
    }

    setResponse(reply);
    
    // Check if voice synthesis is supported and speak the response
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setResponse("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        setResponse("Microphone access is not supported on this device.");
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-80 p-4 rounded-2xl glass-strong border border-neon-cyan/30 shadow-2xl shadow-neon-cyan/20 origin-bottom-right"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-sm flex items-center gap-2" style={{ fontFamily: "Outfit" }}>
                  <span className="text-neon-cyan">🎙️ SmogIQ Voice</span>
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-foreground">✕</button>
              </div>

              <div className="space-y-4">
                <div className="h-24 overflow-y-auto bg-black/20 rounded-lg p-3 text-sm">
                  {transcript ? (
                    <div className="mb-2 text-foreground/70">
                      <strong>You:</strong> &quot;{transcript}&quot;
                    </div>
                  ) : (
                    <div className="text-foreground/40 italic flex items-center gap-2">
                      Try asking: &quot;What is smog?&quot; or &quot;How to fix pollution?&quot;
                    </div>
                  )}
                  {response && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neon-cyan">
                      <strong>SmogIQ:</strong> {response}
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={toggleListening}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isListening
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20"
                  }`}
                >
                  {isListening ? (
                    <>
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Stop Listening
                    </>
                  ) : (
                    "🗣️ Ask about smog"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 transition-all ${
            isOpen ? "bg-black/50 border-neon-cyan/50 text-neon-cyan" : "bg-gradient-to-r from-neon-cyan to-neon-blue border-transparent text-black"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { boxShadow: ["0 0 0px #00e5ff", "0 0 20px #00e5ff", "0 0 0px #00e5ff"] } : {}}
          transition={isListening ? { repeat: Infinity, duration: 2 } : {}}
        >
          {isListening ? "🔴" : "🎙️"}
        </motion.button>
      </div>
    </>
  );
}
