'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Clock } from 'lucide-react';
import { fetchMessages, sendMessage, Message } from '@/dashboards/project-owner/services/project-owner-api';

interface ChatWindowProps {
  projectId: string;
}

export default function ChatWindow({ projectId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetchMessages(projectId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const res = await sendMessage(projectId, inputText);
    if (res.success && res.data) {
      setMessages([...messages, res.data]);
      setInputText('');
    }
    setSending(false);
  };

  return (
    <div className="surface-card h-[500px] flex flex-col overflow-hidden animate-in fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="title-sm">Project Collaboration</h3>
            <p className="label-sm text-muted">SolarPro Nigeria Support</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 label-sm text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Online
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton skeleton--text w-1/2 h-10 rounded-2xl" />
            <div className="skeleton skeleton--text w-1/3 h-10 rounded-2xl ml-auto bg-primary/5" />
            <div className="skeleton skeleton--text w-2/3 h-10 rounded-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted gap-2">
            <MessageSquare size={32} strokeWidth={1} />
            <p className="body-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.isFromMe ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2`}
            >
              <div className="flex items-center gap-2 mb-1">
                {!m.isFromMe && <span className="label-xs font-bold text-primary">{m.sender}</span>}
                <span className="label-xs text-muted flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Clock size={10} /> {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`
                max-w-[85%] px-4 py-2.5 rounded-2xl body-sm shadow-sm
                ${m.isFromMe 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-neutral-100 text-foreground rounded-tl-none'}
              `}>
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-border bg-white flex gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message installer..."
          className="form-input flex-1 py-2.5"
          disabled={sending}
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || sending}
          className="btn btn-primary p-2.5 aspect-square flex items-center justify-center shrink-0"
        >
          {sending ? (
            <div className="loading loading-spinner loading-xs"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
}
