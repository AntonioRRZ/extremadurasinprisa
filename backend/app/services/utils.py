import hashlib
import secrets
import string


def generate_serial(prefix: str = "ESP") -> str:
    alphabet = string.ascii_uppercase + string.digits
    return f"{prefix}-{''.join(secrets.choice(alphabet) for _ in range(10))}"


def generate_activation_code() -> str:
    alphabet = string.ascii_uppercase + string.digits
    parts = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(3)]
    return "-".join(parts)


def generate_stamp_secret() -> str:
    return secrets.token_urlsafe(18)


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def build_stamp_qr_payload(public_code: str, secret: str) -> str:
    return f"ESPSTAMP|{public_code}|{secret}"

