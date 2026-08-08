'use client';

/**
 * Messages & Communication Hub — Lifecycle-Gated
 *
 * Luminous Precision Design — replaces legacy CSS modules.
 * Connects to backend via fetchMessageThreads() / fetchThreadMessages() / sendMessage() API.
 * Crew Isolation: ENFORCED — zero crew data exposure.
 *
 * LIFECYCLE GATE: Message Center ONLY accessible when PROJECT_ACTIVE = TRUE.
 * If no active projects exist, a locked state is shown.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Search,
  Paperclip,
  Send,
  CheckCheck,
  Clock,
  Shield,
  ChevronRight,
  X,
  Lock,
  Zap,
  FileText,
} from 'lucide-react';
import {
  fetchActiveProjects,
  fetchMessageThreads,
  fetchThreadMessages,
  sendThreadMessage,
} from '@/dashboards/project-owner/services/project-owner-api';

// ── Types ──────────────────────────────────────────────────────────────────
interface Thread {
  id: string;
  projectId: string;
  projectTitle: string;
  counterparty: string;
  counterpartyRole: string;
  avatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  status: string;
}

interface Message {
  id: string;
  threadId: string;
  sender: string;
  text: string;
  timestamp: string;
  status: string;
  attachments?: { name: string; size: string; url?: string }[];
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-7 animate-pulse" style={{ height: 'calc(100vh - 120px)' }}>
      <div>
        <div className="h-5 w-36 rounded-full mb-3" style={{ background: '#E8E8E7' }} />
        <div className="h-8 w-64 rounded-lg mb-2" style={{ background: '#E8E8E7' }} />
        <div className="h-4 w-96 rounded-lg" style={{ background: '#F0F0EE' }} />
      </div>
      <div className="flex-1 rounded-3xl overflow-hidden" style={{ border: '1px solid #E8E8E7', background: '#fff' }}>
        <div className="grid h-full" style={{ gridTemplateColumns: '360px 1fr' }}>
          <div className="p-4 flex flex-col gap-3" style={{ borderRight: '1px solid #F0F0EE' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-2xl" style={{ background: '#F5F5F3' }}>
                <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ background: '#E8E8E7' }} />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 w-40 rounded" style={{ background: '#E8E8E7' }} />
                  <div className="h-3 w-24 rounded" style={{ background: '#F0F0EE' }} />
                  <div className="h-3 w-full rounded" style={{ background: '#F0F0EE' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <div className="p-4 flex gap-3" style={{ borderBottom: '1px solid #F0F0EE' }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: '#E8E8E7' }} />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 rounded" style={{ background: '#E8E8E7' }} />
                <div className="h-3 w-28 rounded" style={{ background: '#F0F0EE' }} />
              </div>
            </div>
            <div className="flex-1 p-5 flex flex-col gap-3" style={{ background: '#FAFAF9' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                  <div className="h-12 rounded-2xl" style={{ width: '60%', background: '#E8E8E7' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Locked State (No Active Projects) ──────────────────────────────────────
function LockedState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(15, 99, 27, 0.06)' }}
      >
        <Lock size={32} style={{ color: '#2F7D32' }} />
      </div>
      <h2
        className="text-xl font-bold mb-2"
        style={{ color: '#1A1C1C', letterSpacing: '-0.02em' }}
      >
        Messages Unavailable
      </h2>
      <p
        className="text-sm mb-6 max-w-md"
        style={{ color: '#707A6C', lineHeight: 1.6 }}
      >
        The Communication Hub is only available once you have an active project.
        Complete your RFQ, accept a bid, sign your contract, and fund your project to unlock messaging.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard/project-owner/rfq/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03]"
          style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}
        >
          <Zap size={14} />
          Create RFQ
        </Link>
        <Link
          href="/dashboard/project-owner/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ color: '#0F631B', background: 'rgba(15, 99, 27, 0.06)' }}
        >
          View Projects
        </Link>
      </div>
    </div>
  );
}

// ── Status helpers ─────────────────────────────────────────────────────────
function statusDotColor(status: string): string {
  if (status === 'active') return '#0F631B';
  if (status === 'pending') return '#B8860B';
  return '#707A6C';
}

// ── Component ──────────────────────────────────────────────────────────────
export default function POMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [hasActiveProjects, setHasActiveProjects] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showThread, setShowThread] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Lifecycle Gate Check ──────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const [projRes, threadRes] = await Promise.all([
          fetchActiveProjects(),
          fetchMessageThreads(),
        ]);
        const activeProjs = projRes.data || [];
        const hasActive = activeProjs.some((p) =>
          ['PROJECT_ACTIVATED', 'MILESTONES_EXECUTING', 'PAYMENTS_RELEASING'].includes(p.status)
        );
        setHasActiveProjects(hasActive);
        if (hasActive && threadRes.data) {
          setThreads(threadRes.data as Thread[]);
          if (threadRes.data.length > 0) {
            setActiveThread(threadRes.data[0].id);
          }
        }
      } catch {
        setHasActiveProjects(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ── Load messages when thread changes ─────────────────────────────────
  useEffect(() => {
    if (!activeThread) return;
    async function loadMessages() {
      setMessagesLoading(true);
      try {
        const res = await fetchThreadMessages(activeThread);
        setMessages((res.data || []) as Message[]);
      } catch {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    }
    loadMessages();
  }, [activeThread]);

  // ── Auto-scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await sendThreadMessage(activeThread, input.trim());
      if (res.success && res.data) {
        const msg = res.data as unknown as Message;
        setMessages((prev) => [...prev, msg]);
        setInput('');
      }
    } finally {
      setSending(false);
    }
  }, [input, activeThread, sending]);

  const currentThread = threads.find((t) => t.id === activeThread);
  const filtered = threads.filter(
    (t) =>
      t.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <MessagesSkeleton />;

  return (
    <div className="flex flex-col gap-7" style={{ height: 'calc(100vh - 120px)', maxHeight: 'calc(100vh - 120px)' }}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <header className="flex-shrink-0">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3"
          style={{
            background: 'rgba(15, 99, 27, 0.07)',
            color: '#0F631B',
            letterSpacing: '0.08em',
            fontSize: '0.6875rem',
          }}
        >
          <MessageCircle size={11} strokeWidth={2.5} />
          <span>Communication Hub</span>
        </div>
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: '#1A1C1C', letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Messages <span style={{ color: '#0F631B' }}>&amp; Updates</span>
        </h1>
        <p className="text-sm" style={{ color: '#40493D', fontSize: '0.9375rem' }}>
          Project-bound, audited communication with your installers and EPC contractors.
        </p>
      </header>

      {/* ── Lifecycle Gate ────────────────────────────────────────────── */}
      {!hasActiveProjects ? (
        <div
          className="flex-1 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ border: '1px solid #E8E8E7', background: '#fff' }}
        >
          <LockedState />
        </div>
      ) : (
        /* ── Messenger Layout ──────────────────────────────────────── */
        <div
          className="flex-1 min-h-0 rounded-3xl overflow-hidden relative"
          style={{ border: '1px solid #E8E8E7', background: '#fff' }}
        >
          <div className="grid h-full" style={{ gridTemplateColumns: '360px 1fr' }}
            id="messages-grid"
          >
            {/* ── Thread Sidebar ──────────────────────────────────── */}
            <div
              className="flex flex-col min-h-0"
              style={{ borderRight: '1px solid #F0F0EE' }}
              data-mobile-hidden={showThread ? 'true' : 'false'}
              id="thread-sidebar"
            >
              {/* Search */}
              <div className="flex-shrink-0 p-4" style={{ borderBottom: '1px solid #F0F0EE' }}>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: '12px', color: '#A0A79C' }}
                  />
                  <input
                    className="w-full py-2.5 pr-3.5 rounded-xl text-sm font-medium outline-none transition-colors"
                    style={{
                      paddingLeft: '36px',
                      background: '#F5F5F3',
                      border: 'none',
                      color: '#1A1C1C',
                      fontSize: '0.875rem',
                    }}
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-sm" style={{ color: '#A0A79C' }}>
                    No conversations match your search.
                  </div>
                )}
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    className="w-full flex items-start gap-3 p-3.5 rounded-2xl border-none text-left cursor-pointer transition-colors relative"
                    style={{
                      background: activeThread === t.id ? 'rgba(15, 99, 27, 0.06)' : 'transparent',
                    }}
                    onClick={() => {
                      setActiveThread(t.id);
                      setShowThread(true);
                    }}
                    onMouseEnter={(e) => {
                      if (activeThread !== t.id) e.currentTarget.style.background = '#F5F5F3';
                    }}
                    onMouseLeave={(e) => {
                      if (activeThread !== t.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}
                    >
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex justify-between items-baseline">
                        <span
                          className="text-sm font-bold truncate"
                          style={{ color: '#1A1C1C' }}
                        >
                          {t.counterparty}
                        </span>
                        <span
                          className="text-xs font-medium flex-shrink-0 ml-2"
                          style={{ color: '#A0A79C', fontSize: '0.6875rem' }}
                        >
                          {t.lastTimestamp}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold uppercase"
                        style={{
                          color: '#0F631B',
                          letterSpacing: '0.06em',
                          fontSize: '0.6875rem',
                        }}
                      >
                        {t.projectTitle}
                      </span>
                      <span
                        className="text-sm truncate block"
                        style={{ color: '#707A6C', fontSize: '0.8125rem' }}
                      >
                        {t.lastMessage}
                      </span>
                    </div>
                    {t.unreadCount > 0 && (
                      <span
                        className="absolute top-3.5 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
                        style={{ background: '#0F631B', fontSize: '0.6875rem' }}
                      >
                        {t.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Audit notice */}
              <div
                className="flex items-center gap-1.5 px-4 py-3 flex-shrink-0 text-xs font-medium"
                style={{
                  borderTop: '1px solid #F0F0EE',
                  color: '#A0A79C',
                  fontSize: '0.6875rem',
                }}
              >
                <Shield size={12} />
                <span>All messages are encrypted and audit-logged per project contract.</span>
              </div>
            </div>

            {/* ── Chat Pane ───────────────────────────────────────── */}
            <div className="flex flex-col min-h-0" id="chat-pane"
              data-mobile-visible={showThread ? 'true' : 'false'}
            >
              {currentThread ? (
                <>
                  {/* Chat header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                    style={{ borderBottom: '1px solid #F0F0EE' }}
                  >
                    <button
                      className="hidden md-max:flex p-1 rounded-lg border-none cursor-pointer"
                      style={{ background: 'none', color: '#40493D' }}
                      onClick={() => setShowThread(false)}
                      id="chat-back-btn"
                    >
                      <X size={18} />
                    </button>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}
                    >
                      {currentThread.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-bold" style={{ color: '#1A1C1C', fontSize: '0.9375rem' }}>
                        {currentThread.counterparty}
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#707A6C' }}>
                        {currentThread.projectTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold capitalize" style={{ color: statusDotColor(currentThread.status) }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: statusDotColor(currentThread.status) }} />
                      {currentThread.status}
                    </div>
                    <ChevronRight size={16} style={{ color: '#A0A79C' }} />
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3"
                    style={{ background: '#FAFAF9' }}
                  >
                    <div
                      className="text-center text-xs font-bold uppercase my-2"
                      style={{ color: '#A0A79C', letterSpacing: '0.08em', fontSize: '0.6875rem' }}
                    >
                      Today
                    </div>

                    {messagesLoading ? (
                      <div className="flex flex-col gap-3 animate-pulse">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                            <div className="h-12 rounded-2xl" style={{ width: '55%', background: '#E8E8E7' }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="flex flex-col gap-1.5 max-w-[72%]"
                          style={{ alignSelf: msg.sender === 'owner' ? 'flex-end' : 'flex-start' }}
                        >
                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-col gap-1.5">
                              {msg.attachments.map((a) => (
                                <div
                                  key={a.name}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                                  style={{ background: 'rgba(15, 99, 27, 0.06)', color: '#0F631B' }}
                                >
                                  <Paperclip size={12} />
                                  <span>{a.name}</span>
                                  <span className="ml-auto font-medium" style={{ color: '#A0A79C' }}>{a.size}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Bubble */}
                          <p
                            className="px-4 py-3 m-0 text-sm"
                            style={{
                              borderRadius: '18px',
                              fontSize: '0.9375rem',
                              lineHeight: 1.5,
                              ...(msg.sender === 'owner'
                                ? { background: '#0F631B', color: '#fff', borderBottomRightRadius: '4px' }
                                : { background: '#fff', color: '#1A1C1C', border: '1px solid #E8E8E7', borderBottomLeftRadius: '4px' }),
                            }}
                          >
                            {msg.text}
                          </p>
                          {/* Footer */}
                          <div
                            className="flex items-center gap-1"
                            style={{ justifyContent: msg.sender === 'owner' ? 'flex-end' : 'flex-start' }}
                          >
                            <span className="text-xs font-medium" style={{ color: '#A0A79C', fontSize: '0.6875rem' }}>
                              {msg.timestamp}
                            </span>
                            {msg.sender === 'owner' && (
                              msg.status === 'read'
                                ? <CheckCheck size={13} style={{ color: '#0F631B' }} />
                                : <Clock size={12} style={{ color: '#A0A79C' }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div
                    className="flex items-center gap-2.5 px-5 py-4 flex-shrink-0"
                    style={{ borderTop: '1px solid #F0F0EE', background: '#fff' }}
                  >
                    <button
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-colors"
                      style={{ background: '#F5F5F3', color: '#707A6C' }}
                      aria-label="Attach file"
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#EDECEA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F5F3'; }}
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      className="flex-1 py-2.5 px-4 rounded-2xl text-sm font-medium outline-none transition-colors"
                      style={{ background: '#F5F5F3', border: 'none', color: '#1A1C1C', fontSize: '0.9375rem' }}
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    />
                    <button
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-all"
                      style={{
                        background: input.trim() ? '#0F631B' : '#E8E8E7',
                        color: input.trim() ? '#fff' : '#A0A79C',
                        transform: input.trim() ? 'scale(1)' : 'scale(1)',
                      }}
                      onClick={handleSend}
                      disabled={sending}
                      aria-label="Send message"
                      onMouseEnter={(e) => {
                        if (input.trim()) {
                          e.currentTarget.style.background = '#0A4D14';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = input.trim() ? '#0F631B' : '#E8E8E7';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center" style={{ background: '#FAFAF9' }}>
                  <div className="text-center">
                    <MessageCircle size={40} style={{ color: '#E8E8E7' }} className="mx-auto mb-3" />
                    <p className="text-sm font-medium" style={{ color: '#A0A79C' }}>
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Responsive Styles ──────────────────────────────────── */}
      <style jsx>{`
        @media (max-width: 768px) {
          #messages-grid {
            grid-template-columns: 1fr !important;
            position: relative;
          }
          #thread-sidebar[data-mobile-hidden="true"] {
            display: none;
          }
          #chat-pane[data-mobile-visible="false"] {
            display: none;
          }
          #chat-pane[data-mobile-visible="true"] {
            position: absolute;
            inset: 0;
            background: #fff;
            z-index: 10;
          }
          #chat-back-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
