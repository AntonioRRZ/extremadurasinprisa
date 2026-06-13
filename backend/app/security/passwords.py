import hashlib
import hmac
import os
from base64 import b64decode, b64encode


ITERATIONS = 390_000
ALGORITHM = "sha256"


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    derived_key = hashlib.pbkdf2_hmac(ALGORITHM, password.encode("utf-8"), salt, ITERATIONS)
    return f"pbkdf2_{ALGORITHM}${ITERATIONS}${b64encode(salt).decode('ascii')}${b64encode(derived_key).decode('ascii')}"


def verify_password(password: str, password_hash: str) -> bool:
    scheme, iterations, salt, expected = password_hash.split("$", maxsplit=3)
    if not scheme.startswith("pbkdf2_"):
        return False
    derived_key = hashlib.pbkdf2_hmac(ALGORITHM, password.encode("utf-8"), b64decode(salt), int(iterations))
    return hmac.compare_digest(b64encode(derived_key).decode("ascii"), expected)
