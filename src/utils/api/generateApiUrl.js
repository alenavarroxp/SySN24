import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

try {
    const stackName = 'sam-app';

    // Obtener la URL de la API Gateway
    console.log('Obteniendo la URL de la API Gateway...');
    const apiUrl = execSync(
        `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayApiUrl'].OutputValue" --output text`
    ).toString().trim();

    if (!apiUrl) {
        throw new Error('No se pudo obtener la URL de la API Gateway. Revisa el nombre del stack y los Outputs.');
    }

    console.log(`API Gateway URL obtenida: ${apiUrl}`);

    // Cargar las variables de entorno existentes (si las hay)
    dotenv.config();

    // Definir el archivo .env
    const envFilePath = './.env';

    // Leer el contenido actual del archivo .env
    let envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

    // Si ya existe VITE_API_GATEWAY_URL, la reemplazamos. Si no, la agregamos.
    const apiUrlRegex = /^VITE_API_GATEWAY_URL=.*/m;
    if (apiUrlRegex.test(envContent)) {
        // Reemplazar la línea existente
        envContent = envContent.replace(apiUrlRegex, `VITE_API_GATEWAY_URL=${apiUrl}`);
    } else {
        // Agregar al final si no existe
        envContent += `VITE_API_GATEWAY_URL=${apiUrl}\n`;
    }

    // Escribir el contenido actualizado en el archivo .env
    fs.writeFileSync(envFilePath, envContent);
    console.log(`API Gateway URL escrita en ${envFilePath}`);

} catch (error) {
    console.error('Error al obtener o guardar la URL de la API Gateway:', error.message);
}
