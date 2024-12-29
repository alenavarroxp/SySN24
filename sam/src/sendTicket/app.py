import boto3
import os
from botocore.exceptions import ClientError

s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
SIGNATURE_EXPIRATION = 3600  # 1 hora

def lambda_handler(event, context):
    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            object_key = record['s3']['object']['key']
            
            signed_url = generate_signed_url(bucket_name, object_key)
            publish_to_sns(object_key, signed_url)
        
        return {
            'statusCode': 200,
            'body': 'Enlace firmado enviado correctamente al tema SNS'
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': f'Error al procesar el archivo: {str(e)}'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error interno del servidor: {str(e)}'
        }

def generate_signed_url(bucket_name, object_key):
    try:
        signed_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=SIGNATURE_EXPIRATION
        )
        return signed_url
    except ClientError as e:
        raise Exception(f'Error generando la URL firmada: {str(e)}')

def publish_to_sns(object_key, signed_url):
    subject = "Nueva compra"
    message = f"Nueva compra en el sistema. Puede acceder al ticket en el siguiente enlace:\n\n{signed_url}"

    sns_client.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject=subject,
        Message=message
    )
