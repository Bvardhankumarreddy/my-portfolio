import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PortfolioVisitorCounter')

def lambda_handler(event, context):
    """
    AWS Lambda function to track portfolio visitor count
    Works with both API Gateway and Lambda Function URLs
    """
    
    # Get the origin from the request (handle both formats)
    headers_dict = event.get('headers', {})
    request_origin = headers_dict.get('origin') or headers_dict.get('Origin', '*')
    
    # Allow both localhost (for testing) and production site
    allowed_origins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://www.portfolio.vardhandevops.xyz',
        'https://portfolio.vardhandevops.xyz'
    ]
    
    # Check if request origin is allowed
    if request_origin in allowed_origins:
        cors_origin = request_origin
    else:
        cors_origin = '*'  # Fallback for testing
    
    # Enable CORS headers
    headers = {
        'Access-Control-Allow-Origin': cors_origin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
    }
    
    # Handle OPTIONS request (CORS preflight)
    # Check both httpMethod (API Gateway) and requestContext.http.method (Function URL)
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('OK')
        }
    
    try:
        # Get the counter ID (use a fixed ID for single counter)
        counter_id = 'portfolio_visits'
        
        # Update counter atomically (increment by 1)
        response = table.update_item(
            Key={'id': counter_id},
            UpdateExpression='SET visit_count = if_not_exists(visit_count, :start) + :inc',
            ExpressionAttributeValues={
                ':inc': 1,
                ':start': 0
            },
            ReturnValues='UPDATED_NEW'
        )
        
        # Get the updated count
        visit_count = int(response['Attributes']['visit_count'])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'visitCount': visit_count,
                'message': 'Visit recorded successfully'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'message': 'Failed to update visit count'
            })
        }
