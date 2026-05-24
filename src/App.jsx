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
    color: "#2C1810", light: "#F5F5F5",
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
    color: "#2C1810", light: "#F5F5F5",
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
    color: "#2C1810", light: "#F5F5F5",
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
    color: "#2C1810", light: "#F5F5F5",
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
    color: "#2C1810", light: "#F5F5F5",
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
    color: "#2C1810",
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
    color: "#2C1810",
  },
  {
    id: "v3", word: "transparent", category: "Communication", emoji: "◈",
    situation: "Your client is asking why costs went up mid-project.",
    prompt: 'Complete: "I want to be ________ about what\'s driving the change."',
    answer: "transparent",
    definition: "Open and honest, not hiding information that others should know.",
    toneNote: "Warmer than 'honest.' Signals you're proactively sharing, not just answering when asked.",
    similarWords: [{ word: "honest", feel: "direct, slightly blunt" }, { word: "clear", feel: "neutral, about clarity" }, { word: "forthcoming", feel: "more formal, old-fashioned" }],
    examples: ["I want to be transparent about the timeline shift and what caused it.", "Being transparent with vendors early prevents bigger issues later.", "She appreciated that I was transparent about the budget constraints from the start."],
    color: "#2C1810",
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
    color: "#2C1810",
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
    color: "#2C1810",
  },
];

const font = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ── SHARED UI ─────────────────────────────────────────────────────────────────

