from pydantic import BaseModel, Field
from datetime import date



class ConsumoAguaCreate(BaseModel):
    tipo: str
    mes: int = Field(ge=1, le=12)
    anio: int = Field(ge=2020)
    lectura_anterior: float = Field(ge=0)
    lectura_actual: float = Field(ge=0)
    volumen: float = Field(gt=0)
    servicio_alcantarillado: float = Field(ge=0)
    cargo_fijo: float = Field(ge=0)
    igv: float = Field(ge=0)
    mora: float = Field(ge=0)
    redondeo_anterior: float = Field(ge=0)
    redondeo_actual: float = Field(ge=0)


class ConsumoAguaResponse(BaseModel):
    id: int
    tipo: str
    mes: int
    anio: int
    consumo: float
    total_por_persona: float
    fecha: date

    class Config:
        from_attributes = True