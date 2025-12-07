import { useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import PromptInput from '@components/layout/PromptInput'
import { useChat } from '@contexts/ChatContext'
import TagsInput from '@components/common/TagsInput'

function AgentPage() {
  const { agentId } = useParams()
  const { state, actions } = useChat()
  
  const agent = actions.getAgentById(agentId)

  const [selectedTags, setSelectedTags] = useState([])

  const handleConfirm = (field) => async (newValue) => {
    actions.updateAgentByField(agentId, field, newValue)
  }

  // 转换后端标签数据为 TagsInput 需要的格式
  const tagOptions = state.tags.map(tag => ({
    id: tag.tagId || tag.id,
    label: tag.name
  }))

  return (!agent) ? <Navigate to="/" replace /> : (
    <div className="agent-page flex flex-col h-full">
      <div className="agent-page-header text-4xl font-bold px-8 py-8">
        <h1 className="agent-page__title">{agent.title}</h1>
      </div>
      <div className="agent-page-body flex-grow px-8 py-8">
        <PromptInput
          title="人设"
          value={agent.personaPrompt}
          placeholder="请输入知能体的人设描述..."
          onConfirm={handleConfirm('personaPrompt')}
        />
        
        <PromptInput
          title="特色卖点"
          value={agent.languageStylePrompt}
          placeholder="请输入特色卖点..."
          onConfirm={handleConfirm('languageStylePrompt')}
        />
        <label>标签</label>
        <TagsInput
          options={tagOptions}
          value={selectedTags}
          onChange={setSelectedTags}
        />
      </div>
      {/* <div className="agent-page-footer">agent页面页脚</div> */}
    </div>
  )
}

export default AgentPage
