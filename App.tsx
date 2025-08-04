
import React, { useState, useEffect, useCallback } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { MainScreen } from './components/MainScreen';
import { useWakeWord } from './hooks/useWakeWord';

const WAKE_PHRASE_KEY = 'wake-phrase-assistant-app';

const App: React.FC = () => {
  const [wakePhrase, setWakePhrase] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isListeningEnabled, setIsListeningEnabled] = useState(false);

  useEffect(() => {
    const storedPhrase = localStorage.getItem(WAKE_PHRASE_KEY);
    setWakePhrase(storedPhrase);
    setIsInitialized(true);
  }, []);

  const handlePhraseSet = (phrase: string) => {
    const trimmedPhrase = phrase.trim();
    if (trimmedPhrase) {
      localStorage.setItem(WAKE_PHRASE_KEY, trimmedPhrase);
      setWakePhrase(trimmedPhrase);
      setIsListeningEnabled(true);
    }
  };
  
  const handleToggleListening = (enabled: boolean) => {
    setIsListeningEnabled(enabled);
  };

  const handleResetPhrase = () => {
    localStorage.removeItem(WAKE_PHRASE_KEY);
    setWakePhrase(null);
    setIsListeningEnabled(false);
  };

  const {
    isListening,
    error,
    isStarting,
    isWakeWordDetected,
    startListening,
    stopListening
  } = useWakeWord(wakePhrase, isListeningEnabled);

  // Auto-start/stop listening when the toggle changes
  useEffect(() => {
    if (isListeningEnabled && wakePhrase) {
      startListening();
    } else {
      stopListening();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListeningEnabled, wakePhrase, startListening, stopListening]);


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!wakePhrase) {
    return <SetupScreen onPhraseSet={handlePhraseSet} />;
  }

  return (
    <MainScreen
      wakePhrase={wakePhrase}
      isListeningEnabled={isListeningEnabled}
      onToggleListening={handleToggleListening}
      onResetPhrase={handleResetPhrase}
      isListening={isListening}
      isStarting={isStarting}
      isWakeWordDetected={isWakeWordDetected}
      error={error}
    />
  );
};

export default App;
