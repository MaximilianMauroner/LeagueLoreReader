import { useCallback, useEffect, useRef, useState } from "react";

interface UseTTSOptions {
  text: string;
  initialVoice?: SpeechSynthesisVoice;
  initialRate?: number;
}

interface UseTTSResult {
  currentTime: number;
  duration: number;
  playing: boolean;
  playbackSpeed: number;
  currentPercentage: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  togglePlaying: () => void;
  setTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useTTS({
  text,
  initialVoice,
  initialRate = 1,
}: UseTTSOptions): UseTTSResult {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(initialRate);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(initialVoice ?? null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  const createUtterance = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.voice = selectedVoice;
    utterance.onstart = () => {
      setDuration(utterance.text.length / 5); // Rough estimate
    };
    utterance.onend = () => {
      setPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    return utterance;
  }, [text, playbackSpeed, selectedVoice]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    utteranceRef.current = createUtterance();

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice && availableVoices.length > 0 && availableVoices[0]) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, createUtterance]);

  useEffect(() => {
    if (playing) {
      const synth = window.speechSynthesis;
      synth.cancel();
      utteranceRef.current = createUtterance();
      synth.speak(utteranceRef.current);
    }
  }, [playbackSpeed, selectedVoice, playing, createUtterance]);

  const togglePlaying = useCallback(() => {
    const synth = window.speechSynthesis;
    if (playing) {
      synth.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      utteranceRef.current = createUtterance();
      synth.speak(utteranceRef.current);
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    setPlaying(!playing);
  }, [playing, createUtterance]);

  const setTime = useCallback(
    (time: number) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      setCurrentTime(time);
      utteranceRef.current = createUtterance();
      utteranceRef.current.text = text.substring(Math.floor(time * 5));
      if (playing) {
        synth.speak(utteranceRef.current);
      }
    },
    [playing, text, createUtterance],
  );

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  const currentPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    playing,
    playbackSpeed,
    currentPercentage,
    voices,
    selectedVoice,
    togglePlaying,
    setTime,
    setPlaybackSpeed,
    setVoice,
  };
}
