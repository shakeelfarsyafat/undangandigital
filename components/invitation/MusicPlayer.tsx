"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Music, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

export function MusicPlayer({
  isPlaying: initialPlaying = false,
  musicUrl,
}: {
  isPlaying?: boolean;
  musicUrl?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synthetic romantic arpeggio fallback if mp3 isn't available or blocked
  const startSynthMusic = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 329.63]; // C E G C A F G E
      let step = 0;

      const playNextNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[step % notes.length], audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 1.2);

        step++;
      };

      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      synthTimerRef.current = setInterval(playNextNote, 600);
    } catch (e) {
      // Audio synth error fallback
    }
  }, []);

  const stopSynthMusic = useCallback(() => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthMusic();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          startSynthMusic();
          setIsPlaying(true);
        });
      } else {
        startSynthMusic();
        setIsPlaying(true);
      }
    }
  }, [isPlaying, startSynthMusic, stopSynthMusic]);

  useEffect(() => {
    let isMounted = true;
    if (initialPlaying) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          if (isMounted) setIsPlaying(true);
        }).catch(() => {
          startSynthMusic();
          if (isMounted) setIsPlaying(true);
        });
      } else {
        startSynthMusic();
        if (isMounted) setIsPlaying(true);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [initialPlaying, startSynthMusic]);

  useEffect(() => {
    return () => {
      stopSynthMusic();
    };
  }, [stopSynthMusic]);

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl || "/music/wedding.mp3"}
        loop
        preload="auto"
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <button
          onClick={toggleMusic}
          aria-label="Toggle Music"
          className="w-12 h-12 rounded-full glass-card-dark flex items-center justify-center text-[#E6C887] shadow-2xl border border-[#C5A059]/40 hover:scale-105 transition-transform cursor-pointer relative"
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Music className="w-5 h-5 text-[#E6C887]" />
            </motion.div>
          ) : (
            <Play className="w-5 h-5 ml-0.5 text-[#E8DCC4]" />
          )}

          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C5A059] rounded-full animate-ping" />
          )}
        </button>
      </motion.div>
    </>
  );
}
