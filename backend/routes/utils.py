import time
import os
def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

def to_camel_case(data):

    def convert_key(key):
        parts = key.split('_')
        return parts[0] + ''.join(word.capitalize() for word in parts[1:])

    if isinstance(data, dict):
        return {convert_key(k): v for k, v in data.items()}

    if isinstance(data, list):
        return [{convert_key(k): v for k, v in item.items()} for item in data]

    return data


def to_snake_case(data):
    def convert_key(key):
        result = []
        for i, char in enumerate(key):
            if char.isupper() and i > 0:
                result.append('_')
            result.append(char.lower())
        return ''.join(result)
    return {convert_key(k): v for k, v in data.items()}

def uuid7() -> str:
    """生成标准的 UUID v7 字符串（带连字符，时间有序，符合 RFC 9562）"""
    timestamp_ms = int(time.time() * 1000)
    timestamp = timestamp_ms & 0xFFFFFFFFFFFF  # 取低48位

    rand_bytes = os.urandom(10)
    rand = int.from_bytes(rand_bytes, "big")

    uuid_int = (
        (timestamp << 80)                     # 48 位时间戳
        | (0x7 << 76)                         # version = 7
        | ((rand & 0xFFF0000000000000) >> 12) # 12 位 rand_a
        | (0x2 << 62)                         # variant = 10
        | (rand & 0x3FFFFFFFFFFFFFFF)         # 62 位 rand_b
    )

    hex_str = f"{uuid_int:032x}"
    return f"{hex_str[0:8]}-{hex_str[8:12]}-{hex_str[12:16]}-{hex_str[16:20]}-{hex_str[20:32]}"