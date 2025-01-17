import { execSync } from 'child_process';

function getJobStatus(appId, branchName, jobId) {
    try {
        const jobStatus = execSync(
            `aws amplify get-job --app-id ${appId} --branch-name ${branchName} --job-id ${jobId} --query "job.summary.status" --output text`
        ).toString().trim();
        return jobStatus;
    } catch (error) {
        console.error('Error al obtener el estado del trabajo:', error.message);
        return null;
    }
}

async function waitForAmplifyJob(appId, branchName, jobId) {
    console.log('Esperando a que termine la implementación...');
    let status = 'PENDING';
    while (status === 'PENDING' || status === 'RUNNING') {
        console.log(`Estado actual: ${status}. Verificando nuevamente en 10 segundos...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        status = getJobStatus(appId, branchName, jobId);
    }

    if (status === 'SUCCEED') {
        console.log('La implementación se completó con éxito.');
    } else {
        console.error(`La implementación falló con estado: ${status}`);
    }
}

try {
    const stackName = 'sam-app';

    console.log('Obteniendo el App ID de Amplify...');
    const appId = execSync(
        `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue" --output text`
    ).toString().trim();

    console.log(`App ID de Amplify obtenido: ${appId}`);

    const branchName = 'main';
    const jobType = 'RELEASE';

    console.log('Iniciando la implementación en Amplify...');
    const startJobOutput = execSync(
        `aws amplify start-job --app-id ${appId} --branch-name ${branchName} --job-type ${jobType} --query "jobSummary.jobId" --output text`
    ).toString().trim();

    console.log(`ID del trabajo iniciado: ${startJobOutput}`);

    await waitForAmplifyJob(appId, branchName, startJobOutput);

    const amplifyUrl = `https://${branchName}.${appId}.amplifyapp.com`;
    console.log(`Accede a tu aplicación en: ${amplifyUrl}`);
} catch (error) {
    console.error('Error durante la implementación:', error.message);
}
