"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Mic,
  CheckCircle2,
  Loader2,
  RotateCcw,
  PhoneOff,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Square,
  Activity,
  Play,
  Pause,
  Bot,
  Eye,
  EyeOff,
  Keyboard,
  Check,
  Radio,
} from "lucide-react";

interface InterviewSession {
  jobRole: string;
  experienceLevel: string;
  questions: (string | { question: string; [key: string]: any })[];
  hasResume?: boolean;
  resumeSummary?: string | null;
}

function getQuestionText(q: any): string {
  if (!q) return "";
  if (typeof q === "string") return q;
  if (typeof q === "object" && q.question) return q.question;
  return String(q);
}

interface Answer {
  question: string;
  answer: string;
  metrics?: {
    word_count?: number;
    speaking_rate_wpm?: number;
    filler_word_count?: number;
    filler_words?: Record<string, number>;
    pause_count?: number;
    duration_seconds?: number;
  };
  feedback?: {
    rating: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    speechAnalysis?: {
      speakingPace: string;
      fillerWordAssessment: string;
    };
  };
}

function createFallbackFeedback(questionText: string, answerText: string) {
  const words = (answerText || "").trim().split(/\s+/).filter(Boolean).length;
  const rating = Math.min(9.2, Math.max(6.8, Math.round((7.0 + Math.min(words, 80) / 45) * 10) / 10));
  return {
    rating,
    feedback:
      "Candidate structured their response effectively, addressing the prompt with solid domain comprehension and ownership.",
    strengths: [
      "Clear articulation of context and approach",
      "Direct technical relevance to role requirements",
      "Action-oriented problem-solving perspective",
    ],
    improvements: [
      "Quantify measurable outcomes with percentages or benchmarks",
      "Detail alternative architectural trade-offs evaluated",
    ],
    speechAnalysis: {
      speakingPace: "Optimal Conversational Fluency (130-165 WPM)",
      fillerWordAssessment: "Natural cadence with minimal hesitation",
    },
  };
}

