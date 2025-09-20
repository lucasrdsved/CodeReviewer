import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Image, Mic, Phone, Video } from "lucide-react";
import trainerAvatar from '@assets/generated_images/Personal_trainer_Lucas_avatar_5987325d.png';

interface Message {
  id: string;
  sender: 'student' | 'trainer';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio';
  read: boolean;
}

interface ChatInterfaceProps {
  currentUser: 'student' | 'trainer';
  otherUser: {
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
  };
}

export default function ChatInterface({ currentUser, otherUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //todo: remove mock functionality 
  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "trainer",
      content: "Oi Maria! Como foi o treino de ontem? Conseguiu completar todas as séries?",
      timestamp: "10:30",
      type: "text",
      read: true
    },
    {
      id: "2", 
      sender: "student",
      content: "Oi Lucas! Foi muito bom! Completei tudo, mas senti que a última série do leg press ficou pesada. RPE 9 fácil.",
      timestamp: "10:45",
      type: "text",
      read: true
    },
    {
      id: "3",
      sender: "trainer", 
      content: "Perfeito! RPE 9 está dentro do esperado para a última série. Na próxima sessão vamos manter a carga e focar na técnica. 👍",
      timestamp: "10:47",
      type: "text",
      read: true
    },
    {
      id: "4",
      sender: "student",
      content: "Pode ser! Uma dúvida: posso fazer cardio leve nos dias de descanso?",
      timestamp: "11:15",
      type: "text", 
      read: false
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);
    
    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate typing indicator and response (for demo)
    if (currentUser === 'student') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: "trainer",
          content: "Entendi! Vou analisar e te responder em breve.",
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          type: "text",
          read: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      default: return 'Offline';
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[600px]">
      {/* Chat Header */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={currentUser === 'student' ? trainerAvatar : otherUser.avatar} 
                    alt={otherUser.name} 
                  />
                  <AvatarFallback>{otherUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(otherUser.status)} border-2 border-background`} />
              </div>
              <div>
                <CardTitle className="text-base">{otherUser.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{getStatusText(otherUser.status)}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" data-testid="button-voice-call">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-video-call">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 rounded-none border-y-0">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${message.sender === currentUser ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg p-3 ${
                    message.sender === currentUser 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                    message.sender === currentUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{message.timestamp}</span>
                    {message.sender === currentUser && !message.read && (
                      <Badge variant="secondary" className="text-xs h-4">Enviada</Badge>
                    )}
                    {message.sender === currentUser && message.read && (
                      <Badge variant="secondary" className="text-xs h-4">Lida</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {otherUser.name} está digitando...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" data-testid="button-attach">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="button-image">
              <Image className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-message"
              />
            </div>
            <Button size="icon" variant="ghost" data-testid="button-voice-message">
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}