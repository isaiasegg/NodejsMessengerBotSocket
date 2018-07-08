# NodejsMessengerBotSocket
Repositorio "ready to use" para conectarse al API de Facebook Messenger utilizando Node Js y Express. Además cuenta con un cliente creado en Angular Js y Angular Material donde despues de una pantalla de login simple, se muestra toda la conversación que se está llevando desde messenger con el bot, este "streaming" se hace con Socket.io

Requerimientos:
- Node Js

Instrucciones:

- npm install
- Agregar archivo .env en el root del repo con las variables:
  - PAGE_ACCESS_TOKEN={el token de tu página de facebook }
  - EMAIL={usuario para login}
  - PASSWORD={clave para login}
  - WEBHOOK_PASS={la clave para autenticar tu webhook}
- npm start

Notas: 
- En un ambiente de prueba puedes descargar NGROK y ejecutarlo despues de levantar el sevidor, una vez abierto coloca el comando (en Windows): 'ngrok.exe http 3000' (3000 es el un numero de puerto donde se inicia el servidor en este repo). Luego te apareceran varios urls, toma el que lleva httpS y pegalo en el campo de url en el registro de webhook dentro de 'developers.facebook.com', y a este sumale '/webhook'. El url final queda parecido a: 'https://xxxxxxx.ngrok.io/webhook' y luego en la contraseña va la que agregaste en el archivo .env 
- Para los pasos previos a todo esto (crear un fan page, crear un app en la consola de facebook developer, agregar a este app el fan page para obtener el token, etc), puedes ver la documentación en: https://developers.facebook.com/docs/messenger-platform/?locale=es_LA

Espero les sirva! ✌️✌️
