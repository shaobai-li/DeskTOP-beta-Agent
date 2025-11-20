import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import SidePanel from "@components/sidebar/SidePanel";
import ChatPanel from "@components/chatbot/ChatPanel";
import TextbasePage from "@pages/TextbasePage";
import TextbaseArticlesPage from "@pages/TextbaseArticlesPage";
import TextbaseTagsPage from "@pages/TextbaseTagsPage";
import AgentPage from "@pages/AgentPage";
import "./App.css";

function ChatPanelWrapper() {
    const { chatId } = useParams();
    return <ChatPanel chatId={chatId} key={chatId} />;
}

function AgentPageWrapper() {
    const { agentId } = useParams();
    return <AgentPage key={agentId} />;
}

function Tags() {
    return (
        <div style={{ textAlign: 'left', color: '#666' }}>
            <h2>标签页面</h2>
            <p>标签内容将在这里显示...</p>
        </div>
    );
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
                        <Route path="/textbase/" element={<TextbasePage />}>
                            <Route index element={<Navigate to="articles" replace />} />
                            <Route path="articles" element={<TextbaseArticlesPage />} />
                            <Route path="tags" element={<TextbaseTagsPage />} />
                        </Route>
                    </Routes>
                </main>
            </div>    
        </BrowserRouter>
    )
}

export default App