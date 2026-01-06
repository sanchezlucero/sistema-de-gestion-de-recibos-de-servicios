from sqlalchemy.orm import Session
from models.configuracion import ConfiguracionDB
from datetime import date

def obtener_numero_inquilinos(db: Session, fecha: date) -> int:
    config = (
        db.query(ConfiguracionDB)
        .filter(ConfiguracionDB.fecha_vigencia <= fecha)
        .order_by(ConfiguracionDB.fecha_vigencia.desc())
        .first()
    )

    if not config:
        raise Exception("No existe configuración de inquilinos")

    return config.numero_inquilinos
