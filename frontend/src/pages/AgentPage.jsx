import { useState } from 'react'
import './AgentPage.css'
import PromptInput from '../components/PromptInput'

function AgentPage() {
  const [agent, setAgent] = useState({
    agentId: '',
    title: '',
    profile: '',
    quadrantPrompt: '',
    scriptGenerationPrompt: '',
    languageStylePrompt: ''
  })

  const handleChange = (field) => (e) => {
    setAgent(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="app">
      <div className="container">
        <PromptInput
          title="人设"
          value={agent.profile}
          onChange={handleChange('profile')}
          placeholder="请输入知能体的人设描述..."
        />
        
        <PromptInput
          title="选题四象限提示词"
          value={agent.quadrantPrompt}
          onChange={handleChange('quadrantPrompt')}
          placeholder="请输入选题四象限提示词..."
        />
        
        <PromptInput
          title="文字稿提示词"
          value={agent.scriptGenerationPrompt}
          onChange={handleChange('scriptGenerationPrompt')}
          placeholder="请输入文字稿提示词..."
        />
        
        <PromptInput
          title="语言风格提示词"
          value={agent.languageStylePrompt}
          onChange={handleChange('languageStylePrompt')}
          placeholder="请输入语言风格提示词..."
        />
      </div>
    </div>
  )
}

export default AgentPage
