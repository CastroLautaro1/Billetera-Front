# 🍊 Oran - Billetera Virtual (Frontend)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Frontend de **Oran**, una aplicación web de billetera virtual diseñada para ofrecer una experiencia de usuario fluida, rápida y moderna. Este proyecto consume una API RESTful construida en Spring Boot.

## 🎯 Características Principales

* **Autenticación Segura:** Flujos de Login y Registro optimizados con validaciones reactivas en tiempo real.
* **Dashboard Principal:** Una página de inicio que muestra todo lo necesario como el balance, acciones principales y transferencias recientes.
* **Lista de Contactos:** Selección de contactos recientes y búsqueda de nuevos contactos mediante Alias o CVU.
* **Selección de Monto:** Componente con identidad visual que permite introducir el monto y un detalle para poder transferir.
* **Comprobantes Detallados:** Generación y visualización de recibos de transferencias con un diseño limpio e indicadores de usuario.
* **Historial de Transacciones Dinámico:** Panel con paginación del lado del servidor (Server-side pagination) para manejar grandes volúmenes de datos sin perder rendimiento.
* **Filtros Avanzados:** Búsqueda en tiempo real (con *debounce*) por nombre, rango de fechas, montos y tipos de transacción.
* **Modo Oscuro/Claro Nativo:** Interfaz adaptable con variables CSS puras para una transición de temas perfecta y sin parpadeos.

## 🛠️ Tecnologías Utilizadas

* **Framework:** Angular
* **Lenguaje:** TypeScript
* **Estilos:** CSS3 (Variables globales, Flexbox, Grid, Animaciones y Keyframes)
* **Manejo de Estado y Asincronía:** RxJS (Observables, Signals)
* **Formularios:** Reactive Forms

## 📸 Capturas de Pantalla
![Image](https://github.com/user-attachments/assets/057cea9f-79c2-456e-90c5-3544a84ab1f2)
![Image](https://github.com/user-attachments/assets/447f9608-4752-457a-94f3-2ee20b5c3d4a)
![Image](https://github.com/user-attachments/assets/dedac122-4154-43f5-9aa7-a7b3761e2249)
![Image](https://github.com/user-attachments/assets/ab88bd82-7a87-4cc0-a907-4cd570e162a0)


## ⚙️ Instalación y Configuración Local

Para correr este proyecto en tu entorno local, vas a necesitar tener instalado [Node.js](https://nodejs.org/) y Angular CLI.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/CastroLautaro1/Billetera-Front.git
   ```

2. **Navegar al directorio del proyecto:**

    ```bash
    cd Billetera-Front
    ```

3. **Instalar las dependencias:**

    ```bash
    npm install
    ```

4. **Ejecutar el servidor de desarrollo:**

    ```bash
    ng serve
    ```

## 📂 Estructura del Proyecto
El proyecto sigue una arquitectura modular y escalable típica de Angular:

* **/core:** Servicios singleton (HTTP, Autenticación, Guards).

* **/shared:** Componentes reutilizables, modelos e interfaces.

* **/features:** Módulos principales de la aplicación (Auth, Home, History, Transaction).

## 👨‍💻 Autor
**Lautaro Castro** - Full Stack Developer - [LinkedIn](https://www.linkedin.com/in/lautaro-castro-dev/) 

