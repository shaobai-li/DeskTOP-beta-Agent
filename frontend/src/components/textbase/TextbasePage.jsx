import './TextbasePage.css';
  
const MOCK_ROWS = [
    { id: 1, title: "Header" },
    { id: 2, title: "Table of contents" },
    { id: 3, title: "Cover page" },
    { id: 4, title: "Executive summary" },
    { id: 5, title: "Technical approach" },
    { id: 6, title: "Design" },
];

export default function TextbasePage() {

    const rows = MOCK_ROWS;

    return (
        <div className="textbase-page">
            <div className="textbase-header">
                <h1>我的文本库</h1>
                <p className="textbase-subtitle">管理并查看你的文本资料</p>
            </div>

            <div className="textbase-content">
                <div className="table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>文档名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                            <td colSpan={1} className="empty-cell">
                                暂无数据
                            </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.title}</td>
                            </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}