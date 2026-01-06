from sqlalchemy import Column, Integer, Float, String, Date
from datetime import date
from database import Base

class ConsumoAguaDB(Base):
    __tablename__ = "consumos_agua"
    id = Column(Integer, primary_key=True, index=True)
    mes = Column(Date, nullable=False)

    lectura_anterior = Column(Float, nullable=False)
    lectura_actual = Column(Float, nullable=False)

    consumo = Column(Float, nullable=False)
    volumen = Column(Float, nullable=False)
    servicio_alcantarillado = Column(Float, nullable=False)
    cargo_fijo = Column(Float, nullable=False)
    igv = Column(Float, nullable=False)
    mora = Column(Float, nullable=False)
    redondeo_anterior = Column(Float, nullable=False)
    redondeo_actual = Column(Float, nullable=False)
    monto = Column(Float, nullable=False)