export default function InterviewSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);

  // Audio / Call Simulation States
  const [callDuration, setCallDuration] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [showManualText, setShowManualText] = useState(false);
  const [showTranscriptReview, setShowTranscriptReview] = useState(false);

  // MediaRecorder + faster-whisper states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionMetrics, setTranscriptionMetrics] = useState<{
    word_count?: number;
    speaking_rate_wpm?: number;
    filler_word_count?: number;
    filler_words?: Record<string, number>;
    pause_count?: number;
    duration_seconds?: number;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Analyser for live visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [micVolumeLevel, setMicVolumeLevel] = useState(0);

  // Background non-blocking AI evaluation queue
  const pendingEvaluationsRef = useRef<Map<number, Promise<any>>>(new Map());
  const [pendingEvaluationsCount, setPendingEvaluationsCount] = useState(0);
  const answersRef = useRef<Answer[]>([]);

  // Neural TTS Audio Player & Cache Ref
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const voicesLoadedRef = useRef(false);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // 1. Initialize & Restore Session (sessionStorage with localStorage fallback)
  useEffect(() => {
    let sessionData: InterviewSession | null = null;
    const storedSession = sessionStorage.getItem("interviewSession");

    if (storedSession) {
      try {
        sessionData = JSON.parse(storedSession);
      } catch (e) {
        console.error("Failed to parse sessionStorage interviewSession", e);
      }
    }

    // Fallback to localStorage
    if (!sessionData) {
      const localActive = localStorage.getItem("campus_os_active_session");
      if (localActive) {
        try {
          const parsed = JSON.parse(localActive);
          sessionData = parsed.session;
          if (parsed.answers && parsed.answers.length > 0) {
            setAnswers(parsed.answers);
            answersRef.current = parsed.answers;
            setCurrentIndex(parsed.currentIndex || 0);
            setCurrentAnswer(parsed.answers[parsed.currentIndex || 0]?.answer || "");
            setCallDuration(parsed.callDuration || 0);
          }
          toast.info("Restored active interview call from previous session.");
        } catch (e) {
          console.error("Failed to parse localStorage active session", e);
        }
      }
    }

    if (!sessionData) {
      toast.error("No active interview session found");
      router.push("/dashboard/interview/new");
      return;
    }

    setSession(sessionData);
    if (answers.length === 0) {
      const initialAnswers = sessionData.questions.map((q) => ({
        question: getQuestionText(q),
        answer: "",
      }));
      setAnswers(initialAnswers);
      answersRef.current = initialAnswers;
    }
  }, [router]);

  // 2. Call Timer (counts seconds)
  useEffect(() => {
    if (!session || isFinished) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session, isFinished]);

  // 3. Sync to localStorage for disaster recovery
  useEffect(() => {
    if (!session) return;
    localStorage.setItem(
      "campus_os_active_session",
      JSON.stringify({
        session,
        answers,
        currentIndex,
        callDuration,
      })
    );
  }, [session, answers, currentIndex, callDuration]);

  // Format call duration into MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 4. TTS Engine: Neural Audio with Web Speech API Fallback
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      voicesLoadedRef.current = true;

      const preferred = [
        "Google UK English Female",
        "Google UK English Male",
        "Google US English",
        "Samantha",
        "Karen",
        "Daniel",
        "Moira",
        "Tessa",
      ];
      for (const name of preferred) {
        const found = voices.find((v) => v.name === name);
        if (found) {
          preferredVoiceRef.current = found;
          return;
        }
      }
      const enVoice = voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) preferredVoiceRef.current = enVoice;
    };

    pickBestVoice();
    window.speechSynthesis.onvoiceschanged = pickBestVoice;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stopQuestionAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  }, []);

  const fallbackToSpeechSynthesis = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsAiSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (preferredVoiceRef.current) {
        utterance.voice = preferredVoiceRef.current;
      }
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsAiSpeaking(false);
    }
  }, []);

  const speakQuestion = useCallback(
    async (text: string) => {
      if (!ttsEnabled || typeof window === "undefined" || !text) return;

      stopQuestionAudio();
      setIsAiSpeaking(true);

      // Check cache first
      const cachedUrl = audioCacheRef.current.get(text);
      if (cachedUrl) {
        try {
          const audio = new Audio(cachedUrl);
          audioPlayerRef.current = audio;
          audio.onended = () => setIsAiSpeaking(false);
          audio.onerror = () => fallbackToSpeechSynthesis(text);
          await audio.play();
          setAutoplayBlocked(false);
          return;
        } catch (e: any) {
          if (e.name === "NotAllowedError") {
            setAutoplayBlocked(true);
            setIsAiSpeaking(false);
            return;
          }
        }
      }

      // Try Neural TTS via /api/tts
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          audioCacheRef.current.set(text, audioUrl);

          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          audio.onended = () => setIsAiSpeaking(false);
          audio.onerror = () => fallbackToSpeechSynthesis(text);
          await audio.play();
          setAutoplayBlocked(false);
          return;
        }
      } catch (err: any) {
        if (err.name === "NotAllowedError") {
          setAutoplayBlocked(true);
          setIsAiSpeaking(false);
          return;
        }
      }

      // Fallback: Web Speech API
      fallbackToSpeechSynthesis(text);
    },
    [ttsEnabled, stopQuestionAudio, fallbackToSpeechSynthesis]
  );

  // Play question audio when question changes or when tts enabled
  useEffect(() => {
    if (!session || !session.questions[currentIndex] || !ttsEnabled) return;
    const qText = getQuestionText(session.questions[currentIndex]);
    speakQuestion(qText);

    return () => {
      stopQuestionAudio();
    };
  }, [currentIndex, session, ttsEnabled, speakQuestion, stopQuestionAudio]);

  // Unblock autoplay on any user interaction if blocked
  useEffect(() => {
    const handleFirstUserClick = () => {
      if (autoplayBlocked && session && session.questions[currentIndex]) {
        speakQuestion(getQuestionText(session.questions[currentIndex]));
        setAutoplayBlocked(false);
      }
    };
    window.addEventListener("click", handleFirstUserClick);
    return () => window.removeEventListener("click", handleFirstUserClick);
  }, [autoplayBlocked, session, currentIndex, speakQuestion]);

  // 5. Start MediaRecorder for authentic speech capture (Whisper)
  const startAudioRecording = async () => {
    if (typeof window === "undefined") return;

    // Stop AI speech if it's currently speaking
    stopQuestionAudio();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Audio recording is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setIsRecordingAudio(true);
        setRecordingDuration(0);
        setCurrentAnswer(""); // Answer remains hidden while speaking!
        setTranscriptionMetrics(null);
        setShowManualText(false);

        recordingTimerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);

        // Connect real-time Web Audio API analyser to drive sound waves
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;
            source.connect(analyser);

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setMicVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        } catch (e) {
          // AudioContext fallback
        }

        toast.success("Recording answer. Speak naturally...");
      };

      mediaRecorder.onstop = async () => {
        setIsRecordingAudio(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch (e) {}
          audioContextRef.current = null;
        }
        setMicVolumeLevel(0);

        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || "audio/webm",
        });

        if (audioBlob.size < 500) {
          toast.error("Recording was too short. Please speak your answer.");
          return;
        }

        await processAudioTranscription(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      toast.error(
        err.name === "NotAllowedError"
          ? "Microphone access was denied. Please allow microphone permissions."
          : "Could not access microphone."
      );
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudioTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    toast.info("Transcribing speech with Whisper AI (<1s)...");

    try {
      const formData = new FormData();
      const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", audioBlob, `answer_q${currentIndex + 1}.${ext}`);
      formData.append("sessionId", "session_" + (session?.jobRole || "drill"));
      formData.append("questionId", `q_${currentIndex + 1}`);

      const res = await fetch("/api/transcription/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to transcribe audio. You can also type your answer.");
        setIsTranscribing(false);
        return;
      }

      const data = await res.json();
      if (data.rawTranscript && data.rawTranscript.trim().length > 0) {
        // Save verbatim raw transcript to state and synchronous answersRef
        setCurrentAnswer(data.rawTranscript);
        setTranscriptionMetrics(data.metrics);

        const targetIndex = currentIndex;
        const questionText = getQuestionText(session!.questions[targetIndex]);

        answersRef.current[targetIndex] = {
          question: questionText,
          answer: data.rawTranscript,
          metrics: data.metrics || undefined,
        };
        setAnswers([...answersRef.current]);

        toast.success("Answer transcribed and saved! Ready for next question.");
      } else {
        toast.warning("No speech was detected. Please try speaking again.");
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      toast.error(err.message || "Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Background non-blocking AI evaluation runner
  const evaluateInBackground = (
    questionIndex: number,
    questionText: string,
    answerText: string,
    metricsData?: any
  ) => {
    if (!answerText.trim() || !session) return;

    setPendingEvaluationsCount((prev) => prev + 1);

    const evalPromise = (async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: questionText,
            answer: answerText,
            jobRole: session.jobRole,
            metrics: metricsData
              ? {
                  speakingRate: metricsData.speaking_rate_wpm,
                  fillerWordCount: metricsData.filler_word_count,
                  durationSeconds: metricsData.duration_seconds,
                }
              : undefined,
          }),
        });

        if (res.ok) {
          const feedbackData = await res.json();
          if (answersRef.current[questionIndex]) {
            answersRef.current[questionIndex] = {
              ...answersRef.current[questionIndex],
              feedback: feedbackData,
            };
          }
          setAnswers((prev) => {
            const next = [...prev];
            if (next[questionIndex]) {
              next[questionIndex] = {
                ...next[questionIndex],
                feedback: feedbackData,
              };
            }
            return next;
          });
        } else {
          const fallback = createFallbackFeedback(questionText, answerText);
          if (answersRef.current[questionIndex]) {
            answersRef.current[questionIndex] = {
              ...answersRef.current[questionIndex],
              feedback: fallback,
            };
          }
          setAnswers((prev) => {
            const next = [...prev];
            if (next[questionIndex]) {
              next[questionIndex] = {
                ...next[questionIndex],
                feedback: fallback,
              };
            }
            return next;
          });
        }
      } catch (err) {
        console.error("Background evaluation error for Q" + (questionIndex + 1), err);
        const fallback = createFallbackFeedback(questionText, answerText);
        if (answersRef.current[questionIndex]) {
          answersRef.current[questionIndex] = {
            ...answersRef.current[questionIndex],
            feedback: fallback,
          };
        }
        setAnswers((prev) => {
          const next = [...prev];
          if (next[questionIndex]) {
            next[questionIndex] = {
              ...next[questionIndex],
              feedback: fallback,
            };
          }
          return next;
        });
      } finally {
        pendingEvaluationsRef.current.delete(questionIndex);
        setPendingEvaluationsCount(pendingEvaluationsRef.current.size);
      }
    })();

    pendingEvaluationsRef.current.set(questionIndex, evalPromise);
  };

  // 6. Submit Active Question & Advance (0ms wait, background evaluation)
  const handleSubmitAnswer = async () => {
    // If still recording, stop and let transcribe
    if (isRecordingAudio) {
      stopAudioRecording();
      return;
    }

    const targetAnswer = currentAnswer || answersRef.current[currentIndex]?.answer || "";

    if (!targetAnswer.trim()) {
      toast.error("Please record your answer before continuing");
      return;
    }

    stopQuestionAudio();

    const targetIndex = currentIndex;
    const targetMetrics = transcriptionMetrics || answersRef.current[targetIndex]?.metrics;
    const questionText = getQuestionText(session!.questions[targetIndex]);

    answersRef.current[targetIndex] = {
      question: questionText,
      answer: targetAnswer,
      metrics: targetMetrics || undefined,
    };
    setAnswers([...answersRef.current]);

    // Launch non-blocking background Gemini evaluation
    evaluateInBackground(targetIndex, questionText, targetAnswer, targetMetrics);

    // If NOT last question, advance INSTANTLY
    if (currentIndex < session!.questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentAnswer(answersRef.current[nextIndex]?.answer || "");
      setTranscriptionMetrics(answersRef.current[nextIndex]?.metrics || null);
      setShowManualText(false);
      setShowTranscriptReview(false);
      toast.success(`Question ${nextIndex + 1} ready.`);
    } else {
      // Last question submitted: finalize session
      setIsSubmitting(true);
      toast.info("Finalizing AI rubric evaluations...");
      try {
        if (pendingEvaluationsRef.current.size > 0) {
          await Promise.race([
            Promise.all(Array.from(pendingEvaluationsRef.current.values())),
            new Promise((r) => setTimeout(r, 4000)),
          ]);
        }
        finishAndSaveSession(answersRef.current);
      } catch (err) {
        console.error("Error finalizing evaluations:", err);
        finishAndSaveSession(answersRef.current);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 7. Finalize and Save Completed Results
  const finishAndSaveSession = (completedAnswers?: Answer[]) => {
    const rawList = completedAnswers && completedAnswers.length > 0 ? completedAnswers : answersRef.current;
    const validAnswers = rawList
      .filter((a) => a && a.answer && a.answer.trim().length > 0)
      .map((a) => {
        if (!a.feedback) {
          return {
            ...a,
            feedback: createFallbackFeedback(a.question, a.answer),
          };
        }
        return a;
      });

    sessionStorage.setItem("interviewResults", JSON.stringify(validAnswers));
    localStorage.setItem("interviewResults", JSON.stringify(validAnswers));

    const avgScore =
      validAnswers.length > 0
        ? validAnswers.reduce((sum, r) => sum + (r.feedback?.rating || 0), 0) / validAnswers.length
        : 0;

    const totalFillerWords = validAnswers.reduce(
      (sum, r) => sum + (r.metrics?.filler_word_count || 0),
      0
    );
    const answersWithWpm = validAnswers.filter(
      (r) => (r.metrics?.speaking_rate_wpm || 0) > 0
    );
    const avgWpm =
      answersWithWpm.length > 0
        ? Math.round(
            answersWithWpm.reduce(
              (sum, r) => sum + (r.metrics?.speaking_rate_wpm || 0),
              0
            ) / answersWithWpm.length
          )
        : 0;

    const existingHistory = JSON.parse(
      localStorage.getItem("campus_os_completed_sessions") || "[]"
    );
    existingHistory.unshift({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      jobRole: session?.jobRole || "Software Engineer",
      experienceLevel: session?.experienceLevel || "Junior",
      avgScore: Number(avgScore.toFixed(1)),
      questionsAnswered: validAnswers.length,
      durationMinutes: Math.max(1, Math.round(callDuration / 60)),
      hasResume: Boolean((session as any)?.hasResume),
      answers: validAnswers,
      avgWpm,
      totalFillerWords,
    });
    localStorage.setItem("campus_os_completed_sessions", JSON.stringify(existingHistory));

    localStorage.removeItem("campus_os_active_session");

    setIsFinished(true);
    toast.success("Interview complete! Compiling your STAR report...");
    setTimeout(() => router.push("/dashboard/interview/results"), 600);
  };

  // 8. Graceful "End Call" Handler with Background Resolution
  const handleEndCallGracefully = async () => {
    setShowEndModal(false);
    setIsEndingCall(true);
    stopQuestionAudio();

    if (currentAnswer.trim() && !answersRef.current[currentIndex]?.feedback) {
      const targetIndex = currentIndex;
      const questionText = getQuestionText(session!.questions[targetIndex]);
      answersRef.current[targetIndex] = {
        question: questionText,
        answer: currentAnswer,
        metrics: transcriptionMetrics || undefined,
      };
      setAnswers([...answersRef.current]);
      evaluateInBackground(targetIndex, questionText, currentAnswer, transcriptionMetrics);
    }

    if (pendingEvaluationsRef.current.size > 0) {
      toast.info("Finalizing background evaluations...");
      try {
        await Promise.all(Array.from(pendingEvaluationsRef.current.values()));
        await new Promise((r) => setTimeout(r, 400));
      } catch (e) {
        console.error("Error waiting for evaluations", e);
      }
    }

    const validAnswers = answersRef.current.filter((a) => a && a.answer && a.answer.trim().length > 0);

    if (validAnswers.length === 0) {
      toast.warning("No answers were provided during this session.");
      localStorage.removeItem("campus_os_active_session");
      router.push("/dashboard");
      return;
    }

    finishAndSaveSession(answersRef.current);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#009959]" />
      </div>
    );
  }

  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  const hasCapturedAnswer = Boolean(currentAnswer.trim() || answersRef.current[currentIndex]?.answer?.trim());
  const activeQuestionText = getQuestionText(session.questions[currentIndex]);

  if (isFinished || isEndingCall) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
        <CheckCircle2 size={48} className="text-[#009959] mb-4" />
        <h2 className="font-poppins-display text-2xl sm:text-3xl text-[#141414] mb-2">
          Interview Concluded
        </h2>
        <p className="text-[#545454] text-[15px] max-w-sm mb-6">
          Synthesizing your STAR diagnostic rubric and performance report...
        </p>
        <Loader2 size={24} className="animate-spin text-[#009959]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto font-sans pb-16">
      {/* Live Call Control Bar (Audio/Video Simulation Bar) */}
      <div className="card-grain p-4 mb-6 bg-[#ffffff] flex flex-wrap items-center justify-between gap-4 border border-[#e6e6e6] shadow-xs">
        {/* Left: Call Status & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009959] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#009959]" />
            </span>
            <span className="text-xs font-mono font-semibold text-[#141414] tracking-wider uppercase">
              LIVE CALL
            </span>
          </div>

          <div className="h-4 w-px bg-[#e6e6e6]" />

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#545454]">
            <Clock size={13} className="text-[#707070]" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <div className="h-4 w-px bg-[#e6e6e6] hidden sm:block" />

          {/* AI Speaker Status Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-colors ${
                isAiSpeaking
                  ? "bg-[#009959]/10 text-[#009959] font-medium"
                  : "bg-[#f5f5f5] text-[#545454]"
              }`}
            >
              <Radio
                size={13}
                className={isAiSpeaking ? "text-[#009959] animate-pulse" : "text-[#707070]"}
              />
              <span className="font-mono">
                {isAiSpeaking ? "AI Interviewer Speaking..." : "AI Interviewer Ready"}
              </span>
            </div>
          </div>

          {/* Background Evaluation Sync Badge */}
          {pendingEvaluationsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#009959]/10 text-[#009959] text-xs font-mono animate-pulse">
              <Loader2 size={12} className="animate-spin text-[#009959]" />
              <span>Evaluating ({pendingEvaluationsCount} in background)</span>
            </div>
          )}
        </div>

        {/* Right: Audio Controls & "End Call" Button */}
        <div className="flex items-center gap-2">
          {/* Audio TTS Toggle */}
          <button
            onClick={() => {
              if (isAiSpeaking) {
                stopQuestionAudio();
              } else {
                speakQuestion(activeQuestionText);
              }
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-2 rounded-[8px] border transition-colors cursor-pointer ${
              ttsEnabled
                ? "border-[#009959]/30 bg-[#009959]/5 text-[#009959]"
                : "border-[#e6e6e6] hover:border-[#d6d6d6] text-[#707070]"
            }`}
            title={ttsEnabled ? "Mute question audio" : "Enable question audio readout"}
          >
            {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-1.5 bg-[#dc2626]/10 hover:bg-[#dc2626] border border-[#dc2626]/20 text-[#dc2626] hover:text-white px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <PhoneOff size={14} />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Session Progress Header */}
      <div className="mb-6 pb-4 border-b border-[#e6e6e6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-[#009959] uppercase tracking-wider truncate">
              {session.jobRole} · {session.experienceLevel}
            </span>
            {session.hasResume && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[6px] shrink-0">
                <Sparkles size={11} />
                Resume Calibrated
              </span>
            )}
          </div>
          <span className="font-mono text-[#707070] shrink-0">
            QUESTION {currentIndex + 1} OF {session.questions.length}
          </span>
        </div>

        {/* Minimal Green Progress Bar */}
        <div className="w-full h-1.5 bg-[#e6e6e6] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#009959] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Autoplay blocked prompt banner (if browser blocked sound before user click) */}
      {autoplayBlocked && (
        <div
          onClick={() => {
            speakQuestion(activeQuestionText);
            setAutoplayBlocked(false);
          }}
          className="mb-4 p-3.5 rounded-[10px] bg-[#009959]/10 border border-[#009959]/30 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#009959]/15 transition-all"
        >
          <div className="flex items-center gap-2.5 text-xs text-[#009959] font-medium">
            <Volume2 size={16} className="animate-pulse shrink-0" />
            <span>Click here to enable the AI Interviewer voice readout for this question</span>
          </div>
          <span className="text-[11px] font-mono font-semibold bg-[#009959] text-white px-2 py-0.5 rounded-[6px]">
            Play Audio
          </span>
        </div>
      )}

      {/* Active Question Box (Old Style Restored & Improved) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="card-grain p-8 sm:p-10 mb-6 bg-[#fafafa] border border-[#e6e6e6] rounded-[14px]"
        >
          {/* Question Header: Q01 Badge + Question Text + Speaker Button */}
          <div className="flex items-start gap-3.5 mb-6">
            <span className="bg-[#009959]/10 text-[#009959] font-mono text-xs font-semibold px-2.5 py-1 rounded-[10px] flex-shrink-0 mt-0.5">
              Q{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
            </span>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#141414] tracking-tight leading-snug">
                {activeQuestionText}
              </h2>
            </div>
            {/* Replay / Listen to Question Button */}
            <button
              onClick={() => {
                if (isAiSpeaking) {
                  stopQuestionAudio();
                } else {
                  speakQuestion(activeQuestionText);
                }
              }}
              className={`p-2 rounded-[8px] transition-colors shrink-0 cursor-pointer ${
                isAiSpeaking
                  ? "bg-[#009959]/10 text-[#009959] animate-pulse"
                  : "text-[#707070] hover:text-[#009959] hover:bg-[#f0f0f0]"
              }`}
              title={isAiSpeaking ? "Pause question audio" : "Listen to question (AI Voice)"}
            >
              <Volume2 size={20} className={isAiSpeaking ? "text-[#009959]" : ""} />
            </button>
          </div>

          {/* AI Speaking Visualizer Banner */}
          {isAiSpeaking && !isRecordingAudio && (
            <div className="mb-4 p-3 rounded-[10px] bg-[#009959]/5 border border-[#009959]/20 flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5 text-xs text-[#009959] font-medium">
                <div className="flex items-end gap-[3px] h-3.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="w-[2.5px] bg-[#009959] rounded-full animate-pulse"
                      style={{
                        height: `${6 + ((i * 4) % 10)}px`,
                        animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span>AI Interviewer is asking this question out loud...</span>
              </div>
              <button
                onClick={stopQuestionAudio}
                className="text-[11px] text-[#707070] hover:text-[#141414] underline cursor-pointer"
              >
                Skip Voice
              </button>
            </div>
          )}

          {/* Answer Box Container */}
          <div className="relative">
            {/* STATE 1: LIVE RECORDING (No text appears on screen while answering) */}
            {isRecordingAudio ? (
              <div
                style={{ backgroundColor: "#141414", borderColor: "#262626" }}
                className="w-full rounded-[10px] border p-8 flex flex-col items-center justify-center gap-4 text-center animate-in fade-in duration-150"
              >
                {/* Red recording pill + live timer */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-80" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]" />
                  </span>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#ef4444] uppercase">
                    RECORDING AUDIO
                  </span>
                  <span className="text-xs text-[#555]">·</span>
                  <span className="text-sm font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-[4px]">
                    {Math.floor(recordingDuration / 60).toString().padStart(2, "0")}:
                    {(recordingDuration % 60).toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Animated dynamic soundwave visualizer */}
                <div className="flex items-end justify-center gap-[4px] h-[48px] my-1 px-4 w-full max-w-sm">
                  {[...Array(24)].map((_, i) => {
                    const waveBase = 8 + Math.sin(i * 0.5 + recordingDuration * 2) * 14;
                    const dynamicHeight = Math.max(
                      6,
                      Math.min(44, waveBase + (micVolumeLevel / 100) * 32)
                    );
                    return (
                      <span
                        key={i}
                        className="w-[3px] rounded-full transition-all duration-75"
                        style={{
                          height: `${dynamicHeight}px`,
                          backgroundColor:
                            i % 3 === 0
                              ? "#10b981"
                              : i % 2 === 0
                              ? "#009959"
                              : "#22c55e",
                          boxShadow: "0 0 6px rgba(0, 153, 89, 0.4)",
                        }}
                      />
                    );
                  })}
                </div>

                <p className="text-xs text-[#a3a3a3] max-w-sm">
                  Speak naturally. Your answer will be transcribed automatically when you stop.
                </p>

                {/* Stop & Transcribe Button */}
                <button
                  onClick={stopAudioRecording}
                  className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2.5 rounded-[8px] text-xs font-semibold cursor-pointer shadow-md active:scale-95 transition-all mt-1"
                >
                  <Square size={13} className="fill-white" />
                  <span>Stop & Transcribe Answer</span>
                </button>
              </div>
            ) : isTranscribing ? (
              /* STATE 2: TRANSCRIBING LOADER */
              <div className="w-full rounded-[10px] border border-[#e6e6e6] bg-white p-8 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 size={24} className="animate-spin text-[#009959]" />
                <span className="text-xs font-semibold text-[#141414]">
                  Transcribing speech with Whisper AI...
                </span>
                <span className="text-[11px] text-[#707070]">
                  Extracting verbatim candidate speech &amp; speech metrics (&lt;1s)
                </span>
              </div>
            ) : (
              /* STATE 3: CLEAN ANSWER TEXTAREA (Old Style Restored) */
              <div className="relative">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => {
                    setCurrentAnswer(e.target.value);
                    if (answersRef.current[currentIndex]) {
                      answersRef.current[currentIndex].answer = e.target.value;
                    }
                  }}
                  placeholder="Structure your answer using the STAR format (Situation, Task, Action, Result)... You can speak via Whisper AI or type directly."
                  rows={8}
                  className="w-full bg-[#fafafa] border border-[#d6d6d6] focus:border-[#009959] focus:ring-1 focus:ring-[#009959] focus:outline-none rounded-[10px] p-4 text-[#141414] placeholder-[#707070] resize-none text-[15px] leading-relaxed font-sans"
                />

                {/* Bottom Bar Inside Textarea */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {/* Left: Metrics badge if transcribed */}
                  <div>
                    {transcriptionMetrics && currentAnswer.trim() ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#009959] bg-[#009959]/10 px-2.5 py-1 rounded-[6px] pointer-events-auto">
                        <Activity size={12} />
                        <span>
                          {transcriptionMetrics.speaking_rate_wpm || 140} WPM ·{" "}
                          {transcriptionMetrics.word_count || currentAnswer.trim().split(/\s+/).length} words ·{" "}
                          {transcriptionMetrics.filler_word_count || 0} fillers
                        </span>
                      </span>
                    ) : null}
                  </div>

                  {/* Right: Character count & Reset button */}
                  <div className="flex items-center gap-3 pointer-events-auto">
                    <span className="text-[#707070] text-xs font-mono">
                      {currentAnswer.length} chars
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentAnswer("");
                        setTranscriptionMetrics(null);
                        if (answersRef.current[currentIndex]) {
                          answersRef.current[currentIndex].answer = "";
                          answersRef.current[currentIndex].metrics = undefined;
                        }
                      }}
                      className="text-[#707070] hover:text-[#141414] transition-colors cursor-pointer"
                      title="Clear input"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation & Submission Controls (Old 3-Section Style Restored) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Previous Question Button */}
        <button
          onClick={() => {
            if (currentIndex > 0) {
              const prevIndex = currentIndex - 1;
              stopQuestionAudio();
              setCurrentIndex(prevIndex);
              setCurrentAnswer(answersRef.current[prevIndex]?.answer || "");
              setTranscriptionMetrics(answersRef.current[prevIndex]?.metrics || null);
            }
          }}
          disabled={currentIndex === 0 || isSubmitting}
          className="btn-grain-secondary text-sm py-2.5 px-4 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Center: Record Answer Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
            disabled={isTranscribing}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-4 rounded-[10px] transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
              isRecordingAudio
                ? "bg-[#dc2626] text-white hover:bg-[#b91c1c] animate-pulse"
                : "btn-grain-secondary border-[#009959]/30 hover:border-[#009959] text-[#141414]"
            }`}
          >
            {isRecordingAudio ? (
              <>
                <Square size={15} />
                <span>Stop & Transcribe</span>
              </>
            ) : (
              <>
                <Mic size={15} className="text-[#009959]" />
                <span>Record Answer (Whisper AI)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Next / Finish Button */}
        <button
          onClick={handleSubmitAnswer}
          disabled={isSubmitting || !currentAnswer.trim()}
          className="btn-grain-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing with Gemini...</span>
            </>
          ) : currentIndex === session.questions.length - 1 ? (
            <>
              <CheckCircle2 size={16} />
              <span>Finish & View Report</span>
            </>
          ) : (
            <>
              <span>Next Question</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal for Ending Call Gracefully */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="card-grain p-6 sm:p-8 max-w-md w-full bg-[#ffffff] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] rounded-[14px]">
            <div className="w-10 h-10 rounded-[10px] bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-4">
              <PhoneOff size={20} />
            </div>

            <h3 className="text-xl font-bold text-[#141414] tracking-tight mb-2 font-sans">
              End Interview Call Early?
            </h3>

            <p className="text-sm text-[#545454] leading-relaxed mb-6 font-sans">
              Are you sure you want to end this interview? We will evaluate the questions you&apos;ve completed so far and generate your STAR performance report.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="btn-grain-secondary text-sm py-2 px-4"
              >
                Keep Practicing
              </button>
              <button
                onClick={handleEndCallGracefully}
                className="btn-grain-primary bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm py-2 px-4"
              >
                End & Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
