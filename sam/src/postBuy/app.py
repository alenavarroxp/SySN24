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
        body = event.get('body')
        if not body:
            return {
                'statusCode': 400,
                'body': json.dumps({'status': False, 'message': 'Request body is missing'})
            }

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'status': False, 'message': 'Invalid JSON in request body'})
                }
        
        items = body.get('items')

        if not items or not isinstance(items, list):
            return {
                'statusCode': 400,
                'body': json.dumps({'status': False, 'message': 'No valid items provided in the request'})
            }

        for item_id in items:
            try:
                table.update_item(
                    Key={'id': str(item_id)},
                    UpdateExpression="set stock = stock - :decrement",
                    ConditionExpression="stock > :zero",
                    ExpressionAttributeValues={
                        ":decrement": 1,
                        ":zero": 0
                    },
                    ReturnValues="NONE"
                )
            except ClientError as e:
                if e.response['Error']['Code'] == "ConditionalCheckFailedException":
                    pass
                else:
                    pass

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'status': True})
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'status': False, 'message': 'Error processing request', 'error': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'status': False, 'message': 'Internal server error', 'error': str(e)})
        }
