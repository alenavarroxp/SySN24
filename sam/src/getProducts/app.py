import json
from decimal import Decimal

import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Products')  

def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError("Object is not of type Decimal")

def lambda_handler(event, context):
    try:
        response = table.scan()

        print("DynamoDB response:", response)

        products = response['Items']

        products = [product for product in products if product.get('stock', 0) > 0]

        products = [{k: decimal_to_float(v) if isinstance(v, Decimal) else v for k, v in product.items()} for product in products]

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'products': products})
        }

    except ClientError as e:
        print(f"Error fetching products: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error fetching products', 'error': str(e)})
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
