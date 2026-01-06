from database import engine, Base
from models import *   # 👈 IMPORTANTE

Base.metadata.create_all(bind=engine)
