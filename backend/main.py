from fastapi import FastAPI

from routers import luz
from routers import agua
from routers import configuracion

app = FastAPI(
    title="Sistema de Consumos",
    version="1.0.0"
)

# Registrar routers
app.include_router(luz.router)
app.include_router(agua.router)


@app.get("/")
def root():
    return {"status": "ok"}


""" def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/consumos")
def crear_consumo(consumo: Consumo, db: Session = Depends(get_db)):

    if consumo.lectura_actual < consumo.lectura_anterior:
        raise HTTPException(
            status_code=400, detail="La lectura actual no puede ser menor que la lectura anterior")
    if consumo.costo_kwh < 0:
        raise HTTPException(
            status_code=400, detail="El costo por kWh no puede ser negativo")

    if consumo.numero_inquilinos <= 0:
        raise HTTPException(
            status_code=400, detail="El número de inquilinos debe ser mayor a 0")

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
    ) / consumo.numero_inquilinos

    total = subtotal_energia + cargos_por_persona

    consumo_db = ConsumoDB(
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


@app.put("/consumos/{consumo_id}")
def actualizar_consumo(
    consumo_id: int,
    consumo: Consumo,
    db: Session = Depends(get_db)
):
    consumo_db = db.query(ConsumoDB).filter(ConsumoDB.id == consumo_id).first()

    if not consumo_db:
        raise HTTPException(status_code=404, detail="Consumo no encontrado")
    if consumo.lectura_actual < consumo.lectura_anterior:
        raise HTTPException(
            status_code=400, detail="La lectura actual no puede ser menor que la lectura anterior")
    if consumo.costo_kwh < 0:
        raise HTTPException(
            status_code=400, detail="El costo por kWh no puede ser negativo")

    if consumo.numero_inquilinos <= 0:
        raise HTTPException(
            status_code=400, detail="El número de inquilinos debe ser mayor a 0")

    # Recalcular
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
    ) / consumo.numero_inquilinos

    total = subtotal_energia + cargos_por_persona

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


@app.delete("/consumos/{consumo_id}")
def eliminar_consumo(consumo_id: int, db: Session = Depends(get_db)):
    consumo_db = db.query(ConsumoDB).filter(
        ConsumoDB.id == consumo_id).first()
    if not consumo_db:
        raise HTTPException(status_code=404, detail="Consumo no encontrado")
    db.delete(consumo_db)
    db.commit()

    return {
        "message": f"Consumo con id {consumo_id} eliminado correctamente"
    }


@app.get("/consumos", response_model=List[ConsumoResponse])
def listar_consumos(db: Session = Depends(get_db)):
    return db.query(ConsumoDB).all()


@app.get("/consumos/periodo", response_model=List[ConsumoResponse])
def listar_consumos_por_periodo(mes: int, anio: int, db: Session = Depends(get_db)):
    consumos = db.query(ConsumoDB).filter(
        ConsumoDB.mes == mes, ConsumoDB.anio == anio).all()
    return consumos """
