"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { BookOpen, Upload, FileText, Folder, Search, MoreVertical, Database, Trash2, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KnowledgePage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Company_Brand_Guidelines.pdf", type: "pdf", size: "2.4 MB", date: "Today, 10:00 AM", folder: "Marketing Assets" },
    { id: 2, name: "Q3_Financial_Report.xlsx", type: "sheet", size: "1.1 MB", date: "Yesterday, 2:30 PM", folder: "Financials" },
    { id: 3, name: "Product_Roadmap_2026.docx", type: "doc", size: "840 KB", date: "Jul 12, 2026", folder: "Product Specs" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['All', 'Marketing Assets', 'Legal Contracts', 'Product Specs', 'Financials'];

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeFolder === 'All' || doc.folder === activeFolder)
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      // Simulate network upload
      setTimeout(() => {
        const newDoc = {
          id: Date.now(),
          name: file.name,
          type: file.name.split('.').pop() || "unknown",
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          date: "Just now",
          folder: activeFolder === 'All' ? "Marketing Assets" : activeFolder
        };
        setDocuments(prev => [newDoc, ...prev]);
        setIsUploading(false);
      }, 1500);
    }
  };

  const deleteDoc = (id: number) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setActiveMenu(null);
  };

  // Calculate fake storage based on docs
  const totalBaseMB = 24.5;
  const currentTotalMB = (totalBaseMB + (documents.length - 3) * 1.5).toFixed(1);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12" onClick={() => setActiveMenu(null)}>
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Header */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-[#2FD9FF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0A121A] mb-3 tracking-tight">Knowledge Base</h1>
            <p className="text-[#0A121A]/60 font-medium text-lg max-w-xl">
              Train your AI workforce by securely uploading company documents and proprietary data.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="rounded-2xl h-14 px-8 text-lg font-bold shadow-[0_10px_20px_rgba(79,124,255,0.2)] disabled:opacity-70 disabled:transform-none"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading...
                </span>
              ) : (
                <><Upload className="w-5 h-5 mr-2" /> Upload Data</>
              )}
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <GlassCard className="p-2 flex items-center shadow-sm focus-within:border-[#4F7CFF] transition-all">
            <div className="pl-4 pr-2 text-[#0A121A]/40">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, folders, or content..." 
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-[#0A121A] text-lg font-medium placeholder:text-[#0A121A]/40"
            />
          </GlassCard>

          {/* Files List */}
          <GlassCard className="p-8 md:p-10 min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#0A121A] tracking-tight">
                {activeFolder === 'All' ? 'Recent Documents' : `${activeFolder} Documents`}
              </h3>
              <span className="text-sm font-bold text-[#4F7CFF] bg-[#4F7CFF]/10 px-4 py-1.5 rounded-full border border-[#4F7CFF]/20">{filteredDocs.length} Files</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredDocs.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                    <div className="w-20 h-20 bg-[#0A121A]/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-[#0A121A]/30" />
                    </div>
                    <p className="text-[#0A121A]/50 font-bold text-lg">No documents found.</p>
                  </motion.div>
                ) : (
                  filteredDocs.map((doc, idx) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.05 * idx }}
                      layout
                      className="group relative flex items-center justify-between p-5 rounded-2xl border border-white/60 bg-white/40 hover:bg-white hover:shadow-[0_10px_30px_rgba(79,124,255,0.08)] hover:border-[#4F7CFF]/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-[#4F7CFF]/10 flex items-center justify-center border border-[#4F7CFF]/20 group-hover:bg-[#4F7CFF] group-hover:border-transparent group-hover:shadow-[0_4px_15px_rgba(79,124,255,0.4)] transition-all">
                          <FileText className="w-7 h-7 text-[#4F7CFF] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0A121A] text-lg tracking-tight group-hover:text-[#4F7CFF] transition-colors">{doc.name}</h4>
                          <p className="text-sm text-[#0A121A]/50 mt-1 font-medium flex items-center gap-2">
                            {doc.size} • Uploaded {doc.date}
                            <span className="w-1 h-1 rounded-full bg-[#0A121A]/20" />
                            <span className="text-[#0A121A]/40">{doc.folder}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Menu */}
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === doc.id ? null : doc.id); }}
                          className="p-3 text-[#0A121A]/30 hover:text-[#4F7CFF] rounded-xl hover:bg-[#4F7CFF]/10 transition-colors focus:outline-none"
                        >
                          <MoreVertical className="w-6 h-6" />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenu === doc.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl py-2 z-20 overflow-hidden"
                            >
                              <button className="w-full px-5 py-3 text-left text-sm font-bold text-[#0A121A]/70 hover:bg-[#4F7CFF]/10 hover:text-[#4F7CFF] flex items-center gap-3 transition-colors">
                                <Download className="w-4 h-4" /> Download
                              </button>
                              <div className="h-px bg-[#0A121A]/5 my-1" />
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }}
                                className="w-full px-5 py-3 text-left text-sm font-bold text-[#FF6B81] hover:bg-[#FF6B81]/10 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Info */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#0A121A] mb-6 flex items-center gap-3 tracking-tight">
              <Database className="w-6 h-6 text-[#7B5CFF]" /> Storage Usage
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-base font-bold text-[#0A121A]">
                <span>{currentTotalMB} GB</span>
                <span className="text-[#0A121A]/40">100 GB</span>
              </div>
              <div className="h-3 bg-[#0A121A]/5 rounded-full overflow-hidden border border-white/40">
                <div 
                  className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] rounded-full transition-all duration-1000" 
                  style={{ width: `${(parseFloat(currentTotalMB) / 100) * 100}%` }}
                />
              </div>
              <p className="text-sm text-[#0A121A]/50 font-medium pt-3 leading-relaxed">
                Your AI agents have access to <strong className="text-[#4F7CFF] bg-[#4F7CFF]/10 px-2 py-0.5 rounded">{1201 + documents.length}</strong> documents.
              </p>
            </div>
          </GlassCard>

          {/* Folders */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-[#0A121A] mb-6 flex items-center gap-3 tracking-tight">
              <Folder className="w-6 h-6 text-[#42D392]" /> Directories
            </h3>
            <div className="space-y-2">
              {folders.map((folder, idx) => {
                const isActive = activeFolder === folder;
                return (
                  <button 
                    key={idx} 
                    onClick={() => setActiveFolder(folder)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                      isActive 
                        ? "bg-[#4F7CFF] text-white shadow-lg shadow-[#4F7CFF]/20" 
                        : "hover:bg-white/80 text-[#0A121A]/70 hover:text-[#4F7CFF] border border-transparent hover:border-white/60"
                    )}
                  >
                    <span className="text-base font-bold flex items-center gap-3">
                      <Folder className={cn("w-5 h-5", isActive ? "text-white" : "text-[#0A121A]/40")} /> {folder}
                    </span>
                    {isActive && <CheckCircle2 className="w-5 h-5 opacity-70" />}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
