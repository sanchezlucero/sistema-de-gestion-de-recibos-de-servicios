# Sistema de gestión de cuentas

Este sistema automatiza la extracción de datos de recibos de servicios en formato PDF y calcula el consumo específico por piso mediante la diferencia de lecturas de medidores.

**Demo en vivo:** [https://sistema-de-gestion-de-recibos-de-se.vercel.app/](https://sistema-de-gestion-de-recibos-de-se.vercel.app/)

---

## Flujo de Trabajo (Importante)

Para un correcto funcionamiento, debe seguir este orden en la aplicación:

1. **Configuración**: Dirigirse al apartado de configuración para definir la cantidad de pisos del edificio.
2. **Registro / Carga de PDF**:
    * Subir el recibo oficial (Pluz o Sedapal).
    * El sistema utiliza Python y PDFPlumber para extraer montos y fechas automáticamente.
    * Guardar los datos base del recibo.
3. **Repartos**: Una vez registrado el recibo general, ingresar a la sección de repartos para completar las lecturas de los demás pisos y generar el cálculo individual.

---

## Tecnologías utilizadas

* **Frontend**: React + Vite.
* **Backend**: Python con Flask.
* **Extracción de datos**: PDFPlumber (Scraping de precisión para archivos PDF).

---

## Almacenamiento y Persistencia

Para esta versión, el sistema utiliza **LocalStorage**:
* Los datos de configuración y registros de consumo se almacenan localmente en el navegador.
* Esto permite el funcionamiento de la aplicación sin necesidad de una base de datos externa, manteniendo la información de manera privada en el dispositivo del usuario.

---

## Funcionalidades

* **Carga de PDF**: Lectura del recibo oficial y extracción automática de montos, fechas y detalles adicionales.
* **Cálculo por Diferencial**: Gestión de consumo basada en la lectura del mes anterior y el mes actual.
* **Cálculo automático**: Determinación inmediata del consumo por piso y su deuda proporcional.
* **Auto-llenado**: Mapeo directo de los datos extraídos a los campos de la interfaz para reducir errores manuales.

---

## Instalación y Uso

### 1. Backend (Flask)
```bash
cd backend-python
pip install -r requirements.txt
python app.py
```
### 2. Frontend (React + vite)
```bash
cd frontend
npm install
npm run dev
