import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, ArrowLeft, Bot, User as UserIcon, Sparkles } from 'lucide-react';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { query: userMessage.content });
            const aiMessage = { 
                role: 'ai', 
                content: data.answer, 
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while processing your request.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center space-x-2.5">
                             <div className="bg-primary/10 p-1.5 rounded-lg">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold leading-tight">AI Assistant</h1>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Powered by Gemini</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6 max-w-4xl mx-auto w-full relative z-10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full animate-pulse group-hover:opacity-30 transition-opacity" />
                            <div className="bg-gradient-to-br from-primary/80 to-purple-600 p-6 rounded-[2rem] shadow-2xl relative transform transition-transform group-hover:scale-105 duration-300">
                                <Bot className="h-16 w-16 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3 max-w-md mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight">
                                How can I help you?
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                I can summarize documents, answer specific questions, or help you find critical information instantly.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                            {['Summarize document', 'Key takeaways', 'Explain specific terms', 'Find deadlines'].map((suggestion, i) => (
                                <button 
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="text-sm p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-primary/5 hover:border-primary/20 transition-all text-left text-muted-foreground hover:text-primary flex items-center justify-between group"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {suggestion}
                                    <Send className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div className={`flex max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-auto shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-foreground'}`}>
                                    {msg.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`group relative p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                        : 'bg-card/80 backdrop-blur-sm border border-border/50 text-card-foreground rounded-bl-sm prose prose-zinc dark:prose-invert max-w-none'
                                }`}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row space-x-3">
                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-card border border-border/50 text-foreground flex items-center justify-center mt-auto shadow-sm">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-card/50 px-5 py-3 rounded-2xl rounded-bl-sm border border-border/50 flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-px w-full" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gradient-to-t from-background via-background to-transparent z-20">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-end gap-2 p-1.5 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/10 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30">
                    <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Message your documents..." 
                        className="min-h-[52px] max-h-32 py-3.5 px-5 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 resize-none overflow-hidden"
                        disabled={loading}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        className="h-10 w-10 rounded-2xl mb-1.5 mr-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50" 
                        disabled={loading || !input.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
                <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium opacity-60">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    );
};

export default Chat;