function ProgressDots({ current, total, color }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? "20px" : "6px", height: "6px",
          borderRadius: "3px", background: i === current ? color : "#E8D9CA",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function PillBtn({ children, onClick, color = "#2C1810", bg = "#EDE0D4", disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color, border: "none", borderRadius: "100px",
      padding: "13px 24px", fontSize: "15px", fontWeight: "700",
      fontFamily: font, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.35 : 1, transition: "transform 0.1s, opacity 0.2s",
      letterSpacing: "-0.2px",
    }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

function Home({ learned, onNav }) {
  const phraseCount = learned.filter(l => l.type === "phrase").length;
  const vocabCount = learned.filter(l => l.type === "vocab").length;

  const sections = [
    { id: "phrases", label: "Phrase\nPractice", sub: "5 situations", color: "#2C1810", emoji: "◎" },
    { id: "vocab", label: "Vocabulary\nBuilder", sub: "5 words", color: "#2C1810", emoji: "◈" },
    ...(learned.length > 0 ? [{ id: "review", label: "Review\nQueue", sub: `${learned.length} saved`, color: "#2C1810", emoji: "↻" }] : []),
  ];

  return (
    <div style={{ padding: "0 20px 100px" }}>
      {/* Hero */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontSize: "13px", fontWeight: "700", letterSpacing: "2px",
          textTransform: "uppercase", color: "#A0856C", marginBottom: "10px",
        }}>Communication Confidence</div>
        <div style={{ fontSize: "36px", fontWeight: "900", lineHeight: "1.1", letterSpacing: "-1.5px", color: "#2C1810" }}>
          Help me say<br />this <span style={{ color: "#2C1810" }}>naturally.</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        {[{ n: phraseCount, label: "Phrases" }, { n: vocabCount, label: "Words" }, { n: learned.length, label: "Saved" }].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "#FAF7F2", borderRadius: "16px", padding: "16px 12px", textAlign: "center", border: "1.5px solid #F3F4F6" }}>
            <div style={{ fontSize: "30px", fontWeight: "900", color: "#2C1810", letterSpacing: "-1px", lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: "11px", color: "#A0856C", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Big cards */}
      {sections.map((s) => (
        <div key={s.id} onClick={() => onNav(s.id)} style={{
          background: s.color, borderRadius: "24px", padding: "28px 24px",
          marginBottom: "14px", cursor: "pointer", position: "relative", overflow: "hidden",
          transition: "transform 0.15s",
        }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {/* Big emoji watermark */}
          <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "72px", opacity: 0.15, lineHeight: 1 }}>{s.emoji}</div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>{s.sub}</div>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#fff", letterSpacing: "-0.8px", lineHeight: "1.15", whiteSpace: "pre-line" }}>{s.label}</div>
          <div style={{ marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "8px 16px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>Start →</span>
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
      {/* Header card */}
      <div style={{ background: item.color, borderRadius: "24px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>Situation</div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.9)", letterSpacing: "0.5px" }}>{item.category}</div>
          </div>
          <ProgressDots current={idx} total={PHRASE_SITUATIONS.length} color="#fff" />
        </div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.5px" }}>
          "{item.situation}"
        </div>
      </div>

      {/* Write box */}
      <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>{item.prompt}</div>
        <textarea style={{
          width: "100%", boxSizing: "border-box",
          background: "#FAF7F2", border: `2px solid ${revealed ? "#EDE0D4" : item.color}`,
          borderRadius: "14px", padding: "16px", color: "#2C1810",
          fontSize: "16px", fontFamily: font, lineHeight: "1.7",
          resize: "none", minHeight: "110px", outline: "none",
          transition: "border-color 0.2s",
        }} value={input} onChange={e => setInput(e.target.value)}
          placeholder={item.placeholder} disabled={revealed} />

        {!revealed && (
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", color: "#C4A882" }}>{!canReveal ? "Write something first" : "Ready!"}</div>
            <PillBtn onClick={() => setRevealed(true)} disabled={!canReveal} color="#fff" bg={item.color}>
              See Answer →
            </PillBtn>
          </div>
        )}
      </div>

      {/* Tone ladder */}
      {revealed && (
        <>
          <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>Tone Ladder</div>
            {item.toneLadder.map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", padding: "14px 16px",
                borderRadius: "14px", marginBottom: "8px",
                background: t.best ? item.color : "#F9FAFB",
                border: `1.5px solid ${t.best ? item.color : "#EDE0D4"}`,
              }}>
                <div style={{ fontSize: "11px", fontWeight: "800", minWidth: "68px", color: t.best ? "rgba(255,255,255,0.8)" : "#D1D5DB", textTransform: "uppercase", letterSpacing: "0.5px", paddingTop: "2px", flexShrink: 0 }}>{t.label}</div>
                <div style={{ fontSize: "15px", color: t.best ? "#fff" : "#6B7280", lineHeight: "1.55", fontWeight: t.best ? "600" : "400" }}>"{t.example}"</div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ background: "#FDF0E8", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F0C4A0" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#7B3015", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>💡 Why it works</div>
            <div style={{ fontSize: "15px", color: "#7B3015", lineHeight: "1.65" }}>{item.tip}</div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {!saved
              ? <PillBtn onClick={handleSave} color="#fff" bg="#2C1810">Save to Review ✓</PillBtn>
              : <div style={{ fontSize: "14px", fontWeight: "700", color: "#C4622D", padding: "13px 0" }}>✓ Saved</div>
            }
            <PillBtn onClick={handleNext} color="#2C1810" bg="#EDE0D4">
              {idx < PHRASE_SITUATIONS.length - 1 ? "Next →" : "Start Over"}
            </PillBtn>
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
      {/* Header */}
      <div style={{ background: item.color, borderRadius: "24px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{item.category}</div>
          <ProgressDots current={idx} total={VOCAB_ITEMS.length} color="#fff" />
        </div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.5px" }}>
          "{item.situation}"
        </div>
      </div>

      {/* Fill in blank */}
      <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>Fill in the blank</div>
        <div style={{ fontSize: "17px", color: "#2C1810", lineHeight: "2.0", marginBottom: "16px", fontWeight: "500" }}>
          {parts[0]}
          {!revealed ? (
            <input style={{
              border: "none", borderBottom: '3px solid #C4622D',
              background: "transparent", color: "#C4622D", fontSize: "17px",
              fontFamily: font, fontWeight: "800", padding: "2px 8px",
              outline: "none", minWidth: "120px", textAlign: "center", margin: "0 4px",
            }} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()} placeholder="___" />
          ) : (
            <span style={{ background: "#C4622D", color: "#fff", borderRadius: "8px", padding: "3px 12px", margin: "0 4px", fontWeight: "900", fontSize: "17px" }}>{item.answer}</span>
          )}
          {parts[1]}
        </div>

        {!revealed && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <PillBtn onClick={handleCheck} color="#fff" bg={item.color}>Check Answer</PillBtn>
            {wrong && <PillBtn onClick={() => setRevealed(true)} color="#2C1810" bg="#EDE0D4">Reveal</PillBtn>}
          </div>
        )}
        {wrong && !revealed && (
          <div style={{ marginTop: "12px", fontSize: "14px", color: "#C0392B", fontWeight: "600" }}>Not quite — try again</div>
        )}
      </div>

      {/* Word reveal */}
      {revealed && (
        <>
          <div style={{ background: item.color, borderRadius: "20px", padding: "28px 24px", marginBottom: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", fontWeight: "900", color: "#fff", letterSpacing: "-2px", lineHeight: 1, marginBottom: "10px" }}>{item.word}</div>
            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: "1.5", fontWeight: "500" }}>{item.definition}</div>
          </div>

          <div style={{ background: "#FDF0E8", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F0C4A0" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#7B3015", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>💡 Tone Feel</div>
            <div style={{ fontSize: "15px", color: "#7B3015", lineHeight: "1.65" }}>{item.toneNote}</div>
          </div>

          <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>vs. Similar Words</div>
            {item.similarWords.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FAF7F2", borderRadius: "12px", marginBottom: "8px" }}>
                <span style={{ fontWeight: "800", color: "#C4622D", fontSize: "16px" }}>{s.word}</span>
                <span style={{ fontSize: "13px", color: "#A0856C" }}>{s.feel}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>Real Examples</div>
            {item.examples.map((ex, i) => (
              <div key={i} style={{ padding: "12px 16px", background: "#FAF7F2", borderRadius: "12px", marginBottom: "8px", fontSize: "15px", color: "#4A3728", lineHeight: "1.6", borderLeft: "3px solid #111111" }}>
                "{ex}"
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {!saved
              ? <PillBtn onClick={handleSave} color="#fff" bg="#2C1810">Save to Review ✓</PillBtn>
              : <div style={{ fontSize: "14px", fontWeight: "700", color: "#C4622D", padding: "13px 0" }}>✓ Saved</div>
            }
            <PillBtn onClick={handleNext} color="#2C1810" bg="#EDE0D4">{idx < VOCAB_ITEMS.length - 1 ? "Next →" : "Start Over"}</PillBtn>
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
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
      <div style={{ fontSize: "24px", fontWeight: "900", color: "#2C1810", letterSpacing: "-0.5px", marginBottom: "10px" }}>Nothing yet</div>
      <div style={{ fontSize: "16px", color: "#A0856C", lineHeight: "1.6" }}>Practice phrases and vocab, then save to build your queue. Items surface at 1 → 3 → 7 → 14 days.</div>
    </div>
  );

  const item = learned[idx % learned.length];
  const accentColor = item.color || "#2C1810";
  const isLast = idx >= learned.length - 1;
  function handleNext() { onUpdateReview(item.id); setIdx(idx + 1); setInput(""); setRevealed(false); }

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ background: accentColor, borderRadius: "24px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{item.type === "phrase" ? "✍️ Phrase" : "💡 Vocab"}</div>
          <ProgressDots current={idx % learned.length} total={learned.length} color="#fff" />
        </div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.5px" }}>"{item.situation}"</div>
      </div>

      <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>{item.prompt}</div>
        <textarea style={{
          width: "100%", boxSizing: "border-box", background: "#FAF7F2",
          border: `2px solid ${accentColor}`, borderRadius: "14px", padding: "16px",
          color: "#C4622D", fontSize: "16px", fontFamily: font, lineHeight: "1.7",
          resize: "none", minHeight: "100px", outline: "none",
        }} value={input} onChange={e => setInput(e.target.value)} placeholder="Write from memory..." disabled={revealed} />
        {!revealed && <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <PillBtn onClick={() => setRevealed(true)} disabled={input.trim().length < 3} color="#fff" bg={accentColor}>Check</PillBtn>
        </div>}
      </div>

      {revealed && (
        <>
          <div style={{ background: "#FFF8F0", borderRadius: "20px", padding: "20px", marginBottom: "14px", border: "1.5px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#A0856C", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>{item.type === "phrase" ? "Best Version" : "Answer"}</div>
            {item.type === "phrase"
              ? item.toneLadder.filter(t => t.best).map((t, i) => (
                <div key={i} style={{ background: accentColor, borderRadius: "14px", padding: "16px", marginBottom: "10px", fontSize: "16px", color: "#fff", lineHeight: "1.55", fontWeight: "600" }}>"{t.example}"</div>
              ))
              : <div style={{ background: accentColor, borderRadius: "14px", padding: "20px", textAlign: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "36px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" }}>{item.word}</div>
                <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", marginTop: "8px" }}>{item.definition}</div>
              </div>
            }
            <div style={{ background: "#FDF0E8", borderRadius: "12px", padding: "14px", fontSize: "15px", color: "#7B3015", lineHeight: "1.6", border: "1px solid #F0C4A0" }}>
              💡 {item.type === "phrase" ? item.tip : item.toneNote}
            </div>
          </div>
          <PillBtn onClick={handleNext} color="#fff" bg="#2C1810">{isLast ? "Review Complete 🎉" : "Next →"}</PillBtn>
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
    { id: "home", label: "Home", emoji: "◼" },
    { id: "phrases", label: "Phrases", emoji: "◎" },
    { id: "vocab", label: "Vocab", emoji: "◈" },
    { id: "review", label: learned.length > 0 ? `Review·${learned.length}` : "Review", emoji: "↻" },
  ];

  const pageTitles = {
    home: null,
    phrases: { title: "Phrase Practice", color: "#2C1810" },
    vocab: { title: "Vocabulary", color: "#2C1810" },
    review: { title: "Review Queue", color: "#2C1810" },
  };

  const pt = pageTitles[tab];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: font, color: "#2C1810" }}>
      {/* Header */}
      <div style={{ background: "#FFF8F0", borderBottom: "1.5px solid #F3F4F6", padding: "16px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "-0.5px", color: "#2C1810" }}>Confidence</div>
          </div>
          {pt && <div style={{ fontSize: "13px", fontWeight: "700", color: pt.color, background: "#F0DDD0", padding: "4px 12px", borderRadius: "100px" }}>{pt.title}</div>}
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
        background: "#FFF8F0", borderTop: "1.5px solid #F3F4F6",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.06)", zIndex: 10,
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "12px 4px 14px",
              background: "transparent", border: "none", cursor: "pointer", gap: "4px",
            }}>
              <span style={{ fontSize: "22px", lineHeight: 1 }}>{t.emoji}</span>
              <span style={{
                fontSize: "10px", fontWeight: "800", letterSpacing: "0.3px",
                color: tab === t.id ? "#C4622D" : "#C4A882",
                textTransform: "uppercase",
              }}>{t.label}</span>
              {tab === t.id && <div style={{ width: "24px", height: "3px", borderRadius: "2px", background: "#C4622D", marginTop: "2px" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
