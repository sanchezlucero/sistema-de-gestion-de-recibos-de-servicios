from flask import Flask, request, jsonify
from datetime import datetime  # Importa esto al inicio de app.py
from flask_cors import CORS
import pdfplumber
import re
import io

app = Flask(__name__)
CORS(app)


def limpiar_texto(texto):
    """Limpia el texto extraído del PDF para facilitar la búsqueda."""
    return re.sub(r'\s+', ' ', texto.replace("*", ""))


def extraer_monto_regex(patron, texto):
    """Busca un valor específico usando expresiones regulares."""
    match = re.search(patron, texto, re.IGNORECASE)
    return match.group(1) if match else "0.00"


def extraer_monto_dificil(palabra_clave, texto_fuente):
    """Busca un monto que puede estar alejado de su palabra clave."""
    patron = rf"{palabra_clave}.{{0,30}}?(\d+\.\d{{2}})"
    match = re.search(patron, texto_fuente, re.IGNORECASE)
    return match.group(1) if match else "0.00"


def encontrar_monto_en_tablas(keyword, lista_plana):
    """Busca un monto numérico cerca de una palabra clave dentro de una tabla."""
    for i, item in enumerate(lista_plana):
        if keyword.lower() in item.lower():
            for j in range(i + 1, min(i + 4, len(lista_plana))):
                valor = lista_plana[j].replace(",", "")
                if re.match(r"^-?\d+\.\d{2}$", valor) or re.match(r"^\d+$", valor):
                    return valor
    return "0.00"


def extraer_datos_sedapal(texto, flat_data):
    fecha_raw = (re.findall(r"(\d{2}/\d{2}/\d{4})", texto) or [""])[-1]
    fecha_iso = ""

    if fecha_raw:
        try:
            # Convertimos de dd/mm/yyyy a yyyy-mm-dd
            fecha_iso = datetime.strptime(
                fecha_raw, "%d/%m/%Y").strftime("%Y-%m-%d")
        except:
            fecha_iso = ""

    return {
        "tipo": "agua",
        "suministro": extraer_monto_regex(r"Cobro\s+(\d+)", texto),
        "consumo": encontrar_monto_en_tablas("Consumo", flat_data),
        "volumen_agua": extraer_monto_regex(r"Potable\s+[\d.]+\s+m3\s+([\d.]+)", texto),
        "servicio_alcantarillado": extraer_monto_regex(r"Alcantarillado\s+([\d.]+)", texto),
        "cargo_fijo": extraer_monto_regex(r"Cargo\s+Fijo\s+([\d.]+)", texto),
        "igv": extraer_monto_regex(r"18%\s+([\d.]+)", texto),
        "mora": extraer_monto_dificil("Mora", texto),
        "redondeo_anterior": extraer_monto_regex(r"anterior\s+([-\d.]+)", texto),
        "redondeo_actual": extraer_monto_regex(r"actual\s+([-\d.]+)", texto),
        "importe_total": extraer_monto_regex(r"Consumo del mes\s+([\d.]+)", texto),
        "fecha": fecha_iso
    }


def extraer_datos_pluz(texto):
    total_match = re.search(
        r"TOTAL\s*A\s*PAGAR.*?([\d,]+\.\d{2})", texto, re.IGNORECASE)
    total_pagar = "0.00"
    if total_match:
        total_pagar = total_match.group(1).replace(",", "")

    # 2. SEGUNDO INTENTO: Si sigue en 0.00, buscamos el número más grande del recibo
    # En el recibo de Pluz, el Total a Pagar suele ser la cifra más alta
    if total_pagar == "0.00":
        todos_los_montos = re.findall(r"(?:\*+)?(\d{2,},?\d*\.\d{2})", texto)
        if todos_los_montos:
            # Convertimos a float para comparar y sacamos el máximo
            montos_float = [float(m.replace(",", ""))
                            for m in todos_los_montos]
            total_pagar = f"{max(montos_float):.2f}"

    vencimiento_raw = extraer_monto_regex(
        r"VENCIMIENTO:\s*(\d{2}/[A-Z]{3}/\d{4})", texto)
    fecha_iso = ""

    if vencimiento_raw:
        meses_map = {
            "ENE": "01", "FEB": "02", "MAR": "03", "ABR": "04", "MAY": "05", "JUN": "06",
            "JUL": "07", "AGO": "08", "SET": "09", "OCT": "10", "NOV": "11", "DIC": "12"
        }
        try:
            dia, mes_nombre, anio = vencimiento_raw.split('/')
            mes_num = meses_map.get(mes_nombre.upper(), "01")
            fecha_iso = f"{anio}-{mes_num}-{dia}"  # Formato YYYY-MM-DD
        except:
            fecha_iso = ""

    return {
        "tipo": "luz",
        "importe_total": total_pagar,
        "cargo_fijo": extraer_monto_regex(r"Cargo Fijo\s*([\d.]+)", texto),
        "reposicion": extraer_monto_regex(r"Reposic\. y Mant\. de Conex\s*([\d.]+)", texto),
        "cargo_por_energia": extraer_monto_regex(r"Cargo por Energía\s*([\d.]+)", texto),
        "alumbrado": extraer_monto_regex(r"Alumbrado Público\s*([\d.]+)", texto),
        "interes_compensatorio": extraer_monto_regex(r"Interés Compensatorio\s*([\d.]+)", texto),
        "mora": extraer_monto_regex(r"Recargo por Mora\s*([\d.]+)", texto),
        "igv": extraer_monto_regex(r"I\.G\.V\.\s*([\d.]+)", texto),
        "aporte_ley": extraer_monto_regex(r"Aporte Ley N° 28749\s*([\d.]+)", texto),
        "redondeo_anterior": extraer_monto_regex(r"Redondeo Mes Anterior\s*([-\d.]+)", texto),
        "redondeo_actual": extraer_monto_regex(r"Redondeo Mes Actual\s*([-\d.]+)", texto),
        "consumo_kWh": extraer_monto_regex(r"al precio de S/\s*([\d.]+)", texto),
        "fecha": fecha_iso
    }


@app.route('/procesar-recibo', methods=['POST'])
def procesar_recibo():
    if 'recibo' not in request.files:
        return jsonify({"error": "No hay archivo"}), 400

    archivo = request.files['recibo']
    try:
        with pdfplumber.open(io.BytesIO(archivo.read())) as pdf:
            pagina = pdf.pages[0]
            texto_original = pagina.extract_text()
            t = limpiar_texto(texto_original)

            # DETECCIÓN DE EMPRESA
            if "PLUZ" in t or "Pluz" in t:
                data = extraer_datos_pluz(t)
            else:
                # Sedapal requiere datos de tablas [cite: 15]
                tablas = pagina.extract_tables()
                flat_data = []
                for tabla in tablas:
                    for fila in tabla:
                        flat_data.extend([str(celda).replace("*", "").strip()
                                         for celda in fila if celda])
                data = extraer_datos_sedapal(t, flat_data)

            return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=3001, debug=True)
