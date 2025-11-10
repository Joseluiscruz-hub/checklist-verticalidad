Sitio publicado: https://joseluiscruz.me/

📦 Checklist de Verticalidad y Estibado – Planta Cuautitlán

Aplicación web modular desarrollada para Coca-Cola FEMSA Planta Cuautitlánm, diseñada para verificar la correcta estiba y verticalidad de productos en planta. Optimiza procesos operativos, permite trazabilidad offline y está lista para ser empaquetada como PWA.

🧠 Propósito institucional

Esta herramienta busca dignificar el proceso de inspección en planta, empoderar al equipo operativo y dejar un legado técnico replicable. Su diseño modular permite adaptaciones en otras plantas y su documentación garantiza continuidad.

---

🛠️ Módulos incluidos

- ✅ Verificación de productos con checklist dinámico por SKU  
- 📷 Escaneo QR para carga rápida de datos  
- 📚 Historial filtrable con exportación a Excel  
- 📊 Estadísticas visuales con Chart.js  
- 🗃️ Gestión de base de datos con IndexedDB y modo offline  
- ⚙️ Configuración avanzada: calidad de fotos, limpieza de datos, exportación total  
- 🖨️ Impresión institucional con branding FEMSA  

---

📁 Estructura del proyecto

`
Verticalidad/
├── index.html
├── scripts/
│   ├── main.js
│   ├── checklist.js
│   ├── db.js
│   ├── qr.js
│   └── print.js
├── styles/
│   └── custom.css
├── assets/
│   ├── logo.png
│   └── icons/
├── manifest.json
├── service-worker.js
└── README.md
`

---

🚀 Instalación y uso

1. Clona el repositorio:
   `bash
   git clone https://github.com/Joseluiscruz-hub/Verticalidad.git
   `
2. Abre index.html en tu navegador.
3. Para modo offline, instala como PWA en tu dispositivo móvil.

---

📊 Requisitos técnicos

- Navegador moderno (Chrome, Edge, Firefox)
- Soporte para IndexedDB
- Acceso a cámara para escaneo QR
- Permisos de GPS para ubicación

---

📌 Changelog

v2.7.0
- Guardado corregido en historial
- Escaneo QR funcional
- Estadísticas y gráficos agregados
- Modo oscuro adaptativo
- Exportación completa de base de datos

---

🧬 Legado técnico

Este proyecto forma parte del esfuerzo por construir soluciones modulares, dignas y replicables dentro de FEMSA. Su documentación y estructura permiten que otros equipos lo adopten, lo adapten y lo mantengan con facilidad.
`

---


Instrucciones rápidas

- Para desplegar: push a `master` (GitHub Action se encarga de publicar en `gh-pages`).

Licencia

- (Añade tu licencia aquí si procede)

