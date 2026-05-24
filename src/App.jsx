import { useState } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const PHRASE_SITUATIONS = [
  {
    id: "p1",
    category: "Apologizing Naturally",
    situation: "You forgot to reply to a client email for 3 days.",
    prompt: "Write your apology message naturally.",
    placeholder: "e.g. I'm so sorry for the late reply...",
    toneLadder: [
      { label: "Too casual", example: "Sorry, things got crazy." },
      { label: "Natural casual", example: "Sorry, this week got away from me." },
      { label: "Professional ✓", example: "Sorry for the late notice. This week got away from me.", best: true },
      { label: "Over-formal", example: "Please accept my sincerest apologies for this oversight." },
    ],
    tip: "'This week got away from me' is warm AND professional. It admits delay without over-explaining or sounding defensive.",
  },
  {
    id: "p2",
    category: "Following Up",
    situation: "You sent a proposal 5 days ago and haven't heard back.",
    prompt: "Write a follow-up message that doesn't sound pushy.",
    placeholder: "e.g. Just wanted to check in on...",
    toneLadder: [
      { label: "Too casual", example: "Hey, did you see my email?" },
      { label: "Natural casual", example: "Just checking in — did you get a chance to look this over?" },
      { label: "Professional ✓", example: "I wanted to follow up on the proposal I sent last week. Happy to answer any questions.", best: true },
      { label: "Over-formal", example: "I am writing to inquire as to whether you have reviewed the aforementioned proposal." },
    ],
    tip: "'Did you get a chance to' is a classic natural phrase. It follows up without pressuring — it assumes the person is busy, not ignoring you.",
  },
  {
    id: "p3",
    category: "Being Firm but Kind",
    situation: "A vendor keeps missing deadlines and you need it to stop.",
    prompt: "Write a message that's firm but doesn't burn the relationship.",
    placeholder: "e.g. I wanted to bring up the recent delays...",
    toneLadder: [
      { label: "Too soft", example: "Sorry to bother you, but maybe could you try to be on time?" },
      { label: "Natural", example: "I want to flag that deadlines have been slipping. Can we align on a timeline we can both commit to?" },
      { label: "Firm Professional ✓", example: "Moving forward, I need updates submitted on time. If there's a blocker, please let me know in advance.", best: true },
      { label: "Too harsh", example: "This is unacceptable. Fix it immediately." },
    ],
    tip: "'Moving forward' signals a boundary without being aggressive. It focuses on the future, not blame — which keeps the relationship intact.",
  },
  {
    id: "p4",
    category: "Saying Thank You Warmly",
    situation: "A colleague covered for you during a busy week without being asked.",
    prompt: "Write a thank you that feels genuine, not corporate.",
    placeholder: "e.g. I really appreciate what you did...",
    toneLadder: [
      { label: "Too flat", example: "Thanks for your help." },
      { label: "Natural warm ✓", example: "I really appreciate you stepping in this week. It made a real difference.", best: true },
      { label: "Over the top", example: "I am forever indebted to your extraordinary kindness and generosity." },
      { label: "Too formal", example: "Thank you for your assistance during this period." },
    ],
    tip: "'It made a real difference' is the key phrase. It tells someone their action had impact — which is more meaningful than just saying thank you.",
  },
  {
    id: "p5",
    category: "Explaining a Delay",
    situation: "A project is running 2 weeks late and you need to tell the client.",
    prompt: "Write a message explaining the delay without sounding defensive.",
    placeholder: "e.g. I wanted to give you a heads up...",
    toneLadder: [
      { label: "Defensive", example: "It's late because of a lot of complicated issues on our end." },
      { label: "Natural ✓", example: "I wanted to give you a heads-up — we're running about two weeks behind. Here's where we are and what's next.", best: true },
      { label: "Over-apologetic", example: "I'm so incredibly sorry, I feel terrible about this delay and I completely understand if you're frustrated..." },
      { label: "Too vague", example: "There have been some delays. We'll update you soon." },
    ],
    tip: "'Heads-up' is a natural phrase that signals transparency. Pair it with a brief status + next step — that combo is what professionals want to hear.",
  },
];

