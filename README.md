# ❄️ AYCE HVAC - Sistema Profesional de Cotización

> **MVP - Sistema completo de gestión comercial para distribuidores de aire acondicionado**

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://tu-usuario.github.io/MVP_AirCondition/)
[![GitHub Pages](https://img.shields.io/badge/hosted-github%20pages-blue)](https://tu-usuario.github.io/MVP_AirCondition/)
[![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![License](https://img.shields.io/badge/license-MIT-red)](LICENSE)

---

## 🚀 Demo en Vivo

🔗 **[https://tu-usuario.github.io/MVP_AirCondition/](https://tu-usuario.github.io/MVP_AirCondition/)**

> **Credenciales de Prueba:**
> - Usuario: `Alexis`
> - Contraseña: `12345`

---

## 📋 Descripción del Proyecto

**AYCE HVAC** es un sistema profesional de cotización y gestión comercial diseñado específicamente para distribuidores de sistemas de aire acondicionado.

### Problema que Resuelve
Un distribuidor autorizado de marcas como TRANE, HISENSE y YORK necesitaba:

- ❌ Cotizar equipos de forma rápida y profesional
- ❌ Gestionar el pipeline de ventas con seguimientos estructurados
- ❌ Analizar el rendimiento con métricas claras
- ❌ Generar documentos profesionales (PDFs) para clientes
- ❌ Unificar en un mismo sitio la información y ciclo de vida de ventas
- ❌ Cotizar desde cualquier dispositivo para los vendedores que estén en campo


### Mi Solución
Este **MVP (Producto Mínimo Viable) completamente funcional** ya está siendo utilizado por el equipo de ventas en México.

---

## ✨ Características Principales

### 💰 Sistema de Cotización
- ✅ Catálogo de 6 marcas (TRANE, HISENSE, YORK, CARRIER, DUVENTUS, TCL)
- ✅ Conversión USD ↔ MXN en tiempo real
- ✅ Precios dinámicos con factores ajustables
- ✅ Cálculo automático de IVA (16%)
- ✅ Generación de PDF profesional

### 📊 CRM Integrado
- ✅ Historial de cotizaciones con ID único
- ✅ Pipeline de 7 etapas (10% → 100%)
- ✅ Gestión de leads (Frío/Caliente/Calificado)
- ✅ Recordatorios automáticos
- ✅ Exportación a Excel (CSV)

### 📈 Dashboards y Analytics
- ✅ Tasa de cierre con semáforo 🟢🟡🔴
- ✅ Métricas del día (cotizaciones, montos, seguimientos)
- ✅ Gráfico de evolución (7/15/30 días)
- ✅ Barras de progreso del pipeline

### 🔧 Funcionalidades Técnicas
- ✅ Calculadora de carga térmica (16m² = 1TR)
- ✅ Modo TRANE Exclusivo
- ✅ Respaldo automático cada 30 minutos
- ✅ Cross-platform (Desktop, iPhone, Android)

---

## 🏗️ Arquitectura

### Diagrama de Componentes
![Arquitectura General](Images/architecture.png)

### Diagrama de Flujo
![Flujo de Datos](Images/flow.png)

### Modelo de Datos (ERD)
![Modelo de Datos](Images/erd.png)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Interfaz de usuario |
| **Gráficos** | Chart.js | Dashboards |
| **Iconos** | Font Awesome 6 | UI/UX |
| **Backend** | Google Apps Script | API serverless |
| **Base de Datos** | Google Sheets | Almacenamiento en la nube |
| **Persistencia** | localStorage + Auto-Backup | Datos offline |
| **Hosting** | GitHub Pages | Despliegue continuo |

---

## 📂 Estructura del Proyecto
MVP_AirCondition/
├── 📄 index.html # Aplicación SPA completa
├── 📁 Images/ # Diagramas UML
│ ├── architecture.png
│ ├── flow.png
│ └── erd.png
├── 📁 Backend/
│ └── 📁 GoogleAppsScript/
│ └── 📄 Code.gs # Backend en Apps Script
├── 📄 README.md
├── 📄 LICENSE
└── 📄 .gitignore



---

## 🚀 Instalación y Despliegue

### Prerrequisitos
- Cuenta de Google (para Google Sheets y Apps Script)
- GitHub account
- Navegador web moderno

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/MVP_AirCondition.git
cd MVP_AirCondition