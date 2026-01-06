from sqlalchemy import Column, Integer, Float, String, Date
from datetime import date
from database import Base

class ConfiguracionDB(Base):
    __tablename__ = "configuracion"

    id = Column(Integer, primary_key=True, index=True)
    numero_inquilinos = Column(Integer, nullable=False)
    fecha_vigencia = Column(Date, nullable=False)
