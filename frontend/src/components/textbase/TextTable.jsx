import "./TextTable.css";

export default function TextTable({ rows }) {
  return (
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
              <td colSpan={3} className="empty-cell">
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
  );
}