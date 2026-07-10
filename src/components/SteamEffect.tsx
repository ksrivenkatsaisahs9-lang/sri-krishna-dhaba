import { motion } from "framer-motion";

const spices = ["🌱", "✨", "🍂", "🪵", "⭐️", "🌿"];

export default function SteamEffect({ count = 8 }: { count?: number }) {
  // Generate random values for each spice/steam item
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 20 + 10; // 10px to 30px
    const x = Math.random() * 100; // % width
    const delay = Math.random() * 8; // seconds
    const duration = Math.random() * 10 + 10; // 10 to 20 seconds
    const spice = spices[i % spices.length];

    return { id: i, size, x, delay, duration, spice };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-brand-dark/25 select-none"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            bottom: "-50px"
          }}
          initial={{ y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{
            y: "-110vh",
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1.2, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        >
          {p.spice}
        </motion.div>
      ))}

      {/* Steam columns */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-32 flex justify-around opacity-30">
        <div className="w-12 h-full bg-radial from-white/30 to-transparent blur-xl animate-steam" style={{ animationDelay: "0s" }} />
        <div className="w-16 h-full bg-radial from-white/20 to-transparent blur-xl animate-steam" style={{ animationDelay: "2s" }} />
        <div className="w-10 h-full bg-radial from-white/25 to-transparent blur-xl animate-steam" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
}
