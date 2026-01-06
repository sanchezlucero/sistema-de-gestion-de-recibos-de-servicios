from pydantic import BaseModel, Field
from datetime import date



class ConfiguracionCreate(BaseModel):
    numero_inquilinos: int = Field(gt=0)
    fecha_vigencia: date


class ConfiguracionResponse(BaseModel):
    id: int
    numero_inquilinos: int
    fecha_vigencia: date

    class Config:
        from_attributes = True
