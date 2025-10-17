import './TextbasePage.css';
import { useEffect, useState } from "react";


export default function TextbasePage() {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetch("/rows")
          .then((res) => res.json())
          .then((data) => setRows(data))
          .catch((err) => console.error("请求失败：", err));
    }, []);

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
                            <th>日期</th>
                            <th>状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                            <td colSpan={1} className="empty-cell">
                                暂无数据
                            </td>
                            <td colSpan={1} className="empty-cell">
                                暂无数据
                            </td>
                            <td colSpan={1} className="empty-cell">
                                暂无数据
                            </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.title}</td>
                                <td>{r.date}</td>
                                <td>{r.status}</td>
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