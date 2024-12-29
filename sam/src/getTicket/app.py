import boto3
import os

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = os.environ['BUCKET_NAME']
    try:
        ticket_id = event['pathParameters']['proxy']
        file_key = f"purchase_{ticket_id}.pdf"
        
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_key},
            ExpiresIn=3600
        )
        
        return {
            "statusCode": 302,
            "headers": {
                "Location": url
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }
