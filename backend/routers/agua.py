from fastapi import APIRouter

router = APIRouter(
    prefix="/agua",
    tags=["Agua"]
)


@router.get("/")
def prueba_agua():
    return {"status": "agua ok"}
