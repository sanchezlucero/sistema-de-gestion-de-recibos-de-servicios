from sqlalchemy import Column, Integer, Float, String, Date
from datetime import date
from database import Base


class ConsumoDB(Base):
    __tablename__ = "consumos"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String)
    mes = Column(Integer)
    anio = Column(Integer)
    lectura_anterior = Column(Float)
    lectura_actual = Column(Float)
    consumo_kwh = Column(Float)

    subtotal_energia = Column(Float)
    cargos_por_persona = Column(Float)
    total_por_persona = Column(Float)

    fecha = Column(Date, default=date.today)
