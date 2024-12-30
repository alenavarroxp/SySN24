import { execSync } from 'child_process';

try {
    const stackName = 'sam-app';

    console.log('Obteniendo el App ID de Amplify...');
    const appId = execSync(
        `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue" --output text`
    ).toString().trim();

    if (!appId) {
        throw new Error('No se pudo obtener el App ID de Amplify. Revisa el nombre del stack y los Outputs.');
    }

    console.log(`App ID de Amplify obtenido: ${appId}`);

    const branchName = 'main';
    const jobType = 'RELEASE';

    console.log('Iniciando la implementación en Amplify...');
    execSync(
        `aws amplify start-job --app-id ${appId} --branch-name ${branchName} --job-type ${jobType}`
    ).toString();

    console.log('Implementación iniciada con éxito en Amplify.');
    
    const amplifyUrl = `https://${branchName}.${appId}.amplifyapp.com`;
    console.log(`La implementación está en proceso. Puede tardar unos minutos.`);
    console.log(`Accede a tu aplicación en: ${amplifyUrl}`);
    
} catch (error) {
    console.error('Error al obtener el App ID o iniciar la implementación:', error.message);
}
