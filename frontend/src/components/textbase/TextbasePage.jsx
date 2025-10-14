import './TextbasePage.css';

export default function TextbasePage() {
    return (
        <div className="textbase-page">
            <div className="textbase-header">
                <h1>我的文本库</h1>
                <p className="textbase-subtitle">管理并查看你的文本资料</p>
            </div>

            <div className="textbase-content">
                <div className="empty-state">
                <p>暂无内容，请添加新的文本数据。</p>
                </div>
            </div>
        </div>
    )
}