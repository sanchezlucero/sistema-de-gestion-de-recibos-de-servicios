from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal
from schemas.luz import Consumo, ConsumoResponse
from models.luz import ConsumoLuzDB

from routers.configuracion import obtener_numero_inquilinos


router = APIRouter(
    prefix="/consumos",
    tags=["Luz"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def validar_consumo(consumo: Consumo):
    if consumo.lectura_actual < consumo.lectura_anterior:
        raise HTTPException(
            status_code=400,
            detail="La lectura actual no puede ser menor que la lectura anterior"
        )

    if consumo.costo_kwh < 0:
        raise HTTPException(
            status_code=400,
            detail="El costo por kWh no puede ser negativo"
        )


def calcular_consumo_luz(consumo: Consumo, numero_inquilinos: int):
    consumo_kwh = consumo.lectura_actual - consumo.lectura_anterior
    subtotal_energia = consumo_kwh * consumo.costo_kwh

    cargos_por_persona = (
        consumo.reposicion +
        consumo.cargo_fijo +
        consumo.interes_compensatorio +
        consumo.alumbrado_publico +
        consumo.igv +
        consumo.recargo_mora +
        consumo.redondeo_mes_anterior -
        consumo.redondeo_mes_actual
    ) / numero_inquilinos

    total = subtotal_energia + cargos_por_persona

    return consumo_kwh, subtotal_energia, cargos_por_persona, round(total, 2)


@router.post("/")
def crear_consumo(consumo: Consumo, db: Session = Depends(get_db)):

    validar_consumo(consumo)

    numero_inquilinos = obtener_numero_inquilinos(
        db,
        consumo.mes)

    consumo_kwh, subtotal_energia, cargos_por_persona, total = (
        calcular_consumo_luz(consumo, numero_inquilinos)
    )

    """ consumo_kwh = consumo.lectura_actual - consumo.lectura_anterior
    subtotal_energia = consumo_kwh * consumo.costo_kwh

    cargos_por_persona = (
        consumo.reposicion +
        consumo.cargo_fijo +
        consumo.interes_compensatorio +
        consumo.alumbrado_publico +
        consumo.igv +
        consumo.recargo_mora +
        consumo.redondeo_mes_anterior -
        consumo.redondeo_mes_actual
    ) / numero_inquilinos

    total = subtotal_energia + cargos_por_persona """

    consumo_db = ConsumoLuzDB(
        tipo=consumo.tipo,
        mes=consumo.mes,
        anio=consumo.anio,
        lectura_anterior=consumo.lectura_anterior,
        lectura_actual=consumo.lectura_actual,
        consumo_kwh=consumo_kwh,
        subtotal_energia=subtotal_energia,
        cargos_por_persona=cargos_por_persona,
        total_por_persona=round(total, 2)
    )

    db.add(consumo_db)
    db.commit()
    db.refresh(consumo_db)

    return {
        "id": consumo_db.id,
        "total_por_persona": consumo_db.total_por_persona
    }


@router.put("/{consumo_id}")
def actualizar_consumo(
    consumo_id: int,
    consumo: Consumo,
    db: Session = Depends(get_db)
):
    consumo_db = db.query(ConsumoLuzDB).filter(
        ConsumoLuzDB.id == consumo_id
    ).first()

    if not consumo_db:
        raise HTTPException(status_code=404, detail="Consumo no encontrado")

    validar_consumo(consumo)
    
    numero_inquilinos = obtener_numero_inquilinos(
        db,
        consumo.mes)
    
    consumo_kwh, subtotal_energia, cargos_por_persona, total = (
        calcular_consumo_luz(consumo, numero_inquilinos)
    )
    
    # Actualizar campos

    consumo_db.tipo = consumo.tipo
    consumo_db.mes = consumo.mes,
    consumo_db.anio = consumo.anio,
    consumo_db.lectura_anterior = consumo.lectura_anterior
    consumo_db.lectura_actual = consumo.lectura_actual
    consumo_db.consumo_kwh = consumo_kwh
    consumo_db.subtotal_energia = subtotal_energia
    consumo_db.cargos_por_persona = cargos_por_persona
    consumo_db.total_por_persona = round(total, 2)

    db.commit()
    db.refresh(consumo_db)

    return {
        "id": consumo_db.id,
        "total_por_persona": consumo_db.total_por_persona
    }


@router.delete("/{consumo_id}")
def eliminar_consumo(consumo_id: int, db: Session = Depends(get_db)):
    consumo_db = db.query(ConsumoLuzDB).filter(
        ConsumoLuzDB.id == consumo_id
    ).first()

    if not consumo_db:
        raise HTTPException(status_code=404, detail="Consumo no encontrado")

    db.delete(consumo_db)
    db.commit()

    return {"message": "Consumo eliminado correctamente"}


@router.get("/", response_model=List[ConsumoResponse])
def listar_consumos(db: Session = Depends(get_db)):
    return db.query(ConsumoLuzDB).all()


@router.get("/periodo", response_model=List[ConsumoResponse])
def listar_consumos_por_periodo(
    mes: int,
    anio: int,
    db: Session = Depends(get_db)
):
    return db.query(ConsumoLuzDB).filter(
        ConsumoLuzDB.mes == mes,
        ConsumoLuzDB.anio == anio
    ).all()
