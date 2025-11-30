import time
import os

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

