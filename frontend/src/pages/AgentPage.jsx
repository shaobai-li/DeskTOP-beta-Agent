import { useParams, Navigate } from 'react-router-dom'
import PromptInput from '@components/layout/PromptInput'
import { useChat } from '@contexts/ChatContext'
import TagsInput from '@components/common/TagsInput'
import Button from '@components/common/Button'


function AgentPage() {
  const { agentId } = useParams()
  const { state, actions } = useChat()
  
  const agent = actions.getAgentById(agentId)


  const handleConfirm = (field) => async (newValue) => {
    actions.updateAgentByField(agentId, field, newValue)
  }

  const handleTagsChange = async (newTags) => {
    const tagIds = newTags.map(tag => tag.tagId).filter(Boolean);
    await actions.updateAgentTagsByAgentId(agentId, tagIds);
  }

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
        
        <div className="flex flex-row  justify-between">
          <div className="flex flex-col">
            <label>标签</label>
            <TagsInput
              options={state.tags}
              value={agent.tags}
              onChange={handleTagsChange}
            />
          </div>
          <div className="flex flex-col justify-end">
            <Button text="保存" onClick={null} />
          </div>
        </div>
      </div>
      {/* <div className="agent-page-footer">agent页面页脚</div> */}
    </div>
  )
}

export default AgentPage
