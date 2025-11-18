import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './AgentPage.css'
import PromptInput from '../components/PromptInput'
import { getAgents } from '../services/agentsService'

function AgentPage() {
  const { agentId } = useParams()
  const [agent, setAgent] = useState([])

  const handleChange = (field) => (e) => {
    setAgent(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  useEffect(() => {
    async function loadAgent(agentId) {
      const { data, error } = await getAgents()
      if (error) {
        console.error("加载知能体失败：", error)
        return
      }
      const agent = data.find(agent => agent.agentId === agentId)
      if (!agent) {
        console.error("知能体不存在：", agentId)
        return
      }
      setAgent(agent)
    }
    loadAgent(agentId)
  }, [agentId])

  return (
    <div className="app">
      <div className="container">
        <h1 className="agent-title">{agent.title}</h1>
        <hr className="agent-title-divider" />
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
