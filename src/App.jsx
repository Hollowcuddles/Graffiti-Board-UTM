import { useState, useEffect } from "react";

export default function App() {
  // ------------------------
  // State
  // ------------------------
  const [mode, setMode] = useState("home"); // "home", "new", "join"
  const [joinUrl, setJoinUrl] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const [recentBoards, setRecentBoards] = useState(
    JSON.parse(localStorage.getItem("recentBoards")) || []
  );
  const [loading, setLoading] = useState(false);
  const [liveSession, setLiveSession] = useState(false);

  // ------------------------
  // Theme colors
  // ------------------------
  const colors = {
    light: {
      bg: "bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50",
      surface: "bg-white",
      text: "text-gray-900",
      muted: "text-gray-500",
      primary: "bg-indigo-600 hover:bg-indigo-700",
      secondary: "bg-emerald-600 hover:bg-emerald-700",
      border: "border-gray-200",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-950 to-black",
      surface: "bg-gray-900",
      text: "text-gray-100",
      muted: "text-gray-400",
      primary: "bg-indigo-500 hover:bg-indigo-600",
      secondary: "bg-emerald-500 hover:bg-emerald-600",
      border: "border-gray-800",
    },
  };

  const theme = dark ? colors.dark : colors.light;

  // ------------------------
  // Effects
  // ------------------------
  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("recentBoards", JSON.stringify(recentBoards));
  }, [recentBoards]);

  useEffect(() => {
    if (mode !== "home") {
      const url = mode === "new" ? "https://excalidraw.com" : joinUrl;
      setLiveSession(url.includes("#room="));
    }
  }, [mode, joinUrl]);

  const addRecentBoard = (url) => {
    if (!url) return;
    const updated = [url, ...recentBoards.filter((b) => b !== url)].slice(0, 5);
    setRecentBoards(updated);
  };

  // ------------------------
  // Handlers
  // ------------------------
  const handleJoin = () => {
    if (!joinUrl) return;
    addRecentBoard(joinUrl);
    setMode("join");
  };

  const handleNew = () => {
    addRecentBoard("https://excalidraw.com");
    setMode("new");
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className={`${theme.bg} min-h-screen flex items-center justify-center`}>
      {/* ---------------- Home / Start Page ---------------- */}
      {mode === "home" && (
        <div
          className={`${theme.surface} ${theme.text} w-full max-w-md p-8 rounded-3xl shadow-2xl border ${theme.border} flex flex-col gap-6`}
        >
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-semibold">Graffiti Wall</h1>
            <p className={`text-sm ${theme.muted}`}>
              Create or join collaborative boards
            </p>
          </div>

          {/* New Board */}
          <button
            className={`w-full py-3 rounded-2xl ${theme.primary} text-white font-medium transition`}
            onClick={handleNew}
          >
            New Whiteboard
          </button>

          {/* Join Board */}
          <div className="flex flex-col gap-2">
            <input
              className={`w-full px-4 py-3 rounded-2xl border ${theme.border} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black`}
              placeholder="Paste Excalidraw link"
              value={joinUrl}
              onChange={(e) => setJoinUrl(e.target.value)}
            />

            <p className={`text-xs ${theme.muted} leading-snug`}>
              To start a live session, create it on Excalidraw first and paste the
              link here.
            </p>

            <button
              className={`w-full py-3 rounded-2xl ${theme.secondary} text-white font-medium transition disabled:opacity-50`}
              disabled={!joinUrl}
              onClick={handleJoin}
            >
              Join Whiteboard
            </button>
          </div>

          {/* Recent Boards */}
          {recentBoards.length > 0 && (
            <div className="pt-4">
              <h2 className={`text-sm font-semibold ${theme.muted}`}>Recent Boards</h2>
              <ul className="mt-2 flex flex-col gap-1">
                {recentBoards.map((board, i) => (
                  <li key={i}>
                    <button
                      className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                      onClick={() => {
                        setJoinUrl(board);
                        handleJoin();
                      }}
                    >
                      {board.length > 35 ? board.slice(0, 35) + "..." : board}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer / Smooth Dark Mode Toggle */}
          <div className="flex items-center justify-between pt-4">
            <span className={`text-sm ${theme.muted}`}>Dark mode</span>

            <div
              onClick={() => setDark(!dark)}
              className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 ${
                dark ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              {/* Thumb */}
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  dark ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Whiteboard ---------------- */}
      {mode !== "home" && (
        <div className="w-full h-screen flex flex-col">
          <div
            className={`${theme.surface} ${theme.text} flex items-center justify-between px-4 py-3 shadow border-b ${theme.border}`}
          >
            <button
              className={`px-4 py-2 rounded-xl ${theme.primary} text-white transition`}
              onClick={() => setMode("home")}
            >
              Home
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${theme.muted}`}>
                {mode === "new" ? "New Whiteboard" : "Joined Whiteboard"}
              </span>
              {liveSession && (
                <span className="px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">
                  LIVE
                </span>
              )}
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
              <div className="w-16 h-16 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
            </div>
          )}

          <iframe
            className="flex-1 w-full"
            src={mode === "new" ? "https://excalidraw.com" : joinUrl}
            onLoad={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
          />
        </div>
      )}
    </div>
  );
}

