# 📦 Checklist de Verticalidad y Estibado – Coca-Cola FEMSA

**Planta Cuautitlán** | 🌐 [https://joseluiscruz.me/](https://joseluiscruz.me/)

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=flat-square)](https://joseluiscruz.me/)
[![Version](https://img.shields.io/badge/version-3.2.0-blue?style=flat-square)](https://github.com/Joseluiscruz-hub/Verticalidad)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#licencia)

## 🎯 Descripción

Aplicación web profesional (PWA) desarrollada para **Coca-Cola FEMSA Planta Cuautitlán**, diseñada para verificar la correcta estiba y verticalidad de productos en planta. Optimiza procesos operativos, permite trazabilidad offline completa y está lista para instalarse como aplicación nativa.

## 🧠 Propósito Institucional

Esta herramienta busca **dignificar el proceso de inspección** en planta, **empoderar al equipo operativo** y dejar un **legado técnico replicable**. Su diseño modular permite adaptaciones en otras plantas y su documentación garantiza continuidad del proyecto.

---

## 🛠️ Características Principales

### ✅ **Verificación de Productos**
- Checklist dinámico con 10 parámetros de calidad
- Validación por SKU con más de 50 productos pre-cargados
- Captura de fotos con compresión automática
- Geolocalización GPS integrada

### 📷 **Escaneo QR Inteligente**
- Lectura de códigos QR con cámara del dispositivo
- Auto-población de campos de trazabilidad
- Compatible con códigos GS1 y DataMatrix

### 📚 **Historial Completo**
- Filtrado avanzado por fecha, SKU, inspector y estado
- Exportación a Excel (.csv) con formato profesional
- Visualización detallada con fotos adjuntas

### 📊 **Dashboard de Estadísticas**
- Gráficos en tiempo real con Chart.js
- Análisis de cumplimiento por parámetro
- Top productos e inspectores más activos

### 🗃️ **Base de Datos Local**
- IndexedDB para almacenamiento robusto
- Modo offline completo (funciona sin internet)
- Exportación/importación de base de datos completa
- Limpieza automática de datos antiguos

### 🎨 **Diseño Premium**
- UI moderna con Tailwind CSS
- Modo oscuro automático
- Responsive design (móvil, tablet, desktop)
- Branding corporativo Coca-Cola FEMSA

### 🖨️ **Reportes Profesionales**
- Impresión con formato institucional
- Código de documento único
- Resumen ejecutivo con estadísticas
- Incluye fotos en el reporte

---

## 📁 Estructura del Proyecto

```
verticalidad1.2/
├── index.html              # Aplicación principal (SPA)
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service Worker para offline
├── README.md               # Esta documentación
├── .github/
│   └── workflows/          # GitHub Actions para deploy
├── tools/
│   └── cloudflare-worker/  # Worker para optimización CDN
└── tests/
    └── run_playwright_test.py  # Tests automatizados
```

---

## 🚀 Instalación y Uso

### **Opción 1: Uso Directo (Recomendado)**
1. Visita **[https://joseluiscruz.me/](https://joseluiscruz.me/)** desde cualquier dispositivo
2. La aplicación cargará automáticamente
3. **Instalar como PWA**: Click en "Instalar" en tu navegador

### **Opción 2: Desarrollo Local**
```bash
# Clonar el repositorio
git clone https://github.com/Joseluiscruz-hub/Verticalidad.git

# Navegar al directorio
cd Verticalidad

# Abrir con servidor local (ejemplo con Python)
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000
```

### **Opción 3: GitHub Pages**
1. Fork este repositorio
2. Habilita GitHub Pages en Settings > Pages
3. Selecciona rama `gh-pages`
4. Tu sitio estará en `https://[tu-usuario].github.io/Verticalidad/`

---

## 📊 Requisitos del Sistema

| Requisito | Especificación |
|-----------|----------------|
| **Navegador** | Chrome 90+, Edge 90+, Firefox 88+, Safari 14+ |
| **JavaScript** | ES6+ habilitado |
| **IndexedDB** | API disponible |
| **Cámara** | Para escaneo QR (opcional) |
| **GPS** | Para ubicación (opcional) |
| **Espacio** | ~5MB mínimo para caché |

---

## 📌 Changelog

### **v3.2.0** (2025-01-31) - Optimización Completa
- ✨ Mejoras de SEO con meta tags Open Graph
- ♿ Accesibilidad mejorada (ARIA, skip links)
- 🚀 Service Worker v3 con estrategias de caché optimizadas
- 📱 Manifest PWA con shortcuts y múltiples tamaños de íconos
- 🔄 Auto-actualización del Service Worker
- 🐛 Corrección de fugas de memoria en procesamiento de imágenes

### **v3.1.0** (Anterior)
- 📊 Reporte corporativo con formato institucional
- 🏷️ Campo "Área" agregado al checklist
- 🔍 Diagnóstico de base de datos en configuración

### **v2.7.0** (Histórico)
- ✅ Guardado corregido en historial
- 📷 Escaneo QR funcional
- 📈 Estadísticas y gráficos agregados
- 🌙 Modo oscuro adaptativo

---

## 🧬 Legado Técnico

Este proyecto forma parte del esfuerzo por construir **soluciones modulares, dignas y replicables** dentro de Coca-Cola FEMSA. Su documentación completa y estructura limpia permiten que otros equipos lo adopten, adapten y mantengan con facilidad.

### **Principios de Diseño**
- 📦 **Modularidad**: Componentes independientes y reutilizables
- 📚 **Documentación**: Código comentado y documentación exhaustiva
- ♿ **Accesibilidad**: WCAG 2.1 AA compliance
- 🚀 **Performance**: Lighthouse score 95+
- 🔒 **Seguridad**: Validación client-side robusta

---

## 🔧 Instrucciones de Deploy

### **Automático (GitHub Actions)**
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master
# GitHub Action despliega automáticamente a gh-pages
```

### **Manual**
```bash
# Build y deploy a GitHub Pages
git checkout gh-pages
git merge master
git push origin gh-pages
```

---

## 📄 Licencia

**MIT License** - Libre para uso, modificación y distribución.

Copyright © 2025 José Luis Cruz - Coca-Cola FEMSA Planta Cuautitlán

---

## 👨‍💻 Autor

**José Luis Cruz**
Desarrollador Full Stack | Coca-Cola FEMSA
📧 [Contacto](mailto:joseluiscruz@example.com)
🌐 [Portfolio](https://joseluiscruz.me)

---

## 🙏 Agradecimientos

- Equipo de Operaciones de Planta Cuautitlán
- Departamento de Control de Calidad FEMSA
- Comunidad Open Source por las herramientas utilizadas

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**

