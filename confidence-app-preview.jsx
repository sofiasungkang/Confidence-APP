import { useState } from "react";

const PHRASE_SITUATIONS = [
  {
    id: "p1", category: "Apologizing", emoji: "◎",
    situation: "You forgot to reply to a client email for 3 days.",
    prompt: "Write your apology message naturally.",
    placeholder: "e.g. Sorry for the late reply...",
    toneLadder: [
      { label: "Too casual", example: "Sorry, things got crazy." },
      { label: "Natural casual", example: "Sorry, this week got away from me." },
      { label: "Best", example: "Sorry for the late notice. This week got away from me.", best: true },
      { label: "Too formal", example: "Please accept my sincerest apologies for this oversight." },
    ],
    tip: "'This week got away from me' is warm AND professional. It admits delay without over-explaining or sounding defensive.",
  },
  {
    id: "p2", category: "Following Up", emoji: "◎",
    situation: "You sent a proposal 5 days ago and haven't heard back.",
    prompt: "Write a follow-up that doesn't sound pushy.",
    placeholder: "e.g. Just wanted to check in...",
    toneLadder: [
      { label: "Too casual", example: "Hey, did you see my email?" },
      { label: "Natural casual", example: "Just checking in — did you get a chance to look this over?" },
      { label: "Best", example: "I wanted to follow up on the proposal I sent last week. Happy to answer any questions.", best: true },
      { label: "Too formal", example: "I am writing to inquire as to whether you have reviewed the aforementioned proposal." },
    ],
    tip: "'Did you get a chance to' follows up without pressure — it assumes the person is busy, not ignoring you.",
  },
  {
    id: "p3", category: "Firm but Kind", emoji: "◎",
    situation: "A vendor keeps missing deadlines and you need it to stop.",
    prompt: "Write a message that's firm but doesn't burn the relationship.",
    placeholder: "e.g. I wanted to flag the recent delays...",
    toneLadder: [
      { label: "Too soft", example: "Sorry to bother you, but maybe could you try to be on time?" },
      { label: "Natural", example: "I want to flag that deadlines have been slipping. Can we align on a timeline?" },
      { label: "Best", example: "Moving forward, I need updates submitted on time. If there's a blocker, let me know in advance.", best: true },
      { label: "Too harsh", example: "This is unacceptable. Fix it immediately." },
    ],
    tip: "'Moving forward' signals a boundary without aggression. It focuses on the future, not blame.",
  },
  {
    id: "p4", category: "Thank You", emoji: "◎",
    situation: "A colleague covered for you during a busy week without being asked.",
    prompt: "Write a thank you that feels genuine, not corporate.",
    placeholder: "e.g. I really appreciate what you did...",
    toneLadder: [
      { label: "Too flat", example: "Thanks for your help." },
      { label: "Best", example: "I really appreciate you stepping in this week. It made a real difference.", best: true },
      { label: "Over the top", example: "I am forever indebted to your extraordinary kindness." },
      { label: "Too formal", example: "Thank you for your assistance during this period." },
    ],
    tip: "'It made a real difference' tells someone their action had impact — which matters more than just saying thanks.",
  },
  {
    id: "p5", category: "Explaining Delay", emoji: "◎",
    situation: "A project is running 2 weeks late and you need to tell the client.",
    prompt: "Write a message explaining the delay without sounding defensive.",
    placeholder: "e.g. I wanted to give you a heads up...",
    toneLadder: [
      { label: "Defensive", example: "It's late because of a lot of complicated issues on our end." },
      { label: "Best", example: "I wanted to give you a heads-up — we're running about two weeks behind. Here's where we are and what's next.", best: true },
      { label: "Over-apologetic", example: "I'm so incredibly sorry, I feel terrible, I completely understand if you're frustrated..." },
      { label: "Too vague", example: "There have been some delays. We'll update you soon." },
    ],
    tip: "'Heads-up' signals transparency. Pair it with a brief status + next step — that's what professionals want.",
  },
];

