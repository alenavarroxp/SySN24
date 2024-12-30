import json
import os

import boto3

sns_client = boto3.client('sns')

SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'MODIFY':
            new_stock = int(record['dynamodb']['NewImage']['stock']['N'])
            product_name = record['dynamodb']['NewImage']['name']['S']
            
            if new_stock <= 10:
                message = (
                    f"⚠️ ALERTA DE STOCK BAJO ⚠️\n\n"
                    f"📦 Producto: {product_name}\n"
                    f"🔴 Stock actual: {new_stock} unidades\n\n"
                    f"🛑 ¡Es necesario reponer el stock de este producto lo antes posible! 🛑\n\n"
                    f"Este es un recordatorio automático para evitar desabastecimientos."
                )

                sns_client.publish(
                    TopicArn=SNS_TOPIC_ARN,
                    Message=message,
                    Subject="Alerta de Stock Bajo - ¡Reponer Stock!"
                )
                print(f"Mensaje enviado: {message}")
    return {
        'statusCode': 200,
        'body': json.dumps('Procesamiento completado.')
    }