const VOCAB_ITEMS = [
  {
    id: "v1",
    word: "obsolete",
    category: "Professional",
    situation: "Your vendor keeps using a process you moved away from two years ago.",
    prompt: 'Complete: "That approach may be ________ for how we work now."',
    answer: "obsolete",
    definition: "No longer used or useful because something newer has replaced it.",
    toneNote: "Feels more technical and final than 'outdated.' Use when something has genuinely been replaced, not just old-fashioned.",
    similarWords: [
      { word: "outdated", feel: "softer, more conversational" },
      { word: "irrelevant", feel: "stronger, can sound dismissive" },
      { word: "dated", feel: "informal, casual contexts" },
    ],
    examples: [
      "That sizing system is becoming obsolete as brands shift to 3D fit tools.",
      "Manual WIP tracking may be obsolete once AI-supported dashboards are standard.",
      "Some vendor communication processes feel obsolete compared to what the industry expects now.",
    ],
  },
  {
    id: "v2",
    word: "streamline",
    category: "Operations",
    situation: "Your team is doing a task in 5 steps that could be done in 2.",
    prompt: 'Complete: "We need to ________ our approval process."',
    answer: "streamline",
    definition: "To make a process simpler and more efficient by removing unnecessary steps.",
    toneNote: "Sounds action-oriented and positive. It implies improvement without criticizing the current state.",
    similarWords: [
      { word: "simplify", feel: "more general, slightly informal" },
      { word: "optimize", feel: "more technical, data-driven tone" },
      { word: "improve", feel: "vague, less specific" },
    ],
    examples: [
      "We're looking to streamline the sample review process to cut turnaround time.",
      "Can we streamline how vendors submit updates so nothing gets lost in email threads?",
      "Streamlining onboarding would save both sides a lot of back-and-forth.",
    ],
  },
  {
    id: "v3",
    word: "transparent",
    category: "Communication",
    situation: "Your client is asking why costs went up mid-project.",
    prompt: 'Complete: "I want to be ________ about what\'s driving the change."',
    answer: "transparent",
    definition: "Open and honest, not hiding information that others should know.",
    toneNote: "Warmer and more human than 'honest.' Signals you're proactively sharing, not just answering when asked.",
    similarWords: [
      { word: "honest", feel: "direct, slightly blunt" },
      { word: "clear", feel: "neutral, about clarity not openness" },
      { word: "forthcoming", feel: "more formal, slightly old-fashioned" },
    ],
    examples: [
      "I want to be transparent about the timeline shift and what caused it.",
      "Being transparent with vendors early prevents bigger issues later.",
      "She appreciated that I was transparent about the budget constraints from the start.",
    ],
  },
  {
    id: "v4",
    word: "proactive",
    category: "Professional",
    situation: "You flagged a potential problem before the client noticed it.",
    prompt: 'Complete: "I wanted to be ________ and flag this before it becomes an issue."',
    answer: "proactive",
    definition: "Acting in advance to deal with something, rather than waiting for it to become a problem.",
    toneNote: "Signals leadership and initiative. Use it to describe your own behavior or what you expect from others.",
    similarWords: [
      { word: "prepared", feel: "more passive, about readiness" },
      { word: "anticipate", feel: "verb form, slightly more formal" },
      { word: "ahead of it", feel: "casual phrase version" },
    ],
    examples: [
      "I wanted to be proactive and flag the shipping delay before it affects your launch.",
      "Being proactive with communication is something I prioritize with every client.",
      "The team was proactive about identifying the fit issue before production started.",
    ],
  },
  {
    id: "v5",
    word: "nuanced",
    category: "Communication",
    situation: "Someone oversimplified a complex situation and you need to push back gently.",
    prompt: 'Complete: "The situation is more ________ than that."',
    answer: "nuanced",
    definition: "Having subtle distinctions and details that are not immediately obvious.",
    toneNote: "Signals sophistication without being condescending. Use it to invite deeper thinking, not to shut someone down.",
    similarWords: [
      { word: "complex", feel: "neutral, about difficulty" },
      { word: "complicated", feel: "slightly negative, implies messy" },
      { word: "layered", feel: "visual metaphor, softer" },
    ],
    examples: [
      "Fit feedback is more nuanced than just 'too big' or 'too small.'",
      "The client's concern is nuanced — it's not about cost, it's about timing.",
      "A nuanced understanding of your customer's body shape is what separates good sizing from great sizing.",
    ],
  },
];

