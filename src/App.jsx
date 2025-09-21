/**
LanguageTranslator.jsx — Fixed & Clean Google Translator-like Horizontal Layout with Dark Mode
React + Tailwind CSS + React Icons

Features:
- Horizontal alignment (two side-by-side boxes: input and output)
- Dark/Light mode toggle
- Dropdowns above each box for language selection
- Translate button (free MyMemory API)
- Speak button for both source and target text
- Mic input for source text
- Clear & Swap buttons
- Fixed previous errors
*/

import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaExchangeAlt, FaTrash, FaVolumeUp, FaLanguage, FaMoon, FaSun } from 'react-icons/fa';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
];

const LOCALE_MAP = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  hi: 'hi-IN',
  de: 'de-DE',
  zh: 'zh-CN',
};

export default function LanguageTranslator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const supportsSTT = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startRecognition = () => {
    if (!supportsSTT) {
      setError('Speech-to-text not supported. Use Chrome desktop.');
      return;
    }

    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = LOCALE_MAP[sourceLang] || sourceLang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      if (e.results && e.results[0] && e.results[0][0]) {
        const transcript = e.results[0][0].transcript;
        setText((prev) => (prev + ' ' + transcript).trim());
      }
    };

    recognition.onerror = () => setError('Speech recognition error.');
    recognition.onend = () => setRecording(false);

    try {
      recognition.start();
      setRecording(true);
    } catch {
      setError('Could not start speech recognition.');
    }
  };

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setRecording(false);
  };

  const toggleRecording = () => {
    recording ? stopRecognition() : startRecognition();
  };

  const translateText = async () => {
    setError('');
    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }
    if (sourceLang === targetLang) {
      setError('Source and target languages must differ.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
      const data = await res.json();
      if (data && data.responseData) {
        setResult(data.responseData.translatedText);
      } else {
        setError('Translation failed.');
      }
    } catch {
      setError('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (msg, lang) => {
    if (!msg) return;
    try {
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = LOCALE_MAP[lang] || lang;
      window.speechSynthesis.speak(utterance);
    } catch {
      setError('Text-to-speech not supported in this browser.');
    }
  };

  const swapLanguages = () => {
    [sourceLang, targetLang].forEach((v, i) => i === 0 ? setSourceLang(targetLang) : setTargetLang(sourceLang));
    setResult('');
  };

  const clearAll = () => {
    setText('');
    setResult('');
    setError('');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen p-6`}> 
      <div className="flex justify-end mb-4">
        <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 px-4 py-2 rounded-lg  dark:bg-gray-700">
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaLanguage /> Translator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Box */}
        <div className={`border rounded-lg p-4 shadow-md flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-3">
            <select
              className={`p-3 border rounded-lg text-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
            <button onClick={() => speakText(text, sourceLang)} className="px-4 py-3 bg-green-200 text-green-700 rounded-lg flex items-center gap-2 text-lg">
              <FaVolumeUp /> Speak
            </button>
          </div>
          <textarea
            className={`w-full h-100 flex-grow p-3 border rounded-lg text-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
            placeholder="Type or speak text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <button onClick={toggleRecording} className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-lg ${recording ? 'bg-red-500 text-white' : 'bg-gray-400'}`}>
              {recording ? <><FaStop /> Stop</> : <><FaMicrophone /> Mic</>}
            </button>
            <button onClick={clearAll} className="flex-1 px-4 py-3 bg-red-200 text-red-700 rounded-lg flex items-center justify-center gap-2 text-lg">
              <FaTrash /> Clear
            </button>
          </div>
        </div>

        {/* Target Box */}
        <div className={`border rounded-lg p-4 shadow-md flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-3">
            <select
              className={`p-3 border rounded-lg text-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
            <button onClick={() => speakText(result, targetLang)} className="px-4 py-3 bg-green-200 text-green-700 rounded-lg flex items-center gap-2 text-lg">
              <FaVolumeUp /> Speak
            </button>
          </div>
          <div className={`w-full flex-grow min-h-[150px] p-3 border rounded-lg text-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'}`}>
            {result || <span className="text-gray-400">Translation will appear here...</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button onClick={swapLanguages} className="px-5 py-3 bg-gray-300 rounded-lg flex items-center gap-2 text-lg">
          <FaExchangeAlt /> Swap
        </button>
        <button onClick={translateText} className="px-8 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 text-lg" disabled={loading}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {error && <p className="mt-3 text-red-600 text-lg text-center">{error}</p>}
    </div>
  );
}
