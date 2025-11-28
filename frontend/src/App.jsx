import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Sidebar from "@pages/Sidebar";
import ChatPage from "@pages/ChatPage";
import TextbasePage from "@pages/TextbasePage";
import TextbaseArticlesPage from "@pages/TextbaseArticlesPage";
import TextbaseTagsPage from "@pages/TextbaseTagsPage";
import AgentPage from "@pages/AgentPage";
import ChatProvider from "@contexts/ChatContext";
import "./App.css";

// function ChatPageWrapper() {
//     const { chatId } = useParams();
//     return <ChatPage chatId={chatId} key={chatId} />;
// }

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
            <ChatProvider>
            <div className="app-container">
                <Sidebar />
                <main className="main-container">
                    <Routes>
                        <Route path="/" element={<ChatPage chatId={null} key="new"/>} />
                        <Route path="/agent/:agentId" element={<AgentPage />} />
                        <Route path="/chat/:chatId" element={<ChatPage />} />
                        <Route path="/textbase/" element={<TextbasePage />}>
                            <Route index element={<Navigate to="articles" replace />} />
                            <Route path="articles" element={<TextbaseArticlesPage />} />
                            <Route path="tags" element={<TextbaseTagsPage />} />
                        </Route>
                    </Routes>
                </main>
            </div>    
            </ChatProvider>
        </BrowserRouter>
    )
}

export default App