"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, FileText, Folder, Search, MoreHorizontal, Database } from "lucide-react";

export default function KnowledgePage() {
  const documents = [
    { name: "Company_Brand_Guidelines.pdf", type: "pdf", size: "2.4 MB", date: "Today, 10:00 AM" },
    { name: "Q3_Financial_Report.xlsx", type: "sheet", size: "1.1 MB", date: "Yesterday, 2:30 PM" },
    { name: "Product_Roadmap_2026.docx", type: "doc", size: "840 KB", date: "Jul 12, 2026" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Knowledge Base</h1>
          <p className="text-[#0A121A]/60 font-medium">Train your AI workforce by uploading company documents and data.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button className="rounded-xl h-12 px-6 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 text-white font-bold shadow-[0_10px_30px_rgba(79,124,255,0.3)] transition-all transform hover:-translate-y-0.5 border-0">
            <Upload className="w-5 h-5 mr-2" /> Upload Data
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[20px] border border-white/60 p-2 flex items-center shadow-sm"
          >
            <div className="pl-4 pr-2 text-[#0A121A]/40">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search documents, folders, or content..." 
              className="flex-1 bg-transparent border-none outline-none py-2 px-2 text-[#0A121A] font-medium placeholder:text-[#0A121A]/40"
            />
          </motion.div>

          {/* Files List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
          >
            <h3 className="text-lg font-bold text-[#0A121A] mb-4">Recent Documents</h3>
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 rounded-[16px] border border-[#0A121A]/5 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4F7CFF]/10 flex items-center justify-center border border-[#4F7CFF]/20 group-hover:bg-[#4F7CFF] group-hover:border-transparent transition-colors">
                      <FileText className="w-6 h-6 text-[#4F7CFF] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A121A] text-sm group-hover:text-[#4F7CFF] transition-colors">{doc.name}</h4>
                      <p className="text-xs text-[#0A121A]/50 mt-0.5 font-medium">{doc.size} • Uploaded {doc.date}</p>
                    </div>
                  </div>
                  <button className="p-2 text-[#0A121A]/30 hover:text-[#4F7CFF] rounded-lg hover:bg-[#4F7CFF]/10 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
          >
            <h3 className="text-lg font-bold text-[#0A121A] mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#7B5CFF]" /> Storage
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-[#0A121A]">
                <span>24.5 GB</span>
                <span className="text-[#0A121A]/40">100 GB</span>
              </div>
              <div className="h-2 bg-[#0A121A]/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] rounded-full w-[24.5%]" />
              </div>
              <p className="text-xs text-[#0A121A]/50 font-medium">Your AI agents have access to 1,204 documents.</p>
            </div>
          </motion.div>

          {/* Folders */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
          >
            <h3 className="text-lg font-bold text-[#0A121A] mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#42D392]" /> Folders
            </h3>
            <div className="space-y-2">
              {['Marketing Assets', 'Legal Contracts', 'Product Specs', 'Financials'].map((folder, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 cursor-pointer transition-colors text-sm font-bold text-[#0A121A]/80 hover:text-[#4F7CFF]">
                  <Folder className="w-4 h-4 text-[#0A121A]/40" /> {folder}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
