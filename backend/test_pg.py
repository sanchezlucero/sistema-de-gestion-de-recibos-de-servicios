import psycopg2

conn = psycopg2.connect(
    dbname="bd_cuentas",
    user="cuentas_user",
    password="cuentas123",
    host="localhost",
    port="5432"
)

print("Conectado OK")
conn.close()
