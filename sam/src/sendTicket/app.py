import boto3
import base64
import os
from botocore.exceptions import ClientError

s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            object_key = record['s3']['object']['key']
            
            pdf_object = s3_client.get_object(Bucket=bucket_name, Key=object_key)
            pdf_content = pdf_object['Body'].read()
            pdf_encoded = base64.b64encode(pdf_content).decode('utf-8')
            
            publish_to_sns(object_key, pdf_encoded)
        
        return {
            'statusCode': 200,
            'body': 'PDF enviado correctamente al tema SNS'
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

def publish_to_sns(object_key, pdf_encoded):
    subject = "Nueva compra"
    message = f"Nueva compra en el sistema. Ticket adjunto.{object_key}"

    sns_client.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject=subject,
        Message=message,
        MessageAttributes={
            'pdfAttachment': {
                'DataType': 'Binary',
                'BinaryValue': base64.b64decode(pdf_encoded)
            }
        }
    )
