import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Stellaris Wedding Swap — Sketch-style DeFi UI for Aptos
 * -------------------------------------------------------
 * - White paper-like background, sketch line art, elegant interactions
 * - Front-facing girl (not profile), long flowing hair (animated)
 * - Arms are connected to the body (no floating/disconnected hands)
 * - Left hand: asks user for the token to give ("请选择你想要与Stellaris厮守一生的信物")
 *   -> user selects; hand gracefully retracts with coin
 * - Right hand: offers token to user ("Stellaris同样也赠予你信物")
 *   -> user selects; hand presents and pushes coin out on Z-axis (take-away)
 * - Taglines:
 *   - “一次Swap，一次承诺，尽在AptOS”
 *   - Tiara: “Stellaris Wedding”
 */

const TOKENS = [
  { symbol: "BTC", label: "BTC", color: "#F2A900" },
  { symbol: "APT", label: "APT", color: "#1E90FF" },
  { symbol: "ETH", label: "ETH", color: "#3C3C3D" },
  { symbol: "USDC", label: "USDC", color: "#2775CA" },
];

// Stage types: "connectWallet" | "askGive" | "leftRetract" | "offerReceive" | "rightPresent" | "complete"

export default function StellarisWeddingSwap() {
  const [stage, setStage] = useState("connectWallet");
  const [userGives, setUserGives] = useState(null);
  const [userGets, setUserGets] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [rightCoinVisible, setRightCoinVisible] = useState(true);

  // Simple stage controller
  useEffect(() => {
    if (stage === "leftRetract") {
      const t = setTimeout(() => setStage("offerReceive"), 900);
      return () => clearTimeout(t);
    }
    if (stage === "rightPresent") {
      const t = setTimeout(() => setStage("complete"), 1100);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Right coin auto fade effect
  useEffect(() => {
    if (stage === "offerReceive") {
      setRightCoinVisible(true);
      const fadeTimer = setTimeout(() => {
        setRightCoinVisible(false);
      }, 4000); // 4秒后开始渐隐
      return () => clearTimeout(fadeTimer);
    }
  }, [stage]);

  const reset = () => {
    setStage("connectWallet");
    setUserGives(null);
    setUserGets(null);
    setWalletConnected(false);
    setRightCoinVisible(true);
  };

  const connectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true);
    setStage("askGive");
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 flex flex-col items-center justify-start p-6 sm:p-10 relative overflow-hidden">
      {/* Paper grain */}
      <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />

      <div className="max-w-6xl w-full">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Stellaris Wedding</h1>
          <div className="text-xs sm:text-sm opacity-80">
            一次Swap，一次承诺，尽在<strong className="mx-1 animate-pulse">AptOS</strong>.
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 items-center justify-items-center">
          {/* Left: Video */}
          <div className="relative">
            <div className="[perspective:1000px]">
              <video
                src="./Stellaris.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-[720px] mx-auto sketch-shadow"
                style={{
                  aspectRatio: "1000/900"
                }}
              />
            </div>
          </div>

          {/* Right: Controls & copy */}
          <div className="space-y-6 mt-12">
            <div className="bg-white/80 rounded-2xl shadow-sm border border-neutral-200 p-5 relative">
              {/* Sketchy corner accents */}
              <div className="absolute -top-1 left-2 h-3 w-10 border-t border-neutral-800/30" />
              <div className="absolute -bottom-1 right-2 h-3 w-10 border-b border-neutral-800/30" />

              <AnimatePresence mode="wait">
                {stage === "connectWallet" && (
                  <motion.div
                    key="connectWallet"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 text-center"
                  >
                    <div className="text-left">
                      <p className="text-lg font-medium mb-2">
                        可以让<strong className="mx-1">Stellaris</strong>走进你的内心深处吗？
                      </p>
                      <p className="text-xs text-neutral-500 mb-4">
                        这将链接到你的钱包，与可以让Stellaris走进你的内心深处吗？
                      </p>
                    </div>
                    <button 
                      onClick={connectWallet}
                      className="px-6 py-3 rounded-xl border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                    >
                      我同意
                    </button>
                  </motion.div>
                )}

                {stage === "askGive" && (
                  <motion.div
                    key="askGive"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-lg font-medium">
                      请选择你想要与<strong className="mx-1">Stellaris</strong>厮守一生的信物
                    </p>
                    <TokenPicker
                      tokens={TOKENS}
                      onPick={(sym) => {
                        setUserGives(sym);
                        setStage("leftRetract");
                      }}
                      disabledSymbols={userGets ? [userGets] : []}
                    />
                  </motion.div>
                )}

                {stage === "offerReceive" && (
                  <motion.div
                    key="offerReceive"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-lg font-medium">
                      Stellaris同样也赠予你信物
                    </p>
                    <TokenPicker
                      tokens={TOKENS}
                      onPick={(sym) => {
                        setUserGets(sym);
                        setStage("rightPresent");
                      }}
                      disabledSymbols={userGives ? [userGives] : []}
                    />
                  </motion.div>
                )}

                {stage === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-xl font-semibold">承诺已达成</p>
                    <p className="text-sm opacity-80">
                      你将 <strong>{userGives}</strong> 交予 Stellaris，换得 <strong>{userGets}</strong>。
                    </p>
                    <div className="flex gap-3">
                      <button onClick={reset} className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 transition">
                        再次交换
                      </button>
                      <button className="px-4 py-2 rounded-xl border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 transition">
                        在Scan上查看
                      </button>
                    </div>
                    <p className="text-xs opacity-60">
                      * 这里可对接 Aptos SDK 完成实际 swap / 交易签名逻辑。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
        
        {/* Fixed center description */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-sm opacity-70 leading-relaxed text-center">
          每一次选择，都是一次承诺
        </div>
      </div>

      {/* Local CSS for sketch feel & hair sway */}
      <style>{`
        @keyframes hair-sway {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
          100% { transform: rotate(0deg); }
        }
        .sketch-stroke { stroke: #111; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
        .sketch-fill { fill: rgba(0,0,0,0.02); }
        .sketch-shadow { filter: drop-shadow(0 1px 0 rgba(0,0,0,0.2)) drop-shadow(0 6px 12px rgba(0,0,0,0.06)); }
      `}</style>
    </div>
  );
}

function TokenPicker({
  tokens,
  onPick,
  disabledSymbols = [],
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tokens.map((t) => {
        const disabled = disabledSymbols.includes(t.symbol);
        return (
          <button
            key={t.symbol}
            disabled={disabled}
            onClick={() => onPick(t.symbol)}
            className={`group relative overflow-hidden rounded-2xl border ${
              disabled ? "border-neutral-200 opacity-40 cursor-not-allowed" : "border-neutral-300 hover:border-neutral-800 hover:-translate-y-0.5"
            } transition-transform bg-white p-3 text-left`}
          >
            <div className="flex items-center gap-3">
              <CoinSketch symbol={t.symbol} color={t.color} className="h-8 w-8 shrink-0" />
              <div className="font-medium">{t.label}</div>
            </div>
            <div className="absolute bottom-0 right-0 h-8 w-12 opacity-20">
              <svg viewBox="0 0 60 40" className="h-full w-full">
                <path d="M2 30 Q20 10 38 26 T58 22" className="sketch-stroke" fill="none" />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CoinSketch({ symbol, color, className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id={`g-${symbol}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={color} stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#g-${symbol})`} className="sketch-stroke" />
      <circle cx="32" cy="32" r="28" fill="none" className="sketch-stroke" />
      <text x="32" y="38" textAnchor="middle" fontSize="18" fontFamily="ui-monospace, monospace">{symbol}</text>
    </svg>
  );
}

function GirlSketch({
  stage,
  leftCoin,
  rightCoin,
  rightCoinVisible = true,
}) {
  const leftExtended = stage === "askGive";
  const leftRetracting = stage === "leftRetract";
  const rightExtending = stage === "offerReceive" || stage === "rightPresent";

  const zOut = { scale: 1.08, translateY: -6 };

  return (
    <div className="relative w-full max-w-[720px] mx-auto">
      <svg viewBox="0 0 1000 900" className="w-full h-auto sketch-shadow">
        {/* --- Hair back volume (soft shape) --- */}
        <g style={{ transformOrigin: "500px 200px", animation: "hair-sway 6s ease-in-out infinite" }}>
          <path d="M290 210 q210 -160 420 0 q130 90 130 230 q0 160 -140 250 q-120 80 -260 60 q-150 -24 -230 -160 q-46 -78 -22 -190 q20 -120 102 -190 z" className="sketch-stroke" fill="rgba(0,0,0,0.03)"/>
        </g>

        {/* --- Face & features (front-facing, elegant) --- */}
        <g id="face">
          {/* Face oval with sharper chin */}
          <path d="M410 180 q90 -30 180 0 q36 110 0 220 q-88 40 -180 0 q-34 -110 0 -220 z" className="sketch-stroke" fill="rgba(0,0,0,0.02)"/>

          {/* Eyebrows */}
          <path d="M430 250 q40 -16 80 0" className="sketch-stroke" fill="none"/>
          <path d="M600 250 q40 -16 80 0" className="sketch-stroke" fill="none"/>

          {/* Eyes (almond shape) */}
          <path d="M438 280 q32 18 64 0 q-32 -12 -64 0 z" className="sketch-stroke" fill="rgba(0,0,0,0.01)"/>
          <path d="M608 280 q32 18 64 0 q-32 -12 -64 0 z" className="sketch-stroke" fill="rgba(0,0,0,0.01)"/>
          {/* Pupils */}
          <circle cx="470" cy="285" r="4" fill="#111"/>
          <circle cx="640" cy="285" r="4" fill="#111"/>

          {/* Nose */}
          <path d="M545 300 q-10 22 -26 30" className="sketch-stroke" fill="none"/>

          {/* Lips (subtle smile) */}
          <path d="M500 340 q46 20 92 0" className="sketch-stroke" fill="none"/>

          {/* Soft blush */}
          <ellipse cx="470" cy="320" rx="20" ry="10" fill="rgba(235, 120, 140, 0.15)"/>
          <ellipse cx="640" cy="320" rx="20" ry="10" fill="rgba(235, 120, 140, 0.15)"/>

          {/* Fringe / hair front strands */}
          <path d="M420 210 q40 40 72 80 q-36 -30 -84 10" className="sketch-stroke" fill="none"/>
          <path d="M660 210 q-40 40 -72 80 q36 -30 84 10" className="sketch-stroke" fill="none"/>

          {/* Tiara with text */}
          <g transform="translate(420,150)">
            <path d="M0 46 q60 -46 120 0 q60 -46 120 0" className="sketch-stroke" fill="none" />
            <text x="120" y="-2" textAnchor="middle" fontSize="18" fontFamily="serif">Stellaris Wedding</text>
          </g>
        </g>

        {/* --- Torso & dress (waistline) --- */}
        <g id="torso">
          <path d="M420 400 q80 42 160 0 q-10 150 -80 220 q-70 -70 -80 -220 z" className="sketch-stroke" fill="rgba(0,0,0,0.02)"/>
          <path d="M420 400 q80 -36 160 0" className="sketch-stroke" fill="none"/>
        </g>

        {/* --- Left Arm (connected) --- */}
        <g id="left-arm" style={{ transformOrigin: "420px 430px" }}>
          <path d="M420 430 q-50 60 -80 130" className="sketch-stroke" fill="none"/>
          <path d="M340 560 q-10 40 14 90" className="sketch-stroke" fill="none"/>
          <g style={{ transformOrigin: "350px 640px" }}>
            <motion.g
              animate={{
                x: leftExtended ? -50 : leftRetracting ? 0 : -160,
                y: leftExtended ? -50 : leftRetracting ? 0 : 0,
                scale: leftExtended ? zOut.scale : 1,
                filter: leftExtended ? "drop-shadow(0px 12px 24px rgba(0,0,0,0.12))" : "none",
              }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
              <path d="M328 642 q26 -12 52 0 q-12 18 -52 20" className="sketch-stroke" fill="rgba(0,0,0,0.02)"/>
              <ellipse cx="352" cy="618" rx="66" ry="20" className="sketch-stroke" fill="rgba(0,0,0,0.01)"/>
              <AnimatePresence>
                {leftCoin && (stage === "askGive" || stage === "leftRetract") && (
                  <motion.g key="left-coin" initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: stage === "askGive" ? 1 : 0.9, y: 0, scale: stage === "askGive" ? 1 : 0.96 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
                    <CoinSketch symbol={leftCoin} color="#444" className="h-14 w-14"/>
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          </g>
        </g>

        {/* --- Right Arm (connected) --- */}
        <g id="right-arm" style={{ transformOrigin: "580px 430px" }}>
          <path d="M580 430 q50 60 80 130" className="sketch-stroke" fill="none"/>
          <path d="M660 560 q10 40 -14 90" className="sketch-stroke" fill="none"/>
          <g style={{ transformOrigin: "650px 640px" }}>
            <motion.g
              animate={{
                x: rightExtending ? 50 : -140,
                y: rightExtending ? -50 : 0,
                scale: rightExtending ? zOut.scale : 1,
                filter: rightExtending ? "drop-shadow(0px 12px 24px rgba(0,0,0,0.12))" : "none",
              }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
              <path d="M672 642 q-26 -12 -52 0 q12 18 52 20" className="sketch-stroke" fill="rgba(0,0,0,0.02)"/>
              <ellipse cx="648" cy="618" rx="66" ry="20" className="sketch-stroke" fill="rgba(0,0,0,0.01)"/>
              <AnimatePresence>
                {rightCoin && (stage === "offerReceive" || stage === "rightPresent" || stage === "complete") && (
                  <motion.g 
                    key="right-coin" 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }} 
                    animate={{ 
                      opacity: stage === "rightPresent" ? 0 : (rightCoinVisible ? 1 : 0), 
                      y: stage === "rightPresent" ? -30 : 0, 
                      scale: stage === "rightPresent" ? 1.15 : 1 
                    }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: stage === "offerReceive" && !rightCoinVisible ? 1.5 : 0.6 }}
                    style={{ transformOrigin: "center" }}
                  >
                    <g transform="translate(50, -32)">
                      <CoinSketch symbol={rightCoin} color="#444" className="h-14 w-14"/>
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          </g>
        </g>
      </svg>

    </div>
  );
}
