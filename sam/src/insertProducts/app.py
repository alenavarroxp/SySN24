import json
from decimal import Decimal

import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Products')

def lambda_handler(event, context):
    try:
        products = [
            {
                'id': '1',
                'name': 'Smartphone',
                'price': Decimal('799.99'),
                'stock': 50
            },
            {
                'id': '2',
                'name': 'Laptop',
                'price': Decimal('1299.99'),
                'stock': 30
            },
            {
                'id': '3',
                'name': 'Bluetooth Headphones',
                'price': Decimal('199.99'),
                'stock': 100
            },
            {
                'id': '4',
                'name': 'Smartwatch',
                'price': Decimal('249.99'),
                'stock': 75
            },
            {
                'id': '5',
                'name': 'Electric Scooter',
                'price': Decimal('599.99'),
                'stock': 25
            },
            {
                'id': '6',
                'name': '4K TV',
                'price': Decimal('899.99'),
                'stock': 1
            },
            {
                'id': '7',
                'name': 'Gaming Console',
                'price': Decimal('499.99'),
                'stock': 40
            },
            {
                'id': '8',
                'name': 'Air Purifier',
                'price': Decimal('149.99'),
                'stock': 60
            },
            {
                'id': '9',
                'name': 'Digital Camera',
                'price': Decimal('649.99'),
                'stock': 11
            },
            {
                'id': '10',
                'name': 'Electric Toothbrush',
                'price': Decimal('79.99'),
                'stock': 120
            }
        ]

        for product in products:
            table.put_item(Item=product)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'message': 'Products inserted successfully!'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error inserting products', 'error': str(e)})
        }
