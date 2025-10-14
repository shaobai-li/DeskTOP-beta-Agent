import { BrowserRouter , Routes, Route } from "react-router-dom";

import ChatPanel from "./components/chatbot/ChatPanel";
import SidePanel from "./components/sidebar/SidePanel";
import TextbasePage from "./components/textbase/TextbasePage";

//import "./border.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <SidePanel />
        <main className="main-container">
          <Routes>
            <Route path="/chat" element={<ChatPanel />} />
            <Route path="/textbase" element={<TextbasePage />} />
          </Routes>
        </main>
      </div>    
    </BrowserRouter>
  )
}

export default App