const VOCAB_ITEMS = [
  {
    id: "v1", word: "obsolete", category: "Professional", emoji: "◈",
    situation: "Your vendor keeps using a process you moved away from two years ago.",
    prompt: 'Complete: "That approach may be ________ for how we work now."',
    answer: "obsolete",
    definition: "No longer used or useful because something newer has replaced it.",
    toneNote: "Feels more final than 'outdated.' Use when something has genuinely been replaced, not just old-fashioned.",
    similarWords: [{ word: "outdated", feel: "softer, more conversational" }, { word: "irrelevant", feel: "stronger, can sound dismissive" }, { word: "dated", feel: "informal, casual" }],
    examples: ["That sizing system is becoming obsolete as brands shift to 3D fit tools.", "Manual WIP tracking may be obsolete once AI dashboards are standard.", "Some vendor processes feel obsolete compared to industry expectations now."],
  },
  {
    id: "v2", word: "streamline", category: "Operations", emoji: "◈",
    situation: "Your team is doing a task in 5 steps that could be done in 2.",
    prompt: 'Complete: "We need to ________ our approval process."',
    answer: "streamline",
    definition: "To make a process simpler and more efficient by removing unnecessary steps.",
    toneNote: "Action-oriented and positive. Implies improvement without criticizing the current state.",
    similarWords: [{ word: "simplify", feel: "more general, slightly informal" }, { word: "optimize", feel: "more technical, data-driven" }, { word: "improve", feel: "vague, less specific" }],
    examples: ["We're looking to streamline the sample review process to cut turnaround time.", "Can we streamline how vendors submit updates so nothing gets lost?", "Streamlining onboarding would save both sides a lot of back-and-forth."],
  },
  {
    id: "v3", word: "transparent", category: "Communication", emoji: "◈",
    situation: "Your client is asking why costs went up mid-project.",
    prompt: 'Complete: "I want to be ________ about what\'s driving the change."',
    answer: "transparent",
    definition: "Open and honest, not hiding information that others should know.",
    toneNote: "Warmer than 'honest.' Signals you're proactively sharing, not just answering when asked.",
    similarWords: [{ word: "honest", feel: "direct, slightly blunt" }, { word: "clear", feel: "neutral, about clarity" }, { word: "forthcoming", feel: "more formal, old-fashioned" }],
    examples: ["I want to be transparent about the timeline shift and what caused it.", "Being transparent with vendors early prevents bigger issues later.", "She appreciated that I was transparent about budget constraints from the start."],
  },
  {
    id: "v4", word: "proactive", category: "Professional", emoji: "◈",
    situation: "You flagged a potential problem before the client noticed it.",
    prompt: 'Complete: "I wanted to be ________ and flag this before it becomes an issue."',
    answer: "proactive",
    definition: "Acting in advance to deal with something, rather than waiting for it to become a problem.",
    toneNote: "Signals leadership and initiative. Use to describe your own behavior or what you expect from others.",
    similarWords: [{ word: "prepared", feel: "more passive, about readiness" }, { word: "anticipate", feel: "verb form, slightly more formal" }, { word: "ahead of it", feel: "casual phrase version" }],
    examples: ["I wanted to be proactive and flag the shipping delay before it affects your launch.", "Being proactive with communication is something I prioritize with every client.", "The team was proactive about identifying the fit issue before production started."],
  },
  {
    id: "v5", word: "nuanced", category: "Communication", emoji: "◈",
    situation: "Someone oversimplified a complex situation and you need to push back gently.",
    prompt: 'Complete: "The situation is more ________ than that."',
    answer: "nuanced",
    definition: "Having subtle distinctions and details that are not immediately obvious.",
    toneNote: "Signals sophistication without condescension. Use to invite deeper thinking, not shut someone down.",
    similarWords: [{ word: "complex", feel: "neutral, about difficulty" }, { word: "complicated", feel: "slightly negative, implies messy" }, { word: "layered", feel: "visual metaphor, softer" }],
    examples: ["Fit feedback is more nuanced than just 'too big' or 'too small.'", "The client's concern is nuanced — it's not about cost, it's about timing.", "A nuanced understanding of body shape separates good sizing from great sizing."],
  },
];

// ── BRAND TOKENS ──────────────────────────────────────────────────────────────
const B = {
  parchment: "#FAF8F4",
  warmWhite: "#FDFCFA",
  clay: "#D97757",
  clayDeep: "#B85C38",
  charcoal: "#1C1917",
  sand: "#E8E0D5",
  linen: "#F0EBE3",
  dusk: "#78716C",
  mist: "#A8A29E",
  success: "#4A7C59",
  successLight: "#EFF3EE",
  warning: "#C07A2A",
  warningLight: "#FDF4E7",
  error: "#C0392B",
  errorLight: "#FDF0EE",
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'Instrument Sans', 'Inter', system-ui, sans-serif",
  radius: { sm: "8px", md: "14px", lg: "20px", xl: "28px", pill: "100px" },
  shadow: "0 1px 4px rgba(28,25,23,0.07)",
  shadowMd: "0 4px 16px rgba(28,25,23,0.09)",
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function ProgressDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? "18px" : "5px", height: "5px",
          borderRadius: "3px",
          background: i === current ? B.clay : B.sand,
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function PillBtn({ children, onClick, variant = "primary", disabled }) {
  const styles = {
    primary: { background: B.clay, color: "#fff", border: "none", boxShadow: `0 2px 8px rgba(217,119,87,0.28)` },
    secondary: { background: B.linen, color: B.charcoal, border: `1.5px solid ${B.sand}` },
    dark: { background: B.charcoal, color: "#fff", border: "none" },
    success: { background: B.success, color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      borderRadius: B.radius.pill, padding: "12px 24px",
      fontSize: "15px", fontWeight: "600", fontFamily: B.sans,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.38 : 1,
      transition: "transform 0.1s, opacity 0.15s",
      letterSpacing: "-0.1px",
    }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >{children}</button>
  );
}

function SituationCard({ situation, category, color = B.clay, idx, total }) {
  return (
    <div style={{
      background: B.charcoal, borderRadius: B.radius.xl,
      padding: "24px", marginBottom: "16px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: "-10px", top: "-10px", width: "100px", height: "100px", borderRadius: "50%", background: B.clay, opacity: 0.08 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: B.clay }}>{category}</div>
        <ProgressDots current={idx} total={total} />
      </div>
      <div style={{ fontSize: "16px", fontFamily: B.serif, color: B.warmWhite, lineHeight: "1.5", fontStyle: "italic" }}>
        "{situation}"
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

function Home({ learned, onNav }) {
  const phraseCount = learned.filter(l => l.type === "phrase").length;
  const vocabCount = learned.filter(l => l.type === "vocab").length;

  return (
    <div style={{ padding: "0 20px 100px" }}>
      {/* Hero */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: B.mist, marginBottom: "10px" }}>
          Communication Confidence
        </div>
        <div style={{ fontSize: "38px", fontFamily: B.serif, color: B.charcoal, lineHeight: "1.1", letterSpacing: "-1px", marginBottom: "4px" }}>
          Help me say
        </div>
        <div style={{ fontSize: "38px", fontFamily: B.serif, color: B.clay, lineHeight: "1.1", letterSpacing: "-1px", fontStyle: "italic" }}>
          this naturally.
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        {[{ n: phraseCount, label: "Phrases" }, { n: vocabCount, label: "Words" }, { n: learned.length, label: "Saved" }].map((s, i) => (
          <div key={i} style={{ flex: 1, background: B.warmWhite, borderRadius: B.radius.lg, padding: "14px 10px", textAlign: "center", border: `1.5px solid ${B.sand}` }}>
            <div style={{ fontSize: "28px", fontFamily: B.serif, color: B.clay, lineHeight: 1, marginBottom: "4px" }}>{s.n}</div>
            <div style={{ fontSize: "10px", color: B.mist, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      {[
        { id: "phrases", label: "Phrase Practice", sub: "5 situations", desc: "Write your version. See the natural tone comparison." },
        { id: "vocab", label: "Vocabulary", sub: "5 words", desc: "Fill in the blank. Unlock the word's meaning and feel." },
        ...(learned.length > 0 ? [{ id: "review", label: "Review Queue", sub: `${learned.length} saved`, desc: "Items resurfacing at the right time." }] : []),
      ].map((c, i) => (
        <div key={c.id} onClick={() => onNav(c.id)} style={{
          background: i === 0 ? B.charcoal : B.warmWhite,
          borderRadius: B.radius.xl, padding: "22px 24px",
          marginBottom: "12px", cursor: "pointer",
          border: i === 0 ? "none" : `1.5px solid ${B.sand}`,
          boxShadow: i === 0 ? B.shadowMd : B.shadow,
          transition: "transform 0.15s",
          position: "relative", overflow: "hidden",
        }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.99)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {i === 0 && <div style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: B.clay, opacity: 0.12 }} />}
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: i === 0 ? B.clay : B.mist, marginBottom: "6px" }}>{c.sub}</div>
          <div style={{ fontSize: "22px", fontFamily: B.serif, color: i === 0 ? B.warmWhite : B.charcoal, marginBottom: "6px", letterSpacing: "-0.3px" }}>{c.label}</div>
          <div style={{ fontSize: "14px", color: i === 0 ? B.dusk : B.mist, lineHeight: "1.5", marginBottom: "16px" }}>{c.desc}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: i === 0 ? "rgba(255,255,255,0.1)" : B.linen, borderRadius: B.radius.pill, padding: "7px 16px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: i === 0 ? "#fff" : B.charcoal }}>Start →</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PHRASE PRACTICE ───────────────────────────────────────────────────────────

function PhrasePractice({ onLearn, learned }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const item = PHRASE_SITUATIONS[idx];
  const canReveal = input.trim().length >= 5;

  function handleNext() { setIdx((idx + 1) % PHRASE_SITUATIONS.length); setInput(""); setRevealed(false); setSaved(false); }
  function handleSave() { if (!learned.some(l => l.id === item.id)) onLearn({ ...item, type: "phrase", learnedAt: Date.now(), reviewInterval: 1 }); setSaved(true); }

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <SituationCard situation={item.situation} category={item.category} idx={idx} total={PHRASE_SITUATIONS.length} />

      {/* Write */}
      <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>{item.prompt}</div>
        <textarea style={{
          width: "100%", boxSizing: "border-box",
          background: B.parchment, border: `1.5px solid ${revealed ? B.sand : B.clay}`,
          borderRadius: B.radius.md, padding: "14px 16px",
          color: B.charcoal, fontSize: "15px", fontFamily: B.sans,
          lineHeight: "1.7", resize: "none", minHeight: "100px", outline: "none",
          transition: "border-color 0.2s",
        }} value={input} onChange={e => setInput(e.target.value)}
          placeholder={item.placeholder} disabled={revealed} />
        {!revealed && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <div style={{ fontSize: "13px", color: B.mist }}>{canReveal ? "Ready to compare" : "Write something first"}</div>
            <PillBtn onClick={() => setRevealed(true)} disabled={!canReveal}>See Answer →</PillBtn>
          </div>
        )}
      </div>

      {/* Tone ladder */}
      {revealed && (
        <>
          <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Tone Ladder</div>
            {item.toneLadder.map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", padding: "13px 16px",
                borderRadius: B.radius.md, marginBottom: "8px",
                background: t.best ? B.charcoal : B.parchment,
                border: `1.5px solid ${t.best ? B.charcoal : B.sand}`,
              }}>
                <div style={{ fontSize: "10px", fontWeight: "800", minWidth: "64px", color: t.best ? B.clay : B.mist, textTransform: "uppercase", letterSpacing: "0.8px", paddingTop: "2px", flexShrink: 0 }}>{t.label}</div>
                <div style={{ fontSize: "15px", color: t.best ? B.warmWhite : B.dusk, lineHeight: "1.55", fontFamily: t.best ? B.serif : B.sans, fontStyle: t.best ? "italic" : "normal" }}>"{t.example}"</div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ background: B.warningLight, borderRadius: B.radius.lg, padding: "18px 20px", marginBottom: "16px", border: `1.5px solid #F0D5A8` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.warning, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>💡 Why it works</div>
            <div style={{ fontSize: "15px", color: "#6B4A1A", lineHeight: "1.65" }}>{item.tip}</div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {!saved
              ? <PillBtn onClick={handleSave} variant="dark">Save to Review ✓</PillBtn>
              : <div style={{ fontSize: "14px", fontWeight: "600", color: B.success, padding: "12px 0" }}>✓ Saved</div>
            }
            <PillBtn onClick={handleNext} variant="secondary">{idx < PHRASE_SITUATIONS.length - 1 ? "Next →" : "Start Over"}</PillBtn>
          </div>
        </>
      )}
    </div>
  );
}

// ── VOCABULARY ────────────────────────────────────────────────────────────────

function VocabPractice({ onLearn, learned }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [saved, setSaved] = useState(false);
  const item = VOCAB_ITEMS[idx];

  function handleCheck() { input.trim().toLowerCase() === item.answer ? (setRevealed(true), setWrong(false)) : setWrong(true); }
  function handleNext() { setIdx((idx + 1) % VOCAB_ITEMS.length); setInput(""); setRevealed(false); setWrong(false); setSaved(false); }
  function handleSave() { if (!learned.some(l => l.id === item.id)) onLearn({ ...item, type: "vocab", learnedAt: Date.now(), reviewInterval: 1 }); setSaved(true); }
  const parts = item.prompt.split("________");

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <SituationCard situation={item.situation} category={item.category} idx={idx} total={VOCAB_ITEMS.length} />

      {/* Fill blank */}
      <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Fill in the blank</div>
        <div style={{ fontSize: "16px", color: B.charcoal, lineHeight: "2.1", background: B.parchment, borderRadius: B.radius.md, padding: "14px 16px", marginBottom: "16px" }}>
          {parts[0]}
          {!revealed ? (
            <input style={{
              border: "none", borderBottom: `2.5px solid ${B.clay}`,
              background: "transparent", color: B.clay, fontSize: "16px",
              fontFamily: B.sans, fontWeight: "700", padding: "2px 6px",
              outline: "none", minWidth: "120px", textAlign: "center", margin: "0 4px",
            }} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()} placeholder="___" />
          ) : (
            <span style={{ background: B.clay, color: "#fff", borderRadius: B.radius.sm, padding: "3px 12px", margin: "0 4px", fontWeight: "700", fontSize: "16px" }}>{item.answer}</span>
          )}
          {parts[1]}
        </div>
        {!revealed && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <PillBtn onClick={handleCheck}>Check Answer</PillBtn>
            {wrong && <PillBtn onClick={() => setRevealed(true)} variant="secondary">Reveal</PillBtn>}
            {wrong && <div style={{ fontSize: "14px", color: B.error, fontWeight: "600" }}>Not quite — try again</div>}
          </div>
        )}
      </div>

      {/* Reveal */}
      {revealed && (
        <>
          <div style={{ background: B.charcoal, borderRadius: B.radius.lg, padding: "28px 24px", marginBottom: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "44px", fontFamily: B.serif, color: B.warmWhite, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: "10px", fontStyle: "italic" }}>{item.word}</div>
            <div style={{ fontSize: "15px", color: B.dusk, lineHeight: "1.55" }}>{item.definition}</div>
          </div>

          <div style={{ background: B.warningLight, borderRadius: B.radius.lg, padding: "18px 20px", marginBottom: "12px", border: `1.5px solid #F0D5A8` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.warning, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>💡 Tone Feel</div>
            <div style={{ fontSize: "15px", color: "#6B4A1A", lineHeight: "1.65" }}>{item.toneNote}</div>
          </div>

          <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>vs. Similar Words</div>
            {item.similarWords.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: B.parchment, borderRadius: B.radius.md, marginBottom: "7px", border: `1.5px solid ${B.sand}` }}>
                <span style={{ fontWeight: "700", color: B.clay, fontSize: "15px", fontFamily: B.serif, fontStyle: "italic" }}>{s.word}</span>
                <span style={{ fontSize: "13px", color: B.mist }}>{s.feel}</span>
              </div>
            ))}
          </div>

          <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "16px", border: `1.5px solid ${B.sand}` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Real Examples</div>
            {item.examples.map((ex, i) => (
              <div key={i} style={{ padding: "12px 14px", background: B.parchment, borderRadius: B.radius.md, marginBottom: "7px", fontSize: "15px", color: B.dusk, lineHeight: "1.6", borderLeft: `3px solid ${B.clay}` }}>
                "{ex}"
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {!saved ? <PillBtn onClick={handleSave} variant="dark">Save to Review ✓</PillBtn> : <div style={{ fontSize: "14px", fontWeight: "600", color: B.success, padding: "12px 0" }}>✓ Saved</div>}
            <PillBtn onClick={handleNext} variant="secondary">{idx < VOCAB_ITEMS.length - 1 ? "Next →" : "Start Over"}</PillBtn>
          </div>
        </>
      )}
    </div>
  );
}

// ── REVIEW ────────────────────────────────────────────────────────────────────

function Review({ learned, onUpdateReview }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  if (learned.length === 0) return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "52px", marginBottom: "20px", fontFamily: B.serif, color: B.sand }}>∅</div>
      <div style={{ fontSize: "24px", fontFamily: B.serif, color: B.charcoal, marginBottom: "10px" }}>Nothing yet</div>
      <div style={{ fontSize: "15px", color: B.mist, lineHeight: "1.7" }}>Practice and save items to build your queue. They surface at 1 → 3 → 7 → 14 days.</div>
    </div>
  );

  const item = learned[idx % learned.length];
  const isLast = idx >= learned.length - 1;
  function handleNext() { onUpdateReview(item.id); setIdx(idx + 1); setInput(""); setRevealed(false); }

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <SituationCard situation={item.situation} category={item.type === "phrase" ? item.category : item.category} idx={idx % learned.length} total={learned.length} />

      <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>{item.prompt}</div>
        <textarea style={{
          width: "100%", boxSizing: "border-box", background: B.parchment,
          border: `1.5px solid ${B.clay}`, borderRadius: B.radius.md, padding: "14px 16px",
          color: B.charcoal, fontSize: "15px", fontFamily: B.sans, lineHeight: "1.7",
          resize: "none", minHeight: "95px", outline: "none",
        }} value={input} onChange={e => setInput(e.target.value)} placeholder="Write from memory..." disabled={revealed} />
        {!revealed && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
            <PillBtn onClick={() => setRevealed(true)} disabled={input.trim().length < 3}>Check</PillBtn>
          </div>
        )}
      </div>

      {revealed && (
        <>
          <div style={{ background: B.warmWhite, borderRadius: B.radius.lg, padding: "20px", marginBottom: "12px", border: `1.5px solid ${B.sand}` }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: B.mist, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>{item.type === "phrase" ? "Best Version" : "Answer"}</div>
            {item.type === "phrase"
              ? item.toneLadder.filter(t => t.best).map((t, i) => (
                <div key={i} style={{ background: B.charcoal, borderRadius: B.radius.md, padding: "16px", marginBottom: "10px", fontSize: "16px", fontFamily: B.serif, color: B.warmWhite, lineHeight: "1.5", fontStyle: "italic" }}>"{t.example}"</div>
              ))
              : <div style={{ background: B.charcoal, borderRadius: B.radius.md, padding: "20px", textAlign: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "36px", fontFamily: B.serif, color: B.warmWhite, letterSpacing: "-1px", fontStyle: "italic" }}>{item.word}</div>
                <div style={{ fontSize: "14px", color: B.dusk, marginTop: "8px", lineHeight: "1.5" }}>{item.definition}</div>
              </div>
            }
            <div style={{ background: B.warningLight, borderRadius: B.radius.md, padding: "14px 16px", fontSize: "15px", color: "#6B4A1A", lineHeight: "1.6", border: `1px solid #F0D5A8` }}>
              💡 {item.type === "phrase" ? item.tip : item.toneNote}
            </div>
          </div>
          <PillBtn onClick={handleNext} variant="dark">{isLast ? "Review Complete ✓" : "Next →"}</PillBtn>
        </>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [learned, setLearned] = useState([]);

  function handleLearn(item) { setLearned(prev => prev.some(l => l.id === item.id) ? prev : [...prev, item]); }
  function handleUpdateReview(id) {
    setLearned(prev => prev.map(l => {
      if (l.id !== id) return l;
      const intervals = [1, 3, 7, 14];
      const next = intervals[Math.min(intervals.indexOf(l.reviewInterval || 1) + 1, intervals.length - 1)];
      return { ...l, reviewInterval: next, learnedAt: Date.now() };
    }));
  }

  const tabs = [
    { id: "home", label: "Home", icon: "◼" },
    { id: "phrases", label: "Phrases", icon: "◎" },
    { id: "vocab", label: "Vocab", icon: "◈" },
    { id: "review", label: learned.length > 0 ? `Review·${learned.length}` : "Review", icon: "↻" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: B.parchment, fontFamily: B.sans, color: B.charcoal }}>
      {/* Header */}
      <div style={{ background: B.warmWhite, borderBottom: `1.5px solid ${B.sand}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "18px", fontFamily: B.serif, color: B.charcoal, letterSpacing: "-0.3px" }}>
            Confidence<span style={{ color: B.clay, fontStyle: "italic" }}>.</span>
          </div>
          <div style={{ fontSize: "11px", color: B.mist, letterSpacing: "0.3px" }}>
            {tab === "home" ? "" : tabs.find(t => t.id === tab)?.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "24px" }}>
        {tab === "home" && <Home learned={learned} onNav={setTab} />}
        {tab === "phrases" && <PhrasePractice onLearn={handleLearn} learned={learned} />}
        {tab === "vocab" && <VocabPractice onLearn={handleLearn} learned={learned} />}
        {tab === "review" && <Review learned={learned} onUpdateReview={handleUpdateReview} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: B.warmWhite, borderTop: `1.5px solid ${B.sand}`,
        boxShadow: "0 -4px 20px rgba(28,25,23,0.06)", zIndex: 10,
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "11px 4px 13px",
              background: "transparent", border: "none", cursor: "pointer", gap: "4px",
            }}>
              <span style={{ fontSize: "18px", lineHeight: 1, color: tab === t.id ? B.clay : B.mist }}>{t.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: tab === t.id ? B.charcoal : B.mist }}>{t.label}</span>
              {tab === t.id && <div style={{ width: "18px", height: "2.5px", borderRadius: "2px", background: B.clay, marginTop: "2px" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
