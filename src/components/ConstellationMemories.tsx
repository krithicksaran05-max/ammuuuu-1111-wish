"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { siteConfig, ConstellationNode } from "@/config/site-config";

export default function ConstellationMemories() {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [imgError, setImgError] = useState(false);

  // SVG dimensions for lines
  // We can draw lines connecting: node[0] -> node[1] -> node[2] -> node[3] -> node[4]
  const renderLines = () => {
    const nodes = siteConfig.constellations;
    if (nodes.length < 2) return null;

    const points = nodes.map((node) => `${node.x},${node.y}`).join(" ");

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="rgba(135, 206, 235, 0.25)"
          strokeWidth="0.4"
          strokeDasharray="2,2"
          className="animate-[pulse-glow_4s_infinite]"
        />
      </svg>
    );
  };

  return (
    <section className="relative py-28 px-6 bg-linear-to-b from-navy/30 to-transparent overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sky-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto z-10 relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            className="font-montserrat text-xs tracking-[0.35em] text-sky-blue uppercase"
          >
            Cosmic Connections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-playfair text-3xl md:text-4xl font-light text-white mt-2"
          >
            Constellation Memories
          </motion.h2>
          <p className="font-poppins text-sm text-silver/60 font-light mt-4 max-w-md mx-auto leading-relaxed">
            Click on the glowing stars in the sky to reveal hidden memories written in the heavens.
          </p>
        </div>

        {/* Constellation Canvas area */}
        <div className="relative w-full h-[450px] bg-navy/35 rounded-3xl border border-white/5 backdrop-blur-[6px] overflow-hidden shadow-2xl p-6">
          
          {/* Deep Space Background details inside map */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,19,43,0.6)_0%,transparent_100%)] pointer-events-none" />
          
          {/* Draw connecting lines */}
          {renderLines()}

          {/* Draw Star nodes */}
          {siteConfig.constellations.map((node, idx) => {
            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-10"
              >
                {/* Clickable Star Node */}
                <button
                  onClick={() => {
                    setSelectedNode(node);
                    setImgError(false);
                  }}
                  className="relative flex items-center justify-center p-4 cursor-pointer focus:outline-hidden group"
                >
                  {/* Glowing pulsing rings */}
                  <span className="absolute w-8 h-8 rounded-full border border-sky-blue/20 animate-ping opacity-30" />
                  <span className="absolute w-5 h-5 rounded-full bg-sky-blue/10 blur-[4px] group-hover:bg-sky-blue/20 transition-all duration-300" />
                  
                  {/* Star dot center */}
                  <span className="relative w-2.5 h-2.5 rounded-full bg-white border border-sky-blue/80 shadow-[0_0_12px_#87CEEB] group-hover:scale-125 transition-transform duration-300" />

                  {/* Tooltip Label */}
                  <span className="absolute bottom-[-24px] whitespace-nowrap bg-navy/85 border border-sky-blue/20 text-sky-blue px-2.5 py-0.5 rounded-md text-[10px] font-montserrat tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {node.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Detailed Modal Lightbox */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/85 backdrop-blur-md p-4">
              <div
                onClick={() => setSelectedNode(null)}
                className="absolute inset-0 cursor-pointer"
              />

              <div
                className="max-w-lg w-full glass-panel border border-sky-blue/30 rounded-2xl overflow-hidden shadow-2xl relative z-10"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full glass-panel hover:border-sky-blue/50 text-white cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Photo Header */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden border-b border-white/5">
                  {!imgError ? (
                    <img
                      src={selectedNode.image}
                      alt={selectedNode.title}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-navy to-[#1e1b4b]/40 flex items-center justify-center p-6">
                      <span className="font-playfair text-4xl opacity-10 text-sky-blue">💙</span>
                      <span className="absolute top-4 left-6 text-[10px] text-sky-blue/20">★</span>
                      <span className="absolute bottom-6 right-8 text-[12px] text-sky-blue/20">★</span>
                    </div>
                  )}
                  {/* Subtle Aurora Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-navy to-transparent pointer-events-none" />
                </div>

                {/* Info Area */}
                <div className="p-6 md:p-8 flex flex-col space-y-4">
                  <div className="flex items-center space-x-1.5 text-sky-blue">
                    <Calendar className="w-4 h-4" />
                    <span className="font-montserrat text-[11px] tracking-wider uppercase font-medium">
                      {selectedNode.date}
                    </span>
                  </div>
                  <h3 className="font-playfair text-2xl text-white font-medium">
                    {selectedNode.title}
                  </h3>
                  <div className="w-10 h-[1px] bg-sky-blue/40" />
                  <p className="font-poppins text-sm text-silver/85 font-light leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
