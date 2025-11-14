export async function apiGet(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`网络错误：${response.status}`);
        }

        const data = await response.json();
        return { data, error: null };   // 统一结构
    } catch (error) {
        console.error("API 请求失败：", error);
        return { data: null, error };
    }
}
