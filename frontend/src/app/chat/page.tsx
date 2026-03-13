"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Heart, Activity, Stethoscope } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { PatientDemographicsForm } from "@/components/PatientDemographicsForm";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { Button } from "@/components/ui/button";
import type { ChatMessage, ChatSession, PatientDemographics, DiagnosisResult } from "@/types/chat";

const SUGGESTIONS = [
  "I have fever and headache",
  "What are symptoms of malaria?",
  "Chest pain and shortness of breath",
  "Persistent cough for 2 weeks",
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [demographics, setDemographics] = useState<PatientDemographics>({ name: "", age: "", gender: "" });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const createNewChat = () => {
    const id = generateId();
    const newSession: ChatSession = { id, title: "New Consultation", messages: [], createdAt: new Date() };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
  };

  const sendMessage = async (content: string, file?: File) => {
    let sessionId = activeSessionId;
    if (!sessionId) {
      const id = generateId();
      const newSession: ChatSession = { id, title: content.slice(0, 30) || "New Consultation", messages: [], createdAt: new Date() };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(id);
      sessionId = id;
    }

    const userMsg: ChatMessage = { id: generateId(), role: "user", content, timestamp: new Date() };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, title: s.messages.length === 0 ? content.slice(0, 30) : s.title, messages: [...s.messages, userMsg] }
          : s
      )
    );

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("symptoms", content);
      formData.append("age", demographics.age || "25");
      formData.append("gender", demographics.gender || "male");
      formData.append("worker_id", "00000000-0000-0000-0000-000000000000"); 
      if (file) formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyze/combined", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      const diagnosis: DiagnosisResult = {
        severity: data.severity || "Medium",
        diseases: data.diseases || data.top_diseases || [{ name: "Unknown", confidence: 0 }],
        advice: data.advice || data.medical_advice || "Please consult a healthcare professional.",
      };

      const aiMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        diagnosis,
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
      );
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `⚠️ Could not reach the server. Please ensure the backend is running. Error: ${err instanceof Error ? err.message : "Unknown"}`,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, errorMsg] } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-hospital-blue-light via-white to-hospital-green-light">
      {/* Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          sessions={sessions}
          activeId={activeSessionId}
          onNewChat={createNewChat}
          onSelect={setActiveSessionId}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-hospital-blue-primary p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold bg-gradient-to-r from-hospital-blue-primary to-hospital-green bg-clip-text text-transparent">SANJEEVANI AI</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-hospital-blue-primary hover:bg-hospital-blue-light" data-testid="logout-btn">
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" /> Exit
            </Link>
          </Button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-hospital-blue-primary p-4 rounded-2xl shadow-lg">
                    <Stethoscope className="h-10 w-10 text-white" />
                  </div>
                  <div className="bg-hospital-green p-4 rounded-2xl shadow-lg">
                    <Activity className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <div className="bg-hospital-blue-primary p-4 rounded-2xl shadow-lg">
                    <Heart className="h-10 w-10 text-white animate-heartbeat" />
                  </div>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Hello, {demographics.name || "Guest"}! 👋
                </h2>
                <p className="text-lg text-gray-600 mb-4">I'm your AI Medical Assistant</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">Describe your symptoms and I'll provide preliminary medical insights to help you understand your condition.</p>
              </motion.div>

              {/* Suggestion Pills */}
              <div className="w-full max-w-2xl">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">Common Queries</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTIONS.map((s, index) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => sendMessage(s)}
                        className="w-full text-left justify-start text-sm border-2 border-gray-200 hover:border-hospital-blue-primary hover:bg-hospital-blue-light rounded-xl py-6 px-4 transition-all"
                        data-testid={`suggestion-${index}`}
                      >
                        <Activity className="h-4 w-4 mr-2 text-hospital-blue-primary" />
                        {s}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatePresence>
                {activeSession.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.diagnosis ? (
                      <DiagnosisCard diagnosis={msg.diagnosis} />
                    ) : (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        {msg.role === "assistant" && (
                          <div className="bg-hospital-blue-primary p-2 rounded-lg flex-shrink-0">
                            <Stethoscope className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-hospital-blue-primary to-hospital-blue-dark text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-hospital-blue-primary p-2 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-hospital-blue-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-hospital-blue-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-hospital-blue-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Demographics + Input */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-md pt-4 pb-6 px-4 md:px-8 shadow-lg">
          <div className="max-w-3xl mx-auto space-y-4">
            <PatientDemographicsForm demographics={demographics} onChange={setDemographics} />
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
