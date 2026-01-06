from pydantic import BaseModel, Field
from datetime import date


class Consumo(BaseModel):
    tipo: str
    mes: int = Field(ge=1, le=12)
    anio: int = Field(ge=2020)
    lectura_anterior: float = Field(ge=0)
    lectura_actual: float = Field(ge=0)
    costo_kwh: float = Field(gt=0)

    reposicion: float = Field(ge=0)
    cargo_fijo: float = Field(ge=0)
    interes_compensatorio: float = Field(ge=0)
    alumbrado_publico: float = Field(ge=0)
    igv: float = Field(ge=0)
    aporte_ley: float = Field(ge=0)
    recargo_mora: float = Field(ge=0)

    redondeo_mes_anterior: float
    redondeo_mes_actual: float

    numero_inquilinos: int = Field(gt=0)


class ConsumoResponse(BaseModel):
    id: int
    tipo: str
    mes: int
    anio: int
    consumo_kwh: float
    total_por_persona: float
    fecha: date

    class Config:
        from_attributes = True  # SQLAlchemy → Pydantic