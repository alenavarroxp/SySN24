import json
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError
from fpdf import FPDF
import tempfile
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
products_table = dynamodb.Table('Products')
orders_table = dynamodb.Table('Orders')
s3 = boto3.client('s3')

def generate_pdf(purchase_details, purchase_date):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Purchase Details", ln=True, align='C')
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Purchase Date: {purchase_date}", ln=True, align='L')
    pdf.ln(10)
    pdf.cell(40, 10, txt="Product", border=1)
    pdf.cell(40, 10, txt="Price (Unit)", border=1)
    pdf.cell(40, 10, txt="Quantity", border=1)
    pdf.cell(40, 10, txt="Total (Line)", border=1)
    pdf.ln()

    total = 0
    for item in purchase_details:
        pdf.cell(40, 10, txt=item['name'], border=1)
        pdf.cell(40, 10, txt=str(item['price']), border=1)
        pdf.cell(40, 10, txt=str(item['quantity']), border=1)
        line_total = float(item['price']) * item['quantity']
        pdf.cell(40, 10, txt=str(line_total), border=1)
        pdf.ln()
        total += line_total

    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Total Purchase: {total}", ln=True, align='R')

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        pdf.output(temp_file.name)
        return temp_file.name
    finally:
        temp_file.close()

def upload_pdf_to_s3(pdf_path, bucket_name, file_name):
    try:
        s3.upload_file(pdf_path, bucket_name, file_name, ExtraArgs={"ContentType": "application/pdf"})
        return True
    except Exception:
        return False
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

def lambda_handler(event, context):
    try:
        body = event.get('body')
        if not body:
            return {'statusCode': 400, 'body': json.dumps({'status': False, 'message': 'Request body is missing'})}

        if isinstance(body, str):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                return {'statusCode': 400, 'body': json.dumps({'status': False, 'message': 'Invalid JSON in request body'})}

        items = body.get('items')
        if not items or not isinstance(items, list):
            return {'statusCode': 400, 'body': json.dumps({'status': False, 'message': 'No valid items provided in the request'})}

        purchase_details = []
        total_price = Decimal(0)
        product_ids = [str(item_id) for item_id in items]

        for item_id in items:
            try:
                response = products_table.get_item(Key={'id': str(item_id)})
                item = response.get('Item')
                if item:
                    product_details = {
                        'name': item['name'],
                        'price': item['price'],
                        'quantity': 1
                    }
                    purchase_details.append(product_details)
                    total_price += item['price']
                products_table.update_item(
                    Key={'id': str(item_id)},
                    UpdateExpression="set stock = stock - :decrement",
                    ConditionExpression="stock > :zero",
                    ExpressionAttributeValues={":decrement": Decimal(1), ":zero": Decimal(0)}
                )
            except ClientError as e:
                if e.response['Error']['Code'] != "ConditionalCheckFailedException":
                    raise e

        purchase_date = datetime.utcnow().isoformat()
        pdf_path = generate_pdf(purchase_details, purchase_date)
        bucket_name = "sy24-pdf-storage"
        file_name = f"purchase_{context.aws_request_id}.pdf"
        upload_success = upload_pdf_to_s3(pdf_path, bucket_name, file_name)

        if not upload_success:
            return {'statusCode': 500, 'body': json.dumps({'status': False, 'message': 'Failed to upload PDF'})}

        orders_table.put_item(
            Item={
                'id': context.aws_request_id,
                'product_ids': product_ids,
                'total_price': total_price,
                'date': purchase_date
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'status': True, 'pdf_url': f"https://{bucket_name}.s3.amazonaws.com/{file_name}", 'order_id': context.aws_request_id})
        }

    except ClientError as e:
        return {'statusCode': 500, 'body': json.dumps({'status': False, 'message': 'Error processing request', 'error': str(e)})}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'status': False, 'message': 'Internal server error', 'error': str(e)})}
