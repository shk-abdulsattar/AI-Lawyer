import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FiMic, FiMicOff, FiVolume2, FiVolumeX, FiArrowDown, FiArrowRight, FiX, FiShield, FiFileText
} from 'react-icons/fi';
import { FaBalanceScale, FaGavel } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './Home.css';

const VERIFIED_CASES = [
  { label: 'Rental Lease Agreement Check', query: 'What essential terms, maintenance clauses, and security deposit rules should I verify in a residential rental agreement?' },
  { label: 'Consumer Forum & Refund Rights', query: 'What is the procedure to file a consumer grievance for an undelivered product or defective service under the Consumer Protection Act 2019?' },
  { label: 'Employment Terms & Notice Period', query: 'What are standard statutory practices regarding employment offer letters, notice periods, and full-and-final settlement?' },
  { label: 'Filing an Online RTI Application', query: 'What is the step-by-step process for a citizen to draft and submit an online RTI application on rtionline.gov.in?' },
];

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  const [userSpeech, setUserSpeech] = useState('');
  const [aiSpeech, setAiSpeech] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [showVoiceCard, setShowVoiceCard] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap the speaker to talk to AI Lawyer');

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const currentUtteranceRef = useRef(null);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setShowVoiceCard(true);
        setStatusMessage('Listening to your legal inquiry... Speak clearly');
      };

      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setUserSpeech(text);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setStatusMessage('Voice not detected. Tap the speaker to speak again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  
  useEffect(() => {
    if (!isListening && userSpeech.trim() && userSpeech !== lastQuery && !isThinking) {
      processVoiceQuery(userSpeech);
    }
  }, [isListening, userSpeech]);


  const speakLegalCounsel = (text) => {
    if (!synthRef.current || voiceMuted) return;
    synthRef.current.cancel();

    const cleanText = text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*|\*|__|~/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`/g, '')
      .replace(/>\s?/g, '')
      .replace(/§/g, 'Section')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 0.98;

    const voices = synthRef.current.getVoices();
    const preferredVoice =
      voices.find(v => v.lang.includes('en-IN')) ||
      voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.lang.includes('en-GB')) ||
      voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusMessage('...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusMessage(' Tap speaker to ask another issue.');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusMessage(' complete.');
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };


  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is supported in Google Chrome, Microsoft Edge, and Safari.');
      return;
    }
    stopSpeaking();

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setUserSpeech('');
      setShowVoiceCard(true);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition error:', err);
      }
    }
  };

  const processVoiceQuery = async (queryText) => {
    if (!queryText.trim()) return;

    setLastQuery(queryText);
    stopSpeaking();
    setIsThinking(true);
    setShowVoiceCard(true);
    setStatusMessage('Consulting Indian Penal Code, CrPC & Statutes...');

    try {
      const res = await axios.post('/api/chat/message', {
        message: queryText
      });

      const responseText = res.data.response;
      setAiSpeech(responseText);
      setIsThinking(false);


      speakLegalCounsel(responseText);
    } catch (err) {
      console.error('Legal voice error:', err);
      const fallback = "I am ready to assist with your legal inquiry. Please speak your question regarding consumer rights, contract clauses, rental agreements, or procedural guidelines.";
      setAiSpeech(fallback);
      setIsThinking(false);
      speakLegalCounsel(fallback);
    }
  };

  return (
    <div className="floristy-page">

      <Navbar onStartVoice={toggleVoice} />


      <main className="floristy-hero">


        <div className="watermark-lawyer" aria-hidden="true">
          LAWYER
        </div>


        
        <div className="headline-wrap">
          <span className="headline-badge">AI LAWYER · SIMPLE LEGAL HELP</span>
          <h1 className="floristy-title">ASK ANY LEGAL QUESTION</h1>
          <p className="headline-sub">Talk with our AI lawyer using your voice. Get simple answers about rent, refunds, jobs, and laws.</p>
        </div>


    
        <div className="floristy-stage">

      
          <div className="floristy-col-left">
            <div className="side-ai-kicker">
              <span className="kicker-dot" />
              <span>SIMPLE ANSWERS</span>
            </div>
            <h2 className="floristy-left-heading">
              Everyday Legal Help
            </h2>
            <p className="floristy-left-desc">
              Get easy answers for everyday questions — like house rent agreements, shopping refunds, job notice periods, and government rules.
            </p>
            <div className="left-stat-badge">
              <FiShield size={13} />
              <span>Based on Indian laws in simple words</span>
            </div>
          </div>

         
          <div className="floristy-col-center">
            <div className="voice-stage-clean" onClick={toggleVoice}>
              <div className={`voice-visuals-container ${isListening ? 'state-listening' : isSpeaking ? 'state-speaking' : isThinking ? 'state-thinking' : 'state-idle'}`}>

              
                <div className="visual-ring ring-wave-1" />
                <div className="visual-ring ring-wave-2" />
                <div className="visual-ring ring-wave-3" />

               
                <div className="audio-frequency-spectrum">
                  <span /><span /><span /><span /><span />
                  <span /><span /><span /><span /><span />
                  <span /><span /><span /><span /><span /><span />
                </div>

                <div className="voice-disc-core" title="Tap to speak with AI Lawyer">
                  <div className="disc-inner-glow" />
                  <div className="disc-icon-wrap">
                    {isListening ? (
                      <FiMic size={38} className="mic-listening-pulse" />
                    ) : isSpeaking ? (
                      <FiVolume2 size={38} className="volume-speaking-pulse" />
                    ) : isThinking ? (
                      <div className="thinking-disc-spinner" />
                    ) : (
                      <FaBalanceScale size={36} />
                    )}
                  </div>
                </div>

                
                <div className="voice-status-tag">
                  <span className={`tag-pulse-dot ${isListening ? 'red' : isSpeaking ? 'green' : isThinking ? 'gold' : ''}`} />
                  <span className="tag-text">
                    {isListening ? 'LISTENING... ASK YOUR QUESTION' : isSpeaking ? 'SPEAKING THE ANSWER...' : isThinking ? 'CHECKING THE LAW...' : 'TAP SPEAKER TO ASK A QUESTION'}
                  </span>
                </div>
              </div>
            </div>
          </div>

      
          <div className="floristy-col-right">
            <div className="side-ai-kicker right-kicker">
              <span className="kicker-dot gold" />
              <span>TALK WITH VOICE</span>
            </div>
            <h2 className="floristy-right-heading">
              Common Questions
            </h2>
            <p className="floristy-right-text">
              Speak naturally in English or Hindi. The AI lawyer explains legal rules in simple, easy-to-understand words.
            </p>

            
            <div className="quick-topics-clean">
              <div className="topics-pill-list">
                {VERIFIED_CASES.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    className="topic-clean-pill"
                    onClick={() => {
                      setUserSpeech(topic.query);
                      processVoiceQuery(topic.query);
                    }}
                  >
                    <span>{topic.label}</span>
                    <FiArrowRight size={11} />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

    
        <div className="bottom-area-title">
          HOUSE RENT · CONSUMER COMPLAINTS · JOB RULES · SIMPLE LEGAL HELP
        </div>

      </main>


      {showVoiceCard && (
        <div className="floating-voice-modal fade-in">
          <div className="voice-modal-header">
            <div className="modal-status">
              <span className={`status-indicator ${isListening ? 'pulse-red' : isSpeaking ? 'pulse-green' : isThinking ? 'pulse-gold' : ''}`} />
              <span className="status-text">{statusMessage}</span>
            </div>

            <div className="modal-actions">
              {isSpeaking && (
                <button className="modal-btn" onClick={stopSpeaking} title="Stop Voice">
                  <FiVolumeX size={15} />
                  <span>Stop Voice</span>
                </button>
              )}
              <button
                className="modal-mic-toggle"
                onClick={toggleVoice}
                title={isListening ? "Pause Listening" : "Tap to Speak"}
              >
                {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
              </button>
              <button className="modal-close" onClick={() => { stopSpeaking(); setShowVoiceCard(false); }}>
                <FiX size={16} />
              </button>
            </div>
          </div>

          <div className="voice-modal-content">
            {isThinking ? (
              <p className="modal-thinking">...</p>
            ) : userSpeech && isListening ? (
              <p className="modal-user-speech">"{userSpeech}"</p>
            ) : aiSpeech ? (
              <p className="modal-ai-speech">{aiSpeech.replace(/#{1,6}\s?/g, '').replace(/\*\*|\*|__/g, '')}</p>
            ) : (
              <p className="modal-hint">Listening to your voice... Speak your legal matter clearly in English or Hindi.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
