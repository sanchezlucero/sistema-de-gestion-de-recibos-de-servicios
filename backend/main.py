from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

# Base de datos - temporal
consumos_db = []


class Consumo(BaseModel):
    tipo: str

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


@app.post("/consumos")
def crear_consumo(consumo: Consumo):
    if consumo.lectura_actual < consumo.lectura_anterior:
        raise HTTPException(status_code=400, detail="Lectura inválida")
    consumo_kwh = (consumo.lectura_actual-consumo.lectura_anterior)
    subtotal_energia = consumo_kwh*consumo.costo_kwh
    cargos_fijos = (
        consumo.reposicion
        + consumo.cargo_fijo
        + consumo.interes_compensatorio
        + consumo.alumbrado_publico
        + consumo.igv
        + consumo.aporte_ley
        + consumo.recargo_mora
        + consumo.redondeo_mes_anterior
        - consumo.redondeo_mes_actual
    )

    cargos_por_persona = cargos_fijos / consumo.numero_inquilinos
    total_por_persona = subtotal_energia+cargos_por_persona
    recibo = {
        "id": len(consumos_db) + 1,
        "tipo": consumo.tipo,
        "lectura": {
            "anterior": consumo.lectura_anterior,
            "actual": consumo.lectura_actual,
            "consumo_kwh": round(consumo_kwh, 2)
        },
        "energia": {
            "precio_kwh": consumo.costo_kwh,
            "subtotal": round(subtotal_energia, 2)
        },
        "cargos_por_persona": round(cargos_por_persona, 2),
        "total_por_persona": round(total_por_persona, 2)
    }

    consumos_db.append(recibo)
    return recibo

@app.get("/consumos")
def listar_consumos():
    return consumos_db


@app.get("/")
def root():
    return {"hello": "World 123"}
