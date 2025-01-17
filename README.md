# Proyecto de Servicios y Sistemas en la Nube

Este proyecto es parte del programa del Máster Universitario en Ingeniería Informática y está diseñado para implementar una aplicación basada en servicios y sistemas en la nube utilizando tecnologías de AWS. Los servicios utilizados incluyen AWS SAM, Amplify, Lambda, S3, DynamoDB, SNS, API Gateway, entre otros. Además, incluye una aplicación web que permite a los usuarios interactuar con el sistema.

## Tecnologías utilizadas

- **AWS SAM**: Para la creación y despliegue de recursos serverless.
- **Amplify**: Para gestionar la infraestructura frontend.
- **AWS Lambda**: Para ejecutar funciones sin servidor.
- **Amazon S3**: Para almacenamiento de objetos.
- **Amazon DynamoDB**: Como base de datos NoSQL.
- **Amazon SNS**: Para la gestión de notificaciones.
- **API Gateway**: Para gestionar las API REST.
- **Aplicación Web**: Permite a los usuarios interactuar con el sistema.

## Requisitos previos

Antes de comenzar, asegúrate de tener lo siguiente:

1. **Node.js** y **npm** o **Bun** instalados en tu sistema.
2. **AWS CLI** configurado en tu entorno local.
3. Permisos necesarios para crear recursos en AWS (ARN del `LabRole`).
4. Un token de acceso de GitHub (consulta la documentación del proyecto para más detalles).

## Configuración inicial

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/alenavarroxp/SySN24.git
   cd SySN24
   ```

## Construcción y despliegue

### Construir la aplicación

Para construir la aplicación, ejecuta el siguiente comando:

```bash
npm run sam
# o si utilizas Bun
bun sam
```

### Desplegar la aplicación

1. Proporciona los siguientes valores durante el despliegue interactivo:

   - **Stack Name**: `sam-app`
   - **ARN del LabRole**: Introduce el ARN de LabRole en AWS AIM.
   - **Email para SNS**: Introduce el correo electrónico donde deseas recibir notificaciones.
   - **Token de GitHub**: Consulta la documentación del proyecto para obtener este token.

2. Confirma el despliegue y espera a que finalice el proceso.

## Uso de la aplicación

Una vez desplegada la aplicación, puedes acceder a ella mediante la URL proporcionada por el API Gateway. Asegúrate de verificar el correo electrónico configurado para SNS y confirmar la suscripción.

## Documentación adicional

Consulta la documentación completa dentro del repositorio en `docs/` para obtener más detalles.

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).

