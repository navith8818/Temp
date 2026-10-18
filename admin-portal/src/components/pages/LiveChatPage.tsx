'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import {
  Send,
  Sparkles
} from 'lucide-react';

export const LiveChatPage: React.FC = () => {
  const {
    liveChats,
    sendChatMessage,
    acceptChatSession,
    closeChatSession
  } = useAdminData();

  const [activeChatId, setActiveChatId] = useState<string>(liveChats[0]?.id || '');
  const [chatInput, setChatInput] = useState('');

  const activeChat = liveChats.find(c => c.id === activeChatId) || liveChats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !chatInput.trim()) return;

    sendChatMessage(activeChat.id, chatInput.trim());
    setChatInput('');
  };

  const insertCannedResponse = (text: string) => {
    setChatInput(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
          Live Chat Operations
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Direct real-time customer messaging, agent acceptance queue, and immediate service context.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
        {/* Left Col: Queue / Active Conversations */}
        <div className="border-r border-gray-200/80 flex flex-col">
          <div className="p-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Conversations ({liveChats.length})
            </span>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto flex-1 custom-scrollbar">
            {liveChats.map(chat => {
              const isSelected = chat.id === activeChat?.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#fcf5f1]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-[#e8702a]' : 'text-gray-900'}`}>
                      {chat.customerName}
                    </span>
                    <AdminBadge
                      variant={
                        chat.status === 'WAITING'
                          ? 'warning'
                          : chat.status === 'ACTIVE'
                          ? 'success'
                          : 'neutral'
                      }
                    >
                      {chat.status}
                    </AdminBadge>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5">
                    <span>{chat.activeServiceDomain || 'General'}</span>
                    <span>{chat.startedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Col: Active Chat Thread & Quick Context */}
        <div className="md:col-span-2 flex flex-col">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-gray-200/80 bg-white flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                    <span>{activeChat.customerName}</span>
                    <span className="text-gray-400">&bull;</span>
                    <span className="text-gray-500 font-mono text-[11px]">{activeChat.customerEmail}</span>
                  </div>
                  {activeChat.activeServiceDomain && (
                    <div className="text-[10px] text-gray-400">
                      Domain: <span className="font-semibold text-gray-700">{activeChat.activeServiceDomain}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeChat.status === 'WAITING' ? (
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => acceptChatSession(activeChat.id)}
                    >
                      Accept Chat
                    </AdminButton>
                  ) : activeChat.status === 'ACTIVE' ? (
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() => closeChatSession(activeChat.id)}
                    >
                      Resolve Session
                    </AdminButton>
                  ) : (
                    <AdminBadge variant="neutral">Resolved</AdminBadge>
                  )}
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-[#fdfdfd]">
                {activeChat.messages.map(msg => {
                  const isAgent = msg.sender === 'AGENT';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400">
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>&bull;</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-[#1a1a20] text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-gray-200/90 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Responses Helper */}
              <div className="px-3.5 py-1.5 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-gray-400 shrink-0 flex items-center gap-1 font-semibold text-[10px]">
                  <Sparkles size={11} className="text-[#e8702a]" /> Canned:
                </span>
                <button
                  type="button"
                  onClick={() => insertCannedResponse('Hello! How can I assist you with your Server Salad hosting today?')}
                  className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-[#e8702a] whitespace-nowrap cursor-pointer"
                >
                  Greeting
                </button>
                <button
                  type="button"
                  onClick={() => insertCannedResponse('All Frankfurt NVMe server nodes are fully operational with normal response times.')}
                  className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-[#e8702a] whitespace-nowrap cursor-pointer"
                >
                  Status check
                </button>
                <button
                  type="button"
                  onClick={() => insertCannedResponse('I have checked your account and updated the PHP extension settings for your cPanel user.')}
                  className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-[#e8702a] whitespace-nowrap cursor-pointer"
                >
                  Resolved update
                </button>
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder={
                    activeChat.status === 'CLOSED'
                      ? 'Session closed.'
                      : 'Type message to customer...'
                  }
                  disabled={activeChat.status === 'CLOSED'}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-gray-50 focus:bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a] disabled:opacity-50"
                />
                <AdminButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={activeChat.status === 'CLOSED' || !chatInput.trim()}
                  icon={<Send size={13} />}
                >
                  Send
                </AdminButton>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-400 text-xs">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
