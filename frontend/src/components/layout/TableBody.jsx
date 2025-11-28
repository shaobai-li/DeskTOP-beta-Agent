import MoreButton from '@components/common/MoreButton';


function TableBody({ data, fields }) {
    return (
        <tbody>
        {data.map((row, i) => (
            <tr key={i}>

            {fields ? (
                // 如果传入了 fields，按指定字段显示
                fields.map((field, j) => (
                    <td key={j}>{row[field] || ''}</td>
                ))
            ) : (
                // 如果没有传入 fields，使用原来的逻辑
                Object.values(row)
                    .slice(1)
                    .map((cell, j) => (
                        <td key={j}>{cell}</td>
                    ))
            )}

            <td className="action-cell">
                <MoreButton onClick={null} />
            </td>
            </tr>
        ))}
        </tbody>
    );
}

export default TableBody;
