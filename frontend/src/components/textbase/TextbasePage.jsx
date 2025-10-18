import './TextbasePage.css';
import { useEffect, useState } from "react";
import TextTable from "./TextTable";


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
                <TextTable rows={rows} />
            </div>
        </div>
    )
}