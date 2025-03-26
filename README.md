![GitHub repo size](https://img.shields.io/github/repo-size/KevinJG994/kevflix-backend-server)
![GitHub last commit](https://img.shields.io/github/last-commit/KevinJG994/kevflix-backend-server)

# <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="30" height="30" alt="Express" title="Express" /> Express | Kevflix BackEnd

Servidor backend de KevFlix desarrollado en Node.js con Express, diseñado para gestionar la autenticación y almacenamiento de archivos en Cloudinary. Utiliza MongoDB como base de datos y soporta middleware para seguridad y logs.

## 🛠️ Stack Tecnológico

Tecnologías utilizadas en este proyecto:


<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50" height="50" alt="Node.js" title="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="50" height="50" alt="MongoDB" title="MongoDB" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="50" height="50" alt="Express" title="Express" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="50" height="50" alt="Multer" title="Multer" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" width="50" height="50" alt="Mongoose" title="Mongoose" />
</p>


## :closed_lock_with_key: Instalación

- Clonar el repositorio:

   ```
   git clone https://github.com/KevinJG994/kevflix-backend-server.git
   
   cd kevflix-backend-server
  ```

- Instalar dependencias:
   ```
  npm install
  ```

- Iniciar el servidor:
  ```
   npm run start
   ```

## 📦 Dependencias principales
<div align="center">

| Paquete               | Descripción                                        |
|-----------------------|----------------------------------------------------|
| express               | Framework para la creación del servidor            |
| mongoose              | ODM para MongoDB                                   |
| jsonwebtoken          | Manejo de autenticación con JWT                    |
| bcrypt                | Encriptación de contraseñas                        |
| multer y cloudinary   | Almacenamiento de archivos en la nube              |
| cloudinary            | API para integración con el servicio Cloudinary    |
| cors y cookie-parser  | Middleware para seguridad y manejo de cookies     |

</div>

</br>

## 🤖 Inteligencia Artificial con Gemini

Este proyecto utiliza la API de Gemini a través de la biblioteca ``@google/generative-ai`` para potenciar las funcionalidades de chatbot y recomendaciones personalizadas según los favoritos del usuario.

### Uso de Gemini en el Proyecto

- __Chatbot Inteligente__: Se integra un chatbot basado en IA que puede responder preguntas, asistir en la navegación y proporcionar recomendaciones.

- __Recomendaciones Personalizadas__: Utilizando los datos de favoritos del usuario, la IA genera sugerencias de contenido que puedan interesarle.

- __Limitación de Peticiones__: Se usa el middleware ``express-rate-limit`` para restringir el número de solicitudes y evitar abusos del servicio.

### Instalación y Configuración

Para asegurarte de que la integración funcione correctamente, instala las dependencias necesarias:
  ```
   npm install @google/generative-ai

   npm install express-rate-limit
   ```

  ## 🚀 Demo

🔗 Servidor desplegado: https://kevflix-backend-server.onrender.com

<br>

📌 Repositorio del FrontEnd: https://github.com/KevinJG994/kevflix-netflix-clone
