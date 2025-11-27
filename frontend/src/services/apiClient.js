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

export async function apiPatch(url, body) {
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`网络错误：${response.status}`);
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        console.error("API 请求失败：", error);
        return { data: null, error };
    }
}
export async function apiPost(url, body, { stream = false } = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`网络错误：${response.status}`);
        }

        if (stream) {
            return response; // 直接返回 Response 对象
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        console.error("API 请求失败：", error);
        return { data: null, error };
    }
}