// ── REVIEW QUEUE (spaced repetition simulation) ───────────────────────────────
function getReviewItems(learned) {
  return learned.filter(item => {
    const daysSince = (Date.now() - item.learnedAt) / (1000 * 60 * 60 * 24);
    return daysSince >= (item.reviewInterval || 0);
  });
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100dvh",
    background: "#0F0E0D",
    color: "#E8E3DC",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: "0",
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  header: {
    padding: "16px 20px",
    paddingTop: "calc(16px + env(safe-area-inset-top))",
    borderBottom: "1px solid #2A2825",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "13px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#C8A97E",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
  },
  streak: {
    fontSize: "11px",
    color: "#6B6660",
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    gap: "4px",
    padding: "10px 16px",
    borderBottom: "1px solid #1E1C1A",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  navBtn: (active) => ({
    padding: "8px 14px",
    background: active ? "#C8A97E" : "transparent",
    color: active ? "#0F0E0D" : "#6B6660",
    border: "1px solid",
    borderColor: active ? "#C8A97E" : "#2A2825",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  }),
  main: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "24px 20px 60px",
  },
  sectionLabel: {
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#C8A97E",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "normal",
    marginBottom: "8px",
    lineHeight: "1.3",
    fontStyle: "italic",
  },
  sectionSub: {
    fontSize: "14px",
    color: "#6B6660",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  card: {
    background: "#161412",
    border: "1px solid #2A2825",
    borderRadius: "4px",
    padding: "20px",
    marginBottom: "16px",
  },
  situationTag: {
    display: "inline-block",
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C8A97E",
    border: "1px solid #3A2E1E",
    padding: "4px 10px",
    borderRadius: "2px",
    marginBottom: "16px",
  },
  situationText: {
    fontSize: "17px",
    lineHeight: "1.6",
    marginBottom: "24px",
    color: "#E8E3DC",
    fontStyle: "italic",
  },
  promptText: {
    fontSize: "13px",
    color: "#9B9590",
    marginBottom: "12px",
    letterSpacing: "0.3px",
  },
  textarea: {
    width: "100%",
    background: "#0F0E0D",
    border: "1px solid #2A2825",
    borderRadius: "2px",
    padding: "16px",
    color: "#E8E3DC",
    fontSize: "15px",
    fontFamily: "'Georgia', serif",
    lineHeight: "1.7",
    resize: "vertical",
    minHeight: "100px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btnPrimary: {
    background: "#C8A97E",
    color: "#0F0E0D",
    border: "none",
    padding: "12px 28px",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
    marginTop: "16px",
    transition: "opacity 0.2s",
  },
  btnSecondary: {
    background: "transparent",
    color: "#6B6660",
    border: "1px solid #2A2825",
    padding: "10px 24px",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
    marginTop: "16px",
    marginLeft: "12px",
    transition: "all 0.2s",
  },
  feedbackBox: {
    background: "#0F0E0D",
    border: "1px solid #3A2E1E",
    borderRadius: "4px",
    padding: "24px",
    marginTop: "20px",
  },
  feedbackLabel: {
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#C8A97E",
    marginBottom: "12px",
  },
  toneRow: (best) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #1E1C1A",
    opacity: best ? 1 : 0.6,
  }),
  toneLabel: (best) => ({
    fontSize: "10px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: best ? "#C8A97E" : "#4A4845",
    minWidth: "120px",
    paddingTop: "2px",
  }),
  toneExample: (best) => ({
    fontSize: "14px",
    color: best ? "#E8E3DC" : "#6B6660",
    fontStyle: "italic",
    lineHeight: "1.5",
  }),
  tipBox: {
    background: "#161412",
    borderLeft: "2px solid #C8A97E",
    padding: "16px 20px",
    marginTop: "20px",
    borderRadius: "0 2px 2px 0",
  },
  tipText: {
    fontSize: "13px",
    color: "#9B9590",
    lineHeight: "1.7",
  },
  vocabBlank: {
    display: "inline-block",
    borderBottom: "2px solid #C8A97E",
    minWidth: "100px",
    margin: "0 6px",
    textAlign: "center",
  },
  inputSmall: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #C8A97E",
    color: "#C8A97E",
    fontSize: "17px",
    fontFamily: "'Georgia', serif",
    padding: "4px 8px",
    outline: "none",
    minWidth: "120px",
    textAlign: "center",
    fontStyle: "italic",
  },
  wordReveal: {
    fontSize: "36px",
    fontStyle: "italic",
    color: "#C8A97E",
    marginBottom: "8px",
  },
  definitionText: {
    fontSize: "15px",
    color: "#9B9590",
    lineHeight: "1.7",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  similarRow: {
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
    marginBottom: "8px",
  },
  similarWord: {
    fontSize: "14px",
    color: "#C8A97E",
    fontStyle: "italic",
  },
  similarFeel: {
    fontSize: "12px",
    color: "#4A4845",
  },
  exampleItem: {
    fontSize: "14px",
    color: "#6B6660",
    fontStyle: "italic",
    padding: "10px 0",
    borderBottom: "1px solid #1E1C1A",
    lineHeight: "1.6",
  },
  progressBar: {
    height: "2px",
    background: "#1E1C1A",
    borderRadius: "1px",
    marginBottom: "32px",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "#C8A97E",
    borderRadius: "1px",
    transition: "width 0.4s ease",
  }),
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#1E1C1A",
    border: "1px solid #2A2825",
    borderRadius: "2px",
    padding: "4px 10px",
    fontSize: "11px",
    color: "#6B6660",
    letterSpacing: "1px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#161412",
    border: "1px solid #2A2825",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
  },
  statNum: {
    fontSize: "32px",
    color: "#C8A97E",
    fontStyle: "italic",
    display: "block",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#4A4845",
  },
};

// ── PHRASE PRACTICE ───────────────────────────────────────────────────────────
function PhrasePractice({ onLearn, learned }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const item = PHRASE_SITUATIONS[idx];
  const alreadyLearned = learned.some(l => l.id === item.id);

  function handleReveal() {
    if (input.trim().length < 5) return;
    setRevealed(true);
  }

  function handleSave() {
    if (!alreadyLearned) {
      onLearn({ ...item, type: "phrase", learnedAt: Date.now(), reviewInterval: 1 });
    }
    setSaved(true);
  }

  function handleNext() {
    setIdx((idx + 1) % PHRASE_SITUATIONS.length);
    setInput("");
    setRevealed(false);
    setSaved(false);
  }

  const pct = ((idx + 1) / PHRASE_SITUATIONS.length) * 100;

  return (
    <div>
      <div style={styles.progressBar}><div style={styles.progressFill(pct)} /></div>
      <div style={styles.sectionLabel}>Phrase Practice</div>
      <h2 style={styles.sectionTitle}>Turn your thoughts into natural English</h2>
      <p style={styles.sectionSub}>Write your version first. Then see the natural alternative and why it works.</p>

      <div style={styles.card}>
        <div style={styles.situationTag}>{item.category}</div>
        <p style={styles.situationText}>"{item.situation}"</p>
        <p style={styles.promptText}>{item.prompt}</p>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={item.placeholder}
          disabled={revealed}
        />
        {!revealed && (
          <button
            style={{ ...styles.btnPrimary, opacity: input.trim().length < 5 ? 0.4 : 1 }}
            onClick={handleReveal}
            disabled={input.trim().length < 5}
          >
            See Natural Version
          </button>
        )}

        {revealed && (
          <div style={styles.feedbackBox}>
            <div style={styles.feedbackLabel}>Tone Ladder</div>
            {item.toneLadder.map((t, i) => (
              <div key={i} style={styles.toneRow(t.best)}>
                <span style={styles.toneLabel(t.best)}>{t.label}</span>
                <span style={styles.toneExample(t.best)}>"{t.example}"</span>
              </div>
            ))}
            <div style={styles.tipBox}>
              <p style={styles.tipText}>💡 {item.tip}</p>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {!saved ? (
                <button style={styles.btnPrimary} onClick={handleSave}>Save to Review</button>
              ) : (
                <span style={{ ...styles.badge, marginTop: "16px" }}>✓ Saved for review</span>
              )}
              <button style={styles.btnSecondary} onClick={handleNext}>
                {idx < PHRASE_SITUATIONS.length - 1 ? "Next Situation →" : "Start Over"}
              </button>
            </div>
          </div>
        )}
      </div>
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
  const alreadyLearned = learned.some(l => l.id === item.id);

  function handleCheck() {
    if (input.trim().toLowerCase() === item.answer.toLowerCase()) {
      setRevealed(true);
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  function handleRevealAnyway() {
    setRevealed(true);
    setWrong(false);
  }

  function handleSave() {
    if (!alreadyLearned) {
      onLearn({ ...item, type: "vocab", learnedAt: Date.now(), reviewInterval: 1 });
    }
    setSaved(true);
  }

  function handleNext() {
    setIdx((idx + 1) % VOCAB_ITEMS.length);
    setInput("");
    setRevealed(false);
    setWrong(false);
    setSaved(false);
  }

  const pct = ((idx + 1) / VOCAB_ITEMS.length) * 100;

  // Build prompt with blank
  const promptParts = item.prompt.split("________");

  return (
    <div>
      <div style={styles.progressBar}><div style={styles.progressFill(pct)} /></div>
      <div style={styles.sectionLabel}>Vocabulary in Context</div>
      <h2 style={styles.sectionTitle}>Learn words through real situations</h2>
      <p style={styles.sectionSub}>Fill in the blank. Then unlock the word's meaning, feel, and real examples.</p>

      <div style={styles.card}>
        <div style={styles.situationTag}>{item.category}</div>
        <p style={styles.situationText}>"{item.situation}"</p>

        <p style={{ fontSize: "17px", lineHeight: "1.8", marginBottom: "24px", color: "#E8E3DC" }}>
          {promptParts[0]}
          {!revealed ? (
            <input
              style={styles.inputSmall}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="type here"
              disabled={revealed}
            />
          ) : (
            <span style={{ ...styles.inputSmall, color: "#C8A97E", fontStyle: "italic", borderColor: "#C8A97E" }}>
              {item.answer}
            </span>
          )}
          {promptParts[1]}
        </p>

        {!revealed && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <button style={styles.btnPrimary} onClick={handleCheck}>Check Answer</button>
            {wrong && (
              <>
                <span style={{ fontSize: "13px", color: "#8B4040", fontStyle: "italic" }}>Not quite — try again or</span>
                <button style={{ ...styles.btnSecondary, marginTop: 0, marginLeft: 0 }} onClick={handleRevealAnyway}>Reveal Word</button>
              </>
            )}
          </div>
        )}

        {revealed && (
          <div style={styles.feedbackBox}>
            <div style={styles.wordReveal}>{item.word}</div>
            <p style={styles.definitionText}>{item.definition}</p>

            <div style={styles.feedbackLabel}>Tone Feel</div>
            <div style={{ ...styles.tipBox, marginTop: 0, marginBottom: "20px" }}>
              <p style={styles.tipText}>💡 {item.toneNote}</p>
            </div>

            <div style={styles.feedbackLabel}>vs. Similar Words</div>
            {item.similarWords.map((s, i) => (
              <div key={i} style={styles.similarRow}>
                <span style={styles.similarWord}>{s.word}</span>
                <span style={styles.similarFeel}>— {s.feel}</span>
              </div>
            ))}

            <div style={{ ...styles.feedbackLabel, marginTop: "20px" }}>Real Examples</div>
            {item.examples.map((ex, i) => (
              <div key={i} style={styles.exampleItem}>"{ex}"</div>
            ))}

            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {!saved ? (
                <button style={styles.btnPrimary} onClick={handleSave}>Save to Review</button>
              ) : (
                <span style={{ ...styles.badge, marginTop: "16px" }}>✓ Saved for review</span>
              )}
              <button style={styles.btnSecondary} onClick={handleNext}>
                {idx < VOCAB_ITEMS.length - 1 ? "Next Word →" : "Start Over"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── REVIEW ────────────────────────────────────────────────────────────────────
function Review({ learned, onUpdateReview }) {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const reviewItems = learned;

  if (reviewItems.length === 0) {
    return (
      <div>
        <div style={styles.sectionLabel}>Review Queue</div>
        <h2 style={styles.sectionTitle}>Nothing to review yet</h2>
        <p style={styles.sectionSub}>Practice phrases and vocabulary, then save items to build your review queue. Items resurface at 1 day → 3 days → 7 days → 14 days.</p>
        <div style={{ ...styles.card, textAlign: "center", padding: "48px" }}>
          <p style={{ color: "#4A4845", fontStyle: "italic", fontSize: "15px" }}>
            Your saved phrases and words will appear here for spaced review.
          </p>
        </div>
      </div>
    );
  }

  const item = reviewItems[reviewIdx % reviewItems.length];

  function handleNext() {
    onUpdateReview(item.id);
    setReviewIdx(reviewIdx + 1);
    setInput("");
    setRevealed(false);
  }

  return (
    <div>
      <div style={styles.sectionLabel}>Review Queue</div>
      <h2 style={styles.sectionTitle}>Production review — always write first</h2>
      <p style={styles.sectionSub}>{reviewItems.length} item{reviewItems.length !== 1 ? "s" : ""} saved. Spaced repetition: 1 day → 3 days → 7 days → 14 days.</p>

      <div style={styles.card}>
        <div style={styles.situationTag}>{item.type === "phrase" ? "Phrase" : "Vocabulary"} · {item.category}</div>
        <p style={styles.situationText}>"{item.situation}"</p>
        <p style={styles.promptText}>{item.type === "phrase" ? item.prompt : item.prompt}</p>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write your version from memory..."
          disabled={revealed}
        />
        {!revealed && (
          <button
            style={{ ...styles.btnPrimary, opacity: input.trim().length < 3 ? 0.4 : 1 }}
            onClick={() => setRevealed(true)}
            disabled={input.trim().length < 3}
          >
            Check
          </button>
        )}
        {revealed && (
          <div style={styles.feedbackBox}>
            <div style={styles.feedbackLabel}>
              {item.type === "phrase" ? "Best Natural Version" : "Answer"}
            </div>
            {item.type === "phrase" ? (
              <>
                {item.toneLadder.filter(t => t.best).map((t, i) => (
                  <p key={i} style={{ ...styles.toneExample(true), fontSize: "16px", marginBottom: "16px" }}>
                    "{t.example}"
                  </p>
                ))}
                <div style={styles.tipBox}><p style={styles.tipText}>💡 {item.tip}</p></div>
              </>
            ) : (
              <>
                <div style={styles.wordReveal}>{item.word}</div>
                <p style={styles.definitionText}>{item.definition}</p>
                <div style={styles.tipBox}><p style={styles.tipText}>💡 {item.toneNote}</p></div>
              </>
            )}
            <button style={{ ...styles.btnPrimary, marginTop: "20px" }} onClick={handleNext}>
              {reviewIdx < reviewItems.length - 1 ? "Next Review Item →" : "Review Complete ✓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function Home({ learned, onNav }) {
  const phraseCount = learned.filter(l => l.type === "phrase").length;
  const vocabCount = learned.filter(l => l.type === "vocab").length;
  const totalSessions = phraseCount + vocabCount;

  return (
    <div>
      <div style={styles.sectionLabel}>Today</div>
      <h2 style={styles.sectionTitle}>Good to see you back.</h2>
      <p style={styles.sectionSub}>The vocabulary is there. The logic is there. The natural packaging is not — yet.</p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{phraseCount}</span>
          <span style={styles.statLabel}>Phrases Saved</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{vocabCount}</span>
          <span style={styles.statLabel}>Words Learned</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{learned.length}</span>
          <span style={styles.statLabel}>In Review Queue</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{ ...styles.card, cursor: "pointer", transition: "border-color 0.2s" }}
          onClick={() => onNav("phrases")}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#C8A97E"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2825"}
        >
          <div style={styles.situationTag}>Daily Practice</div>
          <p style={{ fontSize: "17px", marginBottom: "8px", fontStyle: "italic" }}>Phrase Practice →</p>
          <p style={{ fontSize: "13px", color: "#6B6660", lineHeight: "1.6" }}>
            Real situations. Write your version. See the natural alternative and why it works. Tone ladder included.
          </p>
        </div>
        <div
          style={{ ...styles.card, cursor: "pointer", transition: "border-color 0.2s" }}
          onClick={() => onNav("vocab")}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#C8A97E"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2825"}
        >
          <div style={styles.situationTag}>Vocabulary</div>
          <p style={{ fontSize: "17px", marginBottom: "8px", fontStyle: "italic" }}>Vocabulary in Context →</p>
          <p style={{ fontSize: "13px", color: "#6B6660", lineHeight: "1.6" }}>
            Fill in the blank from a real situation. Unlock the word's meaning, emotional feel, and real-life examples.
          </p>
        </div>
        {learned.length > 0 && (
          <div
            style={{ ...styles.card, cursor: "pointer", transition: "border-color 0.2s", borderColor: "#3A2E1E" }}
            onClick={() => onNav("review")}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#C8A97E"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#3A2E1E"}
          >
            <div style={styles.situationTag}>Spaced Review</div>
            <p style={{ fontSize: "17px", marginBottom: "8px", fontStyle: "italic" }}>Review Queue ({learned.length}) →</p>
            <p style={{ fontSize: "13px", color: "#6B6660", lineHeight: "1.6" }}>
              Items you saved surface here. Always as a production task — never passive flashcards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [learned, setLearned] = useState([]);

  function handleLearn(item) {
    setLearned(prev => {
      if (prev.some(l => l.id === item.id)) return prev;
      return [...prev, item];
    });
  }

  function handleUpdateReview(id) {
    setLearned(prev => prev.map(l => {
      if (l.id !== id) return l;
      const intervals = [1, 3, 7, 14];
      const currentIdx = intervals.indexOf(l.reviewInterval || 1);
      const nextInterval = intervals[Math.min(currentIdx + 1, intervals.length - 1)];
      return { ...l, reviewInterval: nextInterval, learnedAt: Date.now() };
    }));
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "phrases", label: "Phrases" },
    { id: "vocab", label: "Vocabulary" },
    { id: "review", label: `Review${learned.length > 0 ? ` (${learned.length})` : ""}` },
  ];

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <span style={styles.logo}>Confidence</span>
        <span style={styles.streak}>Help me say this naturally.</span>
      </header>
      <nav style={styles.nav}>
        {navItems.map(n => (
          <button key={n.id} style={styles.navBtn(tab === n.id)} onClick={() => setTab(n.id)}>
            {n.label}
          </button>
        ))}
      </nav>
      <main style={styles.main}>
        {tab === "home" && <Home learned={learned} onNav={setTab} />}
        {tab === "phrases" && <PhrasePractice onLearn={handleLearn} learned={learned} />}
        {tab === "vocab" && <VocabPractice onLearn={handleLearn} learned={learned} />}
        {tab === "review" && <Review learned={learned} onUpdateReview={handleUpdateReview} />}
      </main>
    </div>
  );
}
