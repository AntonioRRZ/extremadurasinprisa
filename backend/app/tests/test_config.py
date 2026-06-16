from app.core.config import Settings


def test_common_passport_qr_url_defaults_to_frontend_home():
    settings = Settings(_env_file=None, frontend_url="https://www.extremadurasinprisas.es/")

    assert settings.frontend_url == "https://www.extremadurasinprisas.es"
    assert settings.common_passport_qr_url == "https://www.extremadurasinprisas.es"


def test_common_passport_qr_url_normalizes_activation_path_to_home():
    settings = Settings(
        _env_file=None,
        frontend_url="https://www.extremadurasinprisas.es/",
        common_passport_qr_url="https://www.extremadurasinprisas.es/activar/",
    )

    assert settings.frontend_url == "https://www.extremadurasinprisas.es"
    assert settings.common_passport_qr_url == "https://www.extremadurasinprisas.es"
