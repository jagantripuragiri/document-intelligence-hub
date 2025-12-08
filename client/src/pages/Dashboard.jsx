import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Upload from '../components/Upload';
import { Button } from '../components/ui/button';
import { FileText, MessageSquare, LogOut, Loader, Search, X } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/documents');
            setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch docs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this document?")) return;
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(documents.filter(doc => doc._id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
                            <Search className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            DocuMind
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
                            <span>{user?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <LogOut className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Hero / Stats Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Knowledge Base</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Centralize your documents and unlock instant insights with AI-powered search.
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5" onClick={() => navigate('/chat')}>
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Start New Chat
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Upload & Docs List */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Upload Card */}
                        <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md p-6 shadow-xl shadow-black/5">
                            <h3 className="font-semibold text-lg mb-4 flex items-center text-card-foreground">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                Upload Document
                            </h3>
                            <Upload onUploadSuccess={fetchDocuments} />
                        </div>
                    </div>

                    {/* Right Column: Documents Grid */}
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl border border-border/50 bg-card/20 backdrop-blur-md p-6 min-h-[500px] shadow-xl shadow-black/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-semibold text-xl flex items-center text-card-foreground">
                                    Your Documents
                                </h3>
                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border/50">
                                    {documents.length} {documents.length === 1 ? 'File' : 'Files'}
                                </span>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <Loader className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-muted-foreground animate-pulse text-sm">Syncing library...</p>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/40 rounded-2xl bg-card/20">
                                    <div className="p-4 bg-secondary/50 rounded-full mb-4">
                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-foreground font-medium">No documents yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">Upload a PDF to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc._id}
                                            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/40 bg-card/60 hover:bg-card/80 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                                            onClick={() => navigate('/chat')}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                                                    <FileText className="h-6 w-6 text-primary" />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => handleDelete(doc._id, e)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-foreground truncate mb-1 pr-4" title={doc.title}>
                                                    {doc.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground flex items-center">
                                                    <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mr-2" />
                                                    {new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
