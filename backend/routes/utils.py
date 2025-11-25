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