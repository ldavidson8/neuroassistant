"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Pause, Play, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function PomodoroTimer() {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  // Timer state
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Audio for notifications
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playNotification();

      // Handle session completion
      if (mode === "work") {
        const newSessions = sessions + 1;
        setSessions(newSessions);

        if (newSessions % sessionsBeforeLongBreak === 0) {
          setMode("longBreak");
          setTimeLeft(longBreakDuration * 60);
        } else {
          setMode("shortBreak");
          setTimeLeft(shortBreakDuration * 60);
        }
      } else {
        // After any break, go back to work mode
        setMode("work");
        setTimeLeft(workDuration * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    timeLeft,
    mode,
    sessions,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
  ]);

  // Update timer when settings change
  useEffect(() => {
    if (mode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, mode]);

  // Play notification sound
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  // Timer controls
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const changeMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);

    if (newMode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (newMode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    let totalTime;
    if (mode === "work") {
      totalTime = workDuration * 60;
    } else if (mode === "shortBreak") {
      totalTime = shortBreakDuration * 60;
    } else {
      totalTime = longBreakDuration * 60;
    }

    return 100 - (timeLeft / totalTime) * 100;
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <Tabs
          value={mode}
          onValueChange={(value) => changeMode(value as TimerMode)}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
        </Tabs>

        <div
          className={`text-center mb-8 transition-colors ${
            mode === "work"
              ? "text-rose-600"
              : mode === "shortBreak"
              ? "text-emerald-600"
              : "text-blue-600"
          }`}
        >
          <div className="text-7xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-sm text-gray-500">
            Session {sessions + 1} - {mode === "work" ? "Focus" : "Break"}
          </div>
        </div>

        <Progress
          value={calculateProgress()}
          className={`h-2 mb-8 ${
            mode === "work"
              ? "bg-rose-100"
              : mode === "shortBreak"
              ? "bg-emerald-100"
              : "bg-blue-100"
          }`}
        />

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            onClick={toggleTimer}
            className={`w-32 ${
              mode === "work"
                ? "bg-rose-600 hover:bg-rose-700"
                : mode === "shortBreak"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isActive ? "Pause" : "Start"}
          </Button>

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open settings">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Work Duration: {workDuration} min</span>
                  </div>
                  <Slider
                    value={[workDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setWorkDuration(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Short Break: {shortBreakDuration} min</span>
                  </div>
                  <Slider
                    value={[shortBreakDuration]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => setShortBreakDuration(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Long Break: {longBreakDuration} min</span>
                  </div>
                  <Slider
                    value={[longBreakDuration]}
                    min={10}
                    max={30}
                    step={5}
                    onValueChange={(value) => setLongBreakDuration(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Sessions before long break: {sessionsBeforeLongBreak}
                    </span>
                  </div>
                  <Slider
                    value={[sessionsBeforeLongBreak]}
                    min={2}
                    max={6}
                    step={1}
                    onValueChange={(value) =>
                      setSessionsBeforeLongBreak(value[0])
                    }
                  />
                </div>
              </div>
              <Button onClick={() => setSettingsOpen(false)} className="w-full">
                Save Settings
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-500">
          <Bell className="h-4 w-4 mr-2" />
          <span>Notification sound will play when timer ends</span>
        </div>
      </CardContent>
    </Card>
  );
}
