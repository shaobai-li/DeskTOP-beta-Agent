import ChatPanel from "./components/main/ChatPanel";
import SidePanel from "./components/side/SidePanel";
import { useState } from "react";
//import "./border.css";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <SidePanel />
      <ChatPanel />
    </div>    
  )
}

export default App