import { useParams, Navigate } from 'react-router-dom'
import PromptInput from '@components/layout/PromptInput'
import { useChat } from '@contexts/ChatContext'

function AgentPage() {
  const { agentId } = useParams()
  const { actions } = useChat()
  
  const agent = actions.getAgentById(agentId)

  

  const handleConfirm = (field) => async (newValue) => {
    actions.updateAgentByField(agentId, field, newValue)
  }

  return (!agent) ? <Navigate to="/" replace /> : (
    <div className="agent-page flex flex-col h-full">
      <div className="agent-page-header text-4xl font-bold px-8 py-8">
        <h1 className="agent-page__title">{agent.title}</h1>
      </div>
      <div className="agent-page-body flex-grow px-8 py-8">
        <PromptInput
          title="人设"
          value={agent.profile}
          placeholder="请输入知能体的人设描述..."
          onConfirm={handleConfirm('profile')}
        />
        
        <PromptInput
          title="语言风格提示词"
          value={agent.languageStylePrompt}
          placeholder="请输入语言风格提示词..."
          onConfirm={handleConfirm('languageStylePrompt')}
        />
      </div>
      {/* <div className="agent-page-footer">agent页面页脚</div> */}
    </div>
  )
}

export default AgentPage
