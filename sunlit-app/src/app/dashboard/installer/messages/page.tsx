'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Search,
  Paperclip,
  Send,
  CheckCheck,
  Clock,
  Shield,
  X,
} from 'lucide-react';
import styles from './page.module.css';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: { name: string; size: string }[];
}

interface Thread {
  id: string;
  project: string;
  counterparty: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: 'active' | 'pending' | 'closed';
}

const THREADS: Thread[] = [
  {
    id: 'th-001',
    project: 'Lekki Residential Solar',
    counterparty: 'Bayo Adeyemi',
    role: 'Project Owner',
    avatar: 'BA',
    lastMessage: 'Please confirm if you will arrive at 8am tomorrow with the crew.',
    lastTime: '1h ago',
    unread: 1,
    status: 'active',
  },
  {
    id: 'th-002',
    project: 'Victoria Island Commercial',
    counterparty: 'Chinwe Obi',
    role: 'Project Owner',
    avatar: 'CO',
    lastMessage: 'Great, see you on Monday. Please bring the commissioning documents.',
    lastTime: '3h ago',
    unread: 0,
    status: 'active',
  },
];

const MESSAGES: Record<string, Message[]> = {
  'th-001': [
    { id: 'm1', sender: 'them', text: 'Hi! Just checking on the Milestone 2 progress. Are panels ordered?', timestamp: '09:10 AM', status: 'read' },
    { id: 'm2', sender: 'me', text: 'Yes, panels arrive Monday from the supplier. We will begin install Tuesday.', timestamp: '09:45 AM', status: 'read' },
    { id: 'm3', sender: 'them', text: 'Please confirm if you will arrive at 8am tomorrow with the crew.', timestamp: '10:22 AM', status: 'delivered' },
  ],
  'th-002': [
    { id: 'm1', sender: 'them', text: 'Great, see you on Monday. Please bring the commissioning documents.', timestamp: 'Yesterday', status: 'read' },
  ],
};

function statusColor(status: Thread['status']) {
  if (status === 'active') return '#0F631B';
  if (status === 'pending') return '#B8860B';
  return '#707A6C';
}

export default function InstallerMessagesPage() {
  const [activeThread, setActiveThread] = useState<string>('th-001');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES);
  const [showThread, setShowThread] = useState(false);

  const thread = THREADS.find((t) => t.id === activeThread)!;
  const threadMessages = messages[activeThread] || [];
  const filtered = THREADS.filter(
    (t) =>
      t.project.toLowerCase().includes(search.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(search.toLowerCase())
  );

  function handleSend() {
    if (!input.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages((p) => ({ ...p, [activeThread]: [...(p[activeThread] || []), msg] }));
    setInput('');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <MessageCircle size={11} strokeWidth={2.5} />
          <span>Comms Hub</span>
        </div>
        <h1 className={styles.title}>
          Messages <span className={styles.titleAccent}>&amp; Updates</span>
        </h1>
        <p className={styles.subtitle}>Project-bound, audited communication with clients and admins.</p>
      </header>

      <div className={styles.messenger}>
        {/* Thread Sidebar */}
        <div className={`${styles.sidebar} ${showThread ? styles.sidebarHidden : ''}`}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.threadList}>
            {filtered.map((t) => (
              <button
                key={t.id}
                className={`${styles.threadItem} ${activeThread === t.id ? styles.threadItemActive : ''}`}
                onClick={() => { setActiveThread(t.id); setShowThread(true); }}
              >
                <div className={styles.threadAvatar} style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}>
                  {t.avatar}
                </div>
                <div className={styles.threadBody}>
                  <div className={styles.threadTop}>
                    <span className={styles.threadName}>{t.counterparty}</span>
                    <span className={styles.threadTime}>{t.lastTime}</span>
                  </div>
                  <span className={styles.threadProject}>{t.project}</span>
                  <span className={styles.threadPreview}>{t.lastMessage}</span>
                </div>
                {t.unread > 0 && <span className={styles.unreadBadge}>{t.unread}</span>}
              </button>
            ))}
          </div>
          <div className={styles.auditNotice}>
            <Shield size={12} />
            <span>All messages are encrypted and audit-logged.</span>
          </div>
        </div>

        {/* Chat Pane */}
        <div className={`${styles.chatPane} ${showThread ? styles.chatPaneVisible : ''}`}>
          <div className={styles.chatHeader}>
            <button className={styles.backBtn} onClick={() => setShowThread(false)}><X size={18} /></button>
            <div className={styles.chatAvatar} style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}>
              {thread.avatar}
            </div>
            <div className={styles.chatMeta}>
              <span className={styles.chatName}>{thread.counterparty}</span>
              <span className={styles.chatProject}>{thread.role} · {thread.project}</span>
            </div>
            <div className={styles.chatStatus} style={{ color: statusColor(thread.status) }}>
              <div className={styles.chatStatusDot} style={{ background: statusColor(thread.status) }} />
              {thread.status}
            </div>
          </div>

          <div className={styles.chatMessages}>
            <div className={styles.dateDivider}>Today</div>
            {threadMessages.map((msg) => (
              <div key={msg.id} className={`${styles.bubble} ${msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem}`}>
                {msg.attachments?.map((a) => (
                  <div key={a.name} className={styles.attachmentChip}>
                    <Paperclip size={12} />
                    <span>{a.name}</span>
                    <span className={styles.attachmentSize}>{a.size}</span>
                  </div>
                ))}
                <p className={styles.bubbleText}>{msg.text}</p>
                <div className={styles.bubbleFooter}>
                  <span className={styles.bubbleTime}>{msg.timestamp}</span>
                  {msg.sender === 'me' && (
                    msg.status === 'read'
                      ? <CheckCheck size={13} style={{ color: '#0F631B' }} />
                      : <Clock size={12} style={{ color: '#A0A79C' }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chatInputWrap}>
            <button className={styles.attachBtn} aria-label="Attach file"><Paperclip size={18} /></button>
            <input
              className={styles.chatInput}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            />
            <button
              className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ''}`}
              onClick={handleSend}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
