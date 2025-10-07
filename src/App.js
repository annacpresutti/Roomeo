import React, { useMemo, useRef, useState, useEffect } from "react";

/* RoomieFlow — high-fidelity prototype (v6) */

const membersSeed = [
  { id: "anna", name: "Anna", email: "acp5645@psu.edu", color: "#8B5CF6" },   // purple
  { id: "xiaowen", name: "Xiaowen", email: "xpj5068@psu.edu", color: "#22C55E" }, // green
  { id: "jake", name: "Jake", email: "jrc6728@psu.edu", color: "#F59E0B" },   // orange
  { id: "tenley", name: "Tenley", email: "tjl6106@psu.edu", color: "#38BDF8" } // blue
];

const currency0 = (n) => `$${Number(n).toLocaleString()}`;
const currency2 = (n) => `$${Number(n).toFixed(2)}`;

/* ---------- tiny atoms ---------- */
const Dot = ({ color, className = "" }) => (
  <span className={`inline-block rounded-full ${className}`} style={{ background: color }} />
);
function NameWithDot({ name, color, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Dot color={color} className="w-[10px] h-[10px]" />
      <span>{name}</span>
    </span>
  );
}
function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-zinc-800/80 text-zinc-200 border border-zinc-700 ${className}`}>
      {children}
    </span>
  );
}
function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-zinc-100 font-medium">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ---------- chrome ---------- */
function StatusBar() {
  return (
    <div className="h-10 px-5 flex items-center justify-between text-white/95 text-[13px] tracking-tight">
      <span className="font-semibold">9:41</span>
      <div className="flex items-center gap-2">
        {/* signal */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" className="stroke-white"><g strokeWidth="1.6"><path d="M2 10v2"/><path d="M6 8v4"/><path d="M10 6v6"/><path d="M14 4v8"/><path d="M18 2v10"/></g></svg>
        {/* wifi */}
        <svg width="20" height="14" viewBox="0 0 24 24" fill="none" className="stroke-white"><path d="M2 8c5-4 15-4 20 0" strokeWidth="1.6"/><path d="M6 12c3-2 9-2 12 0" strokeWidth="1.6"/><path d="M10 16c2-1 2-1 4 0" strokeWidth="1.6"/></svg>
        {/* battery */}
        <svg width="28" height="14" viewBox="0 0 32 16" fill="none" className="stroke-white"><rect x="1" y="2" width="26" height="12" rx="3" strokeWidth="1.6"/><rect x="28" y="6" width="3" height="4" rx="1" fill="white"/></svg>
      </div>
    </div>
  );
}

function TopBar({ title, right }) {
  return (
    <div className="sticky top-0 z-10">
      <div className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <h2 className="text-zinc-100 font-semibold tracking-tight">{title}</h2>
        </div>
        {right}
      </div>
    </div>
  );
}

/* Scroll area that can be enabled/disabled per screen */
function ScrollContainer({ children, canScroll }) {
  const ref = useRef(null);
  const [pct, setPct] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setPct(Math.min(1, scrollTop / (scrollHeight - clientHeight || 1)));
      setScrollable(scrollHeight > clientHeight + 2 && canScroll);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [canScroll]);
  return (
    <div ref={ref} className={`relative z-10 h-[calc(100%-40px-56px)] px-5 pb-6 ${canScroll ? "overflow-y-auto" : "overflow-hidden"}`}>
      {children}
      {scrollable && (
        <div className="pointer-events-none absolute right-1 top-2 bottom-[56px] w-1 rounded bg-white/5">
          <div className="w-full rounded bg-white/40" style={{ height: `${Math.max(10, pct * 100)}%`, transform: `translateY(${pct * (100 - Math.max(10, pct * 100))}%)` }} />
        </div>
      )}
    </div>
  );
}

/* Phone frame with a dedicated slot for the fixed tab bar */
function PhoneFrame({ content, tabbar, canScroll }) {
  return (
    <div
      className="mx-auto w-[392px] relative rounded-[36px] bg-zinc-950 border border-zinc-800/80 shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden"
      style={{ aspectRatio: "392/844" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0b0f_0%,#0b0b0f_20%),radial-gradient(1200px_600px_at_50%_-200px,rgba(147,51,234,0.18),transparent)]" />
      <div className="relative z-20"><StatusBar /></div>
      <ScrollContainer canScroll={canScroll}>{content}</ScrollContainer>
      {/* fixed inside the phone */}
      <div className="absolute bottom-0 inset-x-0 z-30 border-t border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
        {tabbar}
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */
function HomeIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" strokeWidth="1.5"/></svg>); }
function PieIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M12 3v9h9" strokeWidth="1.5"/><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" strokeWidth="1.5"/></svg>); }
function DollarIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M12 2v20" strokeWidth="1.6"/><path d="M16 6c0-2-2-3.5-4-3.5S8 4 8 6s2 3 4 3 4 1 4 3-2 3.5-4 3.5S8 14 8 12" strokeWidth="1.6" fill="none"/></svg>); }
function ChatIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M4 5h16v10H7l-3 3V5Z" strokeWidth="1.5"/><circle cx="9" cy="10" r="1" fill="currentColor" className={active ? "text-white" : "text-zinc-400"}/><circle cx="12" cy="10" r="1" fill="currentColor" className={active ? "text-white" : "text-zinc-400"}/><circle cx="15" cy="10" r="1" fill="currentColor" className={active ? "text-white" : "text-zinc-400"}/></svg>); }
function ChartIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M4 20V6m6 14V4m6 16v-8m4 8H2" strokeWidth="1.5"/></svg>); }
function UsersIcon({ active }) { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "stroke-white" : "stroke-zinc-400"}><path d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" strokeWidth="1.5"/><path d="M20 21a8 8 0 1 0-16 0" strokeWidth="1.5"/></svg>); }

/* ---------- Tab bar (icons + labels) ---------- */
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "chores", label: "Chores", icon: PieIcon },
    { id: "payments", label: "Pay", icon: DollarIcon },
    { id: "chat", label: "AI", icon: ChatIcon },
    { id: "summary", label: "Summary", icon: ChartIcon },
    { id: "profiles", label: "Me", icon: UsersIcon },
  ];
  return (
    <nav className="grid grid-cols-6">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          aria-label={label}
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className={`relative py-2.5 flex flex-col items-center gap-1 text-[11px] transition-colors ${tab === id ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          <div className={`grid place-items-center w-10 h-7 rounded-xl transition-all ${tab === id ? "bg-zinc-800/70 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" : ""}`}>
            <Icon active={tab === id} />
          </div>
          <span>{label}</span>
          {tab === id && <span className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />}
        </button>
      ))}
    </nav>
  );
}

/* ---------- Screens ---------- */
function HomeScreen({ members, chores, openTab }) {
  const upcoming = useMemo(() => [...chores].sort((a, b) => a.dueInDays - b.dueInDays).slice(0, 3), [chores]);
  const completion = useMemo(() => Math.round((chores.filter(c => c.done).length / chores.length) * 100), [chores]);
  return (
    <div className="space-y-4">
      <TopBar title="Home" />
      <Card title="This Month" action={<Pill>{completion}% complete</Pill>}>
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400" style={{ width: `${completion}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-300">
          {members.map((m) => (
            <NameWithDot key={m.id} name={m.name} color={m.color} />
          ))}
        </div>
      </Card>
      <Card title="Today’s chores" action={<button onClick={() => openTab("chores")} className="text-xs text-indigo-300">Open Chore Wheel</button>}>
        <ul className="space-y-3">
          {upcoming.map((c) => (
            <li key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl" style={{ background: c.color }} />
                <div className="leading-tight">
                  <p className="text-zinc-100 text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-zinc-400">Due in {c.dueInDays} day{c.dueInDays === 1 ? "" : "s"}</p>
                </div>
              </div>
              <Pill><NameWithDot name={c.assignee.name} color={c.assignee.color} /></Pill>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Payments" action={<button onClick={() => openTab("payments")} className="text-xs text-emerald-300">Settle up</button>}>
        <div className="space-y-3">
          <Row label="Rent" value={currency0(2000)} hint="Equal 4-way split" />
          <Row label="Wi-Fi" value={currency0(80)} hint="Equal 4-way split" />
          <Row label="Electric" value={currency0(120)} hint="Equal 4-way split" />
        </div>
      </Card>
      <div className="h-1" />
    </div>
  );
}
function Row({ label, value, hint }) {
  return (
    <div className="flex items-center justify-between">
      <div className="leading-tight">
        <p className="text-zinc-100 text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-zinc-400">{hint}</p>}
      </div>
      <span className="text-zinc-100 font-semibold">{value}</span>
    </div>
  );
}

/* CHORES — wheel + customizable list (single wheel, correct colors/order) */
function ChoresScreen({ members, chores, setChores }) {
  const [editMode, setEditMode] = useState(false);
  const doneRatio = Math.round((chores.filter(c => c.done).length / chores.length) * 100);

  // rotate assignments clockwise
  const rotate = () => setChores(prev => {
    const ids = ["tenley","anna","jake","xiaowen"]; // same order as wheel below
    const map = Object.fromEntries(ids.map((id,i)=>[id, ids[(i+1)%ids.length]]));
    return prev.map(c => ({ ...c, assignee: members.find(m => m.id === map[c.assignee.id]) || c.assignee, color: (members.find(m => m.id === map[c.assignee.id]) || c.assignee).color }));
  });

  return (
    <div className="space-y-4">
      <TopBar title="Chore Wheel" right={<Pill>{doneRatio}% done</Pill>} />

      {/* Wheel: TL Tenley(blue) / TR Anna(purple) / BL Jake(orange) / BR Xiaowen(green) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col items-center">
        {(() => {
          const tenley = members.find(m => m.id === "tenley");
          const anna   = members.find(m => m.id === "anna");
          const jake   = members.find(m => m.id === "jake");
          const xiaowen= members.find(m => m.id === "xiaowen");
          const bg = `conic-gradient(${anna.color} 0deg 90deg, ${tenley.color} 90deg 180deg, ${jake.color} 180deg 270deg, ${xiaowen.color} 270deg 360deg)`;
          const labels = [
            { m: xiaowen,  angle: 135 }, // TL
            { m: anna,    angle: 45  }, // TR
            { m: jake,    angle: 225 }, // BL
            { m: tenley, angle: 315 }  // BR
          ];
          return (
            <div className="relative w-64 h-64 rounded-full shadow-inner" style={{ background: bg }}>
              {labels.map(({m, angle}) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 128, cy = 128, r = 90;
                const x = cx + r * Math.cos(rad);
                const y = cy - r * Math.sin(rad); // minus to account for CSS Y-down
                return (
                  <div key={m.id} className="absolute text-[10px] text-white/90"
                       style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
                    <div className="px-2 py-1 rounded-full bg-black/40 border border-white/15">{m.name}</div>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <div className="flex gap-3 mt-4">
          <button onClick={() => setEditMode(v => !v)} className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 text-zinc-200">{editMode ? "Done" : "Customize"}</button>
          <button onClick={rotate} className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white shadow">Rotate</button>
        </div>
      </div>

      {/* Customizable list */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-zinc-100 font-medium">All chores</h3>
          <Pill>Auto-rotate weekly</Pill>
        </div>
        <ul className="divide-y divide-zinc-800">
          {chores.map(c => (
            <li key={c.id} className="p-4 flex items-center gap-3">
              <input
                aria-label={`Mark ${c.title} done`}
                type="checkbox"
                checked={c.done}
                onChange={(e) => setChores(prev => prev.map(x => x.id === c.id ? { ...x, done: e.target.checked } : x))}
                className="accent-emerald-400 w-4 h-4 mt-0.5"
              />
              <div className="flex-1 leading-tight">
                <p className="text-zinc-100 font-medium">{c.title}</p>
                <p className="text-xs text-zinc-400">Due in {c.dueInDays} day{c.dueInDays===1?"":"s"} • {c.recurrence}</p>
                {editMode && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {members.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setChores(prev => prev.map(x => x.id === c.id ? { ...x, assignee: m, color: m.color } : x))}
                        className={`px-2.5 py-1 rounded-full text-xs border ${c.assignee.id === m.id ? "border-indigo-400 text-indigo-300" : "border-zinc-700 text-zinc-300"}`}
                      >
                        <NameWithDot name={m.name} color={m.color} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Pill className="shrink-0"><NameWithDot name={c.assignee.name} color={c.assignee.color} /></Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* PAYMENTS — only screen (besides Chores) that scrolls */
function PaymentsScreen({ members }) {
  const roommateCount = members.length; // 4
  const [items, setItems] = useState([
    { id: "rent",     label: "Rent",     total: 2000, dueIn: 5, mode: "equal", shares: Array(4).fill(25) },
    { id: "wifi",     label: "Wi-Fi",    total: 80,   dueIn: 3, mode: "equal", shares: Array(4).fill(25) },
    { id: "electric", label: "Electric", total: 120,  dueIn: 9, mode: "equal", shares: Array(4).fill(25) },
  ]);

  const setMode = (id, mode) => setItems(prev => prev.map(it => it.id === id ? { ...it, mode } : it));
  const updateShare = (itemId, idx, val) =>
    setItems(prev => prev.map(it => {
      if (it.id !== itemId) return it;
      const s = [...it.shares];
      s[idx] = Math.max(0, Math.min(100, Number(val)));
      const sum = s.reduce((a, b) => a + b, 0) || 1;
      return { ...it, shares: s.map(x => (x / sum) * 100) };
    }));

  return (
    <div className="space-y-4">
      <TopBar title="Payments" />
      {items.map(it => (
        <div key={it.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="leading-tight">
              <p className="text-zinc-100 font-medium">{it.label}</p>
              <p className="text-xs text-zinc-400">Due in {it.dueIn} days • Equal 4-way split</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-100 font-semibold">{currency0(it.total)}</p>
              <div className="mt-1 flex items-center gap-2">
                <button onClick={() => setMode(it.id, "equal")}  className={`text-xs px-2 py-1 rounded border ${it.mode === "equal"  ? "border-emerald-400 text-emerald-300" : "border-zinc-700 text-zinc-300"}`}>Equal</button>
                <button onClick={() => setMode(it.id, "custom")} className={`text-xs px-2 py-1 rounded border ${it.mode === "custom" ? "border-indigo-400 text-indigo-300" : "border-zinc-700 text-zinc-300"}`}>Custom</button>
              </div>
            </div>
          </div>

          {it.mode === "equal" && (
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm text-zinc-200">
                  <NameWithDot name={m.name} color={m.color} />
                  <span className="font-medium">{currency2(it.total / roommateCount)}</span>
                </div>
              ))}
            </div>
          )}

          {it.mode === "custom" && (
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={m.id} className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-5 flex items-center gap-2"><Dot color={m.color} className="w-5 h-5"/><span className="text-sm text-zinc-100">{m.name}</span></div>
                  <input type="range" min={0} max={100} value={Math.round(it.shares[i])} onChange={e => updateShare(it.id, i, e.target.value)} className="col-span-5 accent-indigo-500"/>
                  <div className="col-span-2 text-right text-sm text-zinc-300">{Math.round(it.shares[i])}%</div>
                </div>
              ))}
              <div className="text-xs text-zinc-400 text-right">Shares auto-normalize to 100%</div>
              <div className="rounded-xl bg-zinc-800 p-3 flex items-center justify-between">
                <span className="text-zinc-200 text-sm">Each pays</span>
                <span className="text-zinc-100 font-semibold">{currency2(it.total/100)} × share%</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-zinc-300">
        Settlement uses even split across 4 roommates. Adjustments can made in settings.
      </div>
    </div>
  );
}

function ChatScreen() {
  const [input, setInput] = useState("");
  const suggestions = [
    "Propose: rotate chores weekly",
    "Remind: rent due Friday",
    "Ask: Wi-Fi equal split",
    "Create poll: deep clean Sunday?",
    "Nudge: dishes streak reset",
  ];
  return (
    <div className="space-y-4">
      <TopBar title="Roomie AI" />
      <Card title="Smart suggestions">
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 rounded-full text-xs bg-indigo-600/20 text-indigo-200 border border-indigo-500/30">{s}</button>
          ))}
        </div>
      </Card>
      <Card title="Compose a message">
        <div className="rounded-xl bg-zinc-800 p-3">
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ask for help phrasing a note, propose a change, or log a dispute…" className="w-full h-24 bg-transparent outline-none text-zinc-100 text-sm resize-none" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" /> Respectful <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full" /> Evidence-based</div>
          <button className="px-4 py-2 rounded-xl bg-indigo-500 text-zinc-950 font-semibold hover:bg-indigo-400">Draft it</button>
        </div>
      </Card>
    </div>
  );
}

function SummaryScreen({ members, chores }) {
  const totals = useMemo(() => {
    const base = Object.fromEntries(members.map(m => [m.id, 0]));
    chores.forEach(c => { base[c.assignee.id] += c.done ? 1 : 0; });
    return base;
  }, [members, chores]);
  const max = Math.max(...Object.values(totals), 1);
  return (
    <div className="space-y-4">
      <TopBar title="Monthly summary" />
      <Card title="Task distribution">
        <div className="space-y-4">
          {members.map(m => (
            <div key={m.id}>
              <div className="flex items-center justify-between text-sm">
                <NameWithDot name={m.name} color={m.color} className="text-zinc-200" />
                <span className="text-zinc-400">{totals[m.id]} done</span>
              </div>
              <div className="h-3 rounded-full bg-zinc-800 overflow-hidden mt-1">
                <div className="h-full" style={{ width: `${(totals[m.id] / max) * 100}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Streaks">
        <div className="grid grid-cols-2 gap-3">
          {members.map(m => (
            <div key={m.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <NameWithDot name={m.name} color={m.color} className="text-xs text-zinc-400" />
              <p className="text-2xl font-semibold text-zinc-100">{3 + Math.floor(Math.random() * 4)} days</p>
              <p className="text-xs text-emerald-300 mt-1">On-time completion</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProfilesScreen({ members }) {
  const me = members.find(m => m.id === "anna") || members[0];
  const others = members.filter(m => m.id !== me.id);
  return (
    <div className="space-y-4">
      <TopBar title="My profile" />
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full" style={{ background: me.color }} />
          <div className="leading-tight">
            <p className="text-zinc-100 font-medium"><NameWithDot name={me.name} color={me.color} /></p>
            <p className="text-xs text-zinc-400">{me.email}</p>
          </div>
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs text-zinc-400">Fairness score</p>
          <p className="text-xl font-semibold text-zinc-100">92</p>
        </div>
      </div>

      <Card title="How your fairness score works" action={<Pill>Transparent</Pill>}>
        <ul className="text-sm text-zinc-300 space-y-2 list-disc list-inside">
          <li>Based on your contributions: on-time chores, equal payments, and helpful dispute replies.</li>
          <li>Late chores or unpaid balances lower score; pre-agreed swaps don’t hurt you.</li>
          <li>Weights: chores 50%, payments 35%, comms 15%.</li>
        </ul>
      </Card>

      <Card title="Roommates’ fairness (view only)">
        <div className="space-y-3">
          {others.map(m => (
            <div key={m.id} className="flex items-center justify-between">
              <NameWithDot name={m.name} color={m.color} className="text-zinc-200" />
              <span className="text-zinc-100 font-semibold">{80 + Math.floor(Math.random() * 15)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Root ---------- */
export default function RoomieFlowApp() {
  const [tab, setTab] = useState("home");
  const [members] = useState(membersSeed);
  const [chores, setChores] = useState([
    // keep color in sync with assignee
    { id: "trash",    title: "Take out trash",    dueInDays: 2, recurrence: "Weekly",    assignee: membersSeed[0], color: membersSeed[0].color, done: false }, // Anna
    { id: "dishes",   title: "Dishes",            dueInDays: 1, recurrence: "Daily",     assignee: membersSeed[1], color: membersSeed[1].color, done: false }, // Xiaowen
    { id: "bathroom", title: "Clean bathroom",    dueInDays: 5, recurrence: "Bi-weekly", assignee: membersSeed[2], color: membersSeed[2].color, done: true  }, // Jake
    { id: "living",   title: "Vacuum living room",dueInDays: 3, recurrence: "Weekly",    assignee: membersSeed[3], color: membersSeed[3].color, done: false }, // Tenley
  ]);

  const Screen = () => {
    switch (tab) {
      case "home":     return <HomeScreen    members={members} chores={chores} openTab={setTab} />;
      case "chores":   return <ChoresScreen  members={members} chores={chores} setChores={setChores} />;
      case "payments": return <PaymentsScreen members={members} />;
      case "chat":     return <ChatScreen />;
      case "summary":  return <SummaryScreen members={members} chores={chores} />;
      case "profiles": return <ProfilesScreen members={members} />;
      default:         return null;
    }
  };

  const canScroll = ["chores", "payments"].includes(tab);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-zinc-100 py-10">
      <div className="mx-auto max-w-[420px]">
        <PhoneFrame
          canScroll={canScroll}
          content={<Screen />}
          tabbar={<TabBar tab={tab} setTab={setTab} />}
        />
      </div>
    </div>
  );
}

