import { BrowserRouter , Routes, Route, useParams } from "react-router-dom";

import SidePanel from "./components/sidebar/SidePanel";
import ChatPanel from "./components/chatbot/ChatPanel";
import TextbasePage from "./components/textbase/TextbasePage";
import AgentPage from "./pages/AgentPage";




//import "./border.css";
import "./App.css";

function ChatPanelWrapper() {
    const { chatId } = useParams();
    return <ChatPanel chatId={chatId} key={chatId} />;
}

function AgentPageWrapper() {
    const { agentId } = useParams();
    return <AgentPage key={agentId} />;
}

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <SidePanel />
                <main className="main-container">
                    <Routes>
                        <Route path="/" element={<ChatPanel chatId={null} key="new"/>} />
                        <Route path="/agent/:agentId" element={<AgentPageWrapper />} />
                        <Route path="/chat/:chatId" element={<ChatPanelWrapper />} />
                        <Route path="/textbase" element={<TextbasePage />} />
                    </Routes>
                </main>
            </div>    
        </BrowserRouter>
    )
}

export default App