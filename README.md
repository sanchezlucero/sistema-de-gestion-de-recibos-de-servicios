# Sistema de gestión de cuentas
Este sistema automatiza la extracción de datos de recibos de servicios en formato PDF y calcula el consumo específico por piso mediante la diferencia de lecturas de medidores.
**Demo en vivo:** [https://sistema-de-gestion-de-recibos-de-se.vercel.app/](https://sistema-de-gestion-de-recibos-de-se.vercel.app/)

## Flujo de Trabajo (Importante)
Para un correcto funcionamiento, sigue este orden en la aplicación:
 * ** Configuración**: Lo primero es dirigirse al apartado de configuración para definir la cantidad de pisos del edificio.
 * ** Registro / Carga de PDF**:
 * Sube el recibo oficial (Pluz o Sedapal).
 * El sistema usará Python y PDFPlumber para extraer montos y fechas automáticamente.
 * Guarda los datos base del recibo.
 * ** Repartos**: Una vez registrado el recibo general, ve a la sección de repartos para ingresar las lecturas de los demás pisos y generar el cálculo individual.

## Tecnologías utilizadas:
* ** Frontend**: React + Vite (Interfaz rápida y reactiva).
* ** Backend**: Python con Flask (Procesamiento de archivos y lógica de negocio).
* ** Extracción de datos**: PDFPlumber (Scraping de precisión para PDFs de Pluz y Sedapal).

## Funcionalidades:
* ** Carga de PDF**: El sistema lee el recibo oficial y extrae automáticamente los montos, fechas y más detalle del PDF.
* ** Cálculo por Diferencial**: Ingreso de consumo de mes anterior  y mes actual.
* ** Cálculo automático del consumo del piso.
* ** Auto-llenado**: Los datos extraídos del PDF se mapean directamente a los campos de la interfaz para evitar errores manuales.

##Instalación y Uso:
### 1. Backend (Flask)
     cd backend-python
     pip install -r requirements.txt
     python app.py
#### 2. Frontend (React + vite)
     cd frontend
     npm install
     npm run dev
