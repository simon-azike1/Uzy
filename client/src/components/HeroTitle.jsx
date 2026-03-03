import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function HeroTitle({ t }) {
  const fullTitle = "Your job search, finally organized.";
  const [displayedTitle, setDisplayedTitle] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayedTitle(fullTitle.slice(0, i));

      if (i === fullTitle.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">

      <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">

        {/* 3D UZY (no typing) */}
        <motion.span
          initial={{ rotateY: -180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="inline-block"
          style={{
            color: t.accent,
            textShadow: `
              0 0 10px ${t.accent},
              0 0 20px ${t.accent},
              0 0 40px ${t.accent}
            `,
          }}
        >
          UZY
        </motion.span>

        <br />

        {/* Typing Line */}
        <span style={{ color: t.text }}>
          {displayedTitle}
          {displayedTitle !== fullTitle && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </h1>

      {/* Static Paragraph */}
      <p
        className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-5"
        style={{ color: t.textMuted }}
      >
        Uzy connects to your inbox and automatically tracks every job application —
        no spreadsheets, no manual entry, no missed follow-ups.
      </p>

    </div>
  );
}

export default HeroTitle;