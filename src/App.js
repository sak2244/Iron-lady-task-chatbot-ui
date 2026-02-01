import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "AI",
      text: "Welcome to Iron Lady Creative. Tell me about your background and career goals.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "You", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { from: "AI", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "AI", text: "⚠️ Backend not reachable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-indigo-900 to-slate-900 text-white flex flex-col">
      <header className="p-6 text-center border-b border-white/10">
        <h1 className="text-2xl font-bold">🤖 Iron Lady AI Career Guide</h1>
        <p className="text-sm text-white/60">
          Helping women choose the right career program
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-4 rounded-2xl ${
              m.from === "You" ? "ml-auto bg-white/25" : "bg-white/15"
            }`}
          >
            <div className="text-xs text-white/50 mb-1">{m.from}</div>
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-white/50 italic text-sm">AI is typing…</div>
        )}
      </main>

      <footer className="p-4 flex gap-3 border-t border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your background and goals…"
          className="flex-1 rounded-full px-5 py-3 text-sm text-black"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 rounded-full bg-pink-500 font-semibold"
        >
          Ask
        </button>
      </footer>
    </div>
  );
}

export default App;
