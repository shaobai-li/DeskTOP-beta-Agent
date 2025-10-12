import ChatPanel from "./components/main/ChatPanel";
import { useState } from "react";
//import "./border.css";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <aside className="side-panel">
      </aside>
      <ChatPanel />
    </div>    
  )
}

export default App