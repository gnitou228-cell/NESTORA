import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Send, MapPin, Building, ArrowLeft, Loader, User, MessageSquare } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

export const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    fetchConversations();

    const channel = supabase.channel('public:Message')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message' }, (payload) => {
        handleNewRealtimeMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNewRealtimeMessage = (newMessageRecord: any) => {
    // If the message is for the active conversation, add it
    setMessages(prev => {
      if (activeConversation && newMessageRecord.conversationId === activeConversation.id) {
        // Prevent duplicate if we already sent it
        if (!prev.find(m => m.id === newMessageRecord.id)) {
          return [...prev, newMessageRecord];
        }
      }
      return prev;
    });

    // Also reload conversations to update latest message & unread count
    fetchConversations();
  };

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      markAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/conversations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      await fetch(`http://localhost:5000/api/conversations/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local unread count
      setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, _count: { ...c._count, messages: 0 } } : c
      ));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/conversations/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const otherMember = c.members.find((m: any) => m.userId !== user?.id);
    const partnerName = otherMember?.user.profile ? `${otherMember.user.profile.firstName} ${otherMember.user.profile.lastName}` : (otherMember?.user.agency?.name || 'Utilisateur');
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.property?.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getPartner = (conversation: any) => {
    const otherMember = conversation.members.find((m: any) => m.userId !== user?.id);
    return otherMember?.user;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nestora-ivory">
        <Loader className="w-12 h-12 text-nestora-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-nestora-ivory pt-16">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-nestora-navy mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une conversation..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-nestora-navy focus:ring-2 focus:ring-nestora-navy/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="mb-4">Vous n'avez aucune conversation pour le moment.</p>
              <Link to="/recherche" className="btn btn-primary">Explorer les annonces</Link>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const partner = getPartner(conv);
              const partnerName = partner?.profile ? `${partner.profile.firstName} ${partner.profile.lastName}` : (partner?.agency?.name || 'Utilisateur inconnu');
              const lastMessage = conv.messages[0];
              const unreadCount = conv._count?.messages || 0;
              const isActive = activeConversation?.id === conv.id;

              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50/50 border-l-4 border-l-nestora-gold' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-nestora-navy truncate pr-2">{partnerName}</div>
                    {lastMessage && (
                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {isToday(new Date(lastMessage.createdAt)) ? format(new Date(lastMessage.createdAt), 'HH:mm') : format(new Date(lastMessage.createdAt), 'dd MMM', { locale: fr })}
                      </div>
                    )}
                  </div>
                  
                  {conv.property && (
                    <div className="text-xs font-medium text-nestora-gold mb-1 truncate flex items-center">
                      <Building size={12} className="mr-1 inline" />
                      {conv.property.title}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 truncate pr-4 flex-1">
                      {lastMessage ? lastMessage.content : 'Nouvelle conversation'}
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-nestora-navy text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area - Active Conversation */}
      <div className={`w-full md:w-2/3 flex flex-col bg-gray-50 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        ) : (
          <>
            {/* Conversation Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden mr-4 p-2 -ml-2 text-gray-500 hover:text-nestora-navy rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3 overflow-hidden">
                  {getPartner(activeConversation)?.profile?.avatar ? (
                    <img src={getPartner(activeConversation).profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : getPartner(activeConversation)?.agency?.logo ? (
                    <img src={getPartner(activeConversation).agency.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-nestora-navy">
                    {getPartner(activeConversation)?.profile ? `${getPartner(activeConversation).profile.firstName} ${getPartner(activeConversation).profile.lastName}` : (getPartner(activeConversation)?.agency?.name || 'Utilisateur')}
                  </h2>
                </div>
              </div>
              
              {activeConversation.property && (
                <Link to={`/annonces/${activeConversation.property.id}`} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 hover:bg-gray-100 transition-colors max-w-[200px]">
                  {activeConversation.property.images?.[0] && (
                    <img src={activeConversation.property.images[0].url} alt="Bien" className="w-10 h-10 object-cover rounded mr-2" />
                  )}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-nestora-navy truncate">{activeConversation.property.title}</div>
                    <div className="text-xs text-nestora-gold">Voir l'annonce</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-nestora-gold animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Aucun message. Soyez le premier à écrire !
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  const showDate = idx === 0 || format(new Date(msg.createdAt), 'dd/MM/yyyy') !== format(new Date(messages[idx - 1].createdAt), 'dd/MM/yyyy');
                  
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-6">
                          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {format(new Date(msg.createdAt), 'EEEE d MMMM', { locale: fr })}
                          </span>
                        </div>
                      )}
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-4`}>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${isMine ? 'bg-nestora-navy text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm'}`}>
                          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1 mx-1">
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder="Écrivez votre message..."
                  className="flex-1 resize-none overflow-hidden bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nestora-navy/20 focus:border-nestora-navy focus:bg-white transition-all min-h-[50px] max-h-[150px]"
                  rows={1}
                  style={{ minHeight: '50px' }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-nestora-gold hover:bg-yellow-600 disabled:opacity-50 disabled:hover:bg-nestora-gold text-white rounded-xl p-3 h-[50px] w-[50px] flex items-center justify-center transition-colors shrink-0 shadow-sm"
                >
                  <Send size={20} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
