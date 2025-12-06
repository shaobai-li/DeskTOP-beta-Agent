import { useState } from 'react';
import MoreButton from '@components/common/MoreButton';
import PopupMenu from '@components/common/PopupMenu';


function TableBody({ data, fields, onDelete, onEdit }) {
    const [menuState, setMenuState] = useState({ show: false, position: null, rowIndex: null });

    const handleMoreClick = (e, rowIndex) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuState({
            show: true,
            position: {
                top: rect.top,
                bottom: rect.bottom,
                right: rect.right
            },
            rowIndex
        });
    };

    const handleCloseMenu = () => {
        setMenuState({ show: false, position: null, rowIndex: null });
    };

    const handleDelete = () => {
        if (menuState.rowIndex !== null && data[menuState.rowIndex]) {
            const item = data[menuState.rowIndex];
            const itemId = item.articleId || item.id || item.tag_id || item.tagId;
            if (itemId && onDelete) {
                onDelete(itemId);
            }
        }
        handleCloseMenu();
    };

    const handleEdit = () => {
        if (menuState.rowIndex !== null && data[menuState.rowIndex]) {
            const item = data[menuState.rowIndex];
            if (onEdit) {
                onEdit(item);
            }
        }
        handleCloseMenu();
    };

    return (
        <>
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
                    <MoreButton onClick={(e) => handleMoreClick(e, i)} />
                </td>
                </tr>
            ))}
            </tbody>

            {menuState.show && (
                <PopupMenu position={menuState.position} onClose={handleCloseMenu}>
                    <div className="flex flex-col min-w-[100px]">
                        <div 
                            className="px-3 py-2 cursor-pointer hover:bg-neutral-100 rounded"
                            onClick={handleEdit}
                        >
                            编辑
                        </div>
                        <div 
                            className="px-3 py-2 cursor-pointer hover:bg-neutral-100 rounded text-red-500"
                            onClick={handleDelete}
                        >
                            删除
                        </div>
                    </div>
                </PopupMenu>
            )}
        </>
    );
}

export default TableBody;
