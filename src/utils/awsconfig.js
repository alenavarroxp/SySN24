import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Crear la interfaz de lectura para obtener datos del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ruta del archivo de credenciales de AWS
const credentialsPath = path.join(process.env.HOME || process.env.USERPROFILE, '.aws', 'credentials');

// Función para solicitar el session token al usuario
function askQuestion(query, defaultValue = '') {
  return new Promise((resolve) => rl.question(query, (answer) => resolve(answer || defaultValue)));
}

// Función para agregar o actualizar el session token
async function addSessionToken() {
  // Leer las credenciales actuales
  const credentials = fs.readFileSync(credentialsPath, 'utf8');

  // Verificar si ya existe una sección `[default]` en el archivo
  if (credentials.includes('[default]')) {
    // Buscar el valor actual del session token
    const currentSessionTokenMatch = credentials.match(/aws_session_token\s*=\s*(.*)/);
    const currentSessionToken = currentSessionTokenMatch ? currentSessionTokenMatch[1] : '';

    // Solicitar el nuevo session token al usuario
    const awsSessionToken = await askQuestion('AWS Session Token [********************]: ', currentSessionToken);

    // Si el token está vacío y el valor actual también lo está, no hacer nada
    if (awsSessionToken === '' && currentSessionToken === '') {
      console.log('No se ingresó ningún token, manteniendo el valor actual.');
      rl.close();
      return;
    }

    // Reemplazar o agregar el session token en el archivo de credenciales
    let updatedCredentials = credentials;
    if (updatedCredentials.includes('aws_session_token')) {
      updatedCredentials = updatedCredentials.replace(/(aws_session_token\s*=\s*)(.*)/, `$1${awsSessionToken}`);
    } else {
      updatedCredentials = updatedCredentials.replace(/\[default\]/, `[default]\naws_session_token = ${awsSessionToken}`);
    }

    // Escribir el nuevo contenido en el archivo
    fs.writeFileSync(credentialsPath, updatedCredentials, { encoding: 'utf8' });
    console.log('Session token agregado correctamente.');
  } else {
    console.log('No se encontró la sección [default] en el archivo de credenciales.');
  }

  rl.close();
}

// Llamar a la función para agregar el session token
addSessionToken().catch((err) => {
  console.error('Error al agregar el session token:', err);
  rl.close();
});
