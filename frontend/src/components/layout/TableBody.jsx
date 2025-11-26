import MoreButton from '@components/common/MoreButton';


function TableBody({ data }) {

    return (
        <tbody>
        {data.map((row, i) => (
            <tr key={i}>

            {Object.values(row)
                .slice(1)
                .map((cell, j) => (
                <td key={j}>{cell}</td>
                ))}

            <td className="action-cell">
                <MoreButton onClick={null} />
            </td>
            </tr>
        ))}
        </tbody>
    );
}

export default TableBody;
