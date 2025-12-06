import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload as UploadIcon, File, X, CheckCircle, Loader2, CloudUpload } from 'lucide-react';
import api from '../api';
import { cn } from '../lib/utils'; // Assuming you have a utils file, if not I'll just use template literals or install clsx

const Upload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        const validTypes = ['application/pdf', 'text/plain'];
        if (!validTypes.includes(file.type)) {
            setError('Only PDF and TXT files are supported');
            return;
        }
        setError('');
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div 
                className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${
                    isDragging 
                        ? 'border-primary bg-primary/5 scale-[1.01]' 
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept=".pdf,.txt"
                />
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

                {!file ? (
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-4">
                        <div className={`p-4 rounded-full bg-primary/10 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                            <CloudUpload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-foreground">
                                Drop your document here
                            </p>
                            <p className="text-sm text-muted-foreground">
                                or click to browse
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full">
                            <span>PDF</span>
                            <span className="h-3 w-px bg-border" />
                            <span>TXT</span>
                            <span className="h-3 w-px bg-border" />
                            <span>Up to 10MB</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex items-center justify-between bg-card border border-border/50 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3 text-left">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <File className="h-6 w-6 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); setFile(null); }} disabled={uploading}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center space-x-2 text-sm text-destructive mt-3 bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    <span>{error}</span>
                </div>
            )}

            {file && (
                <Button 
                    onClick={handleUpload} 
                    className="w-full mt-4 h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium" 
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Document...
                        </>
                    ) : (
                        <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload & Extract Content
                        </>
                    )}
                </Button>
            )}
        </div>
    );
};

export default Upload;
