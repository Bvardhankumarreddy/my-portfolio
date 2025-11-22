# AWS Visitor Counter Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Architecture Overview                         │
└─────────────────────────────────────────────────────────────────┘

    User Browser                 AWS Cloud (Always Free Tier)
         │                              
         │                              
    ┌────▼─────┐                  
    │  S3      │                  
    │ Portfolio│                  
    │ Website  │                  
    └────┬─────┘                  
         │                              
         │ HTTPS Request                
         │ (Increment Visit)            
         │                              
    ┌────▼──────────────────────────────────────────────────┐
    │           API Gateway (HTTP API)                      │
    │   URL: https://abc123.execute-api.us-east-1...       │
    │   • CORS enabled                                      │
    │   • Always Free: 1M calls/month (12 months)          │
    └────┬──────────────────────────────────────────────────┘
         │                              
         │ Triggers                      
         │                              
    ┌────▼──────────────────────────────────────────────────┐
    │              Lambda Function                          │
    │   Name: PortfolioVisitorCounter                       │
    │   Runtime: Python 3.12                                │
    │   • Increment counter atomically                      │
    │   • Return updated count                              │
    │   • Always Free: 1M requests/month FOREVER           │
    └────┬──────────────────────────────────────────────────┘
         │                              
         │ Read/Write                   
         │                              
    ┌────▼──────────────────────────────────────────────────┐
    │              DynamoDB Table                           │
    │   Name: PortfolioVisitorCounter                       │
    │   Key: id (String)                                    │
    │   Data: {                                             │
    │     "id": "portfolio_visits",                         │
    │     "visit_count": 1234                               │
    │   }                                                   │
    │   • Always Free: 25GB + 200M requests FOREVER        │
    └───────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        Data Flow                                 │
└─────────────────────────────────────────────────────────────────┘

1. User visits portfolio → React component loads
   
2. Component calls API Gateway endpoint (POST request)
   
3. API Gateway triggers Lambda function
   
4. Lambda executes:
   - Reads current count from DynamoDB
   - Increments count by 1 (atomic operation)
   - Writes new count to DynamoDB
   - Returns updated count to user
   
5. React component displays count in "Visits to Site" card
   
6. sessionStorage prevents double-counting in same session


┌─────────────────────────────────────────────────────────────────┐
│                    Security Features                             │
└─────────────────────────────────────────────────────────────────┘

✅ CORS: Only your S3 domain can call the API
✅ IAM Role: Lambda has minimum required permissions
✅ Session Storage: Prevents refresh spam
✅ Atomic Updates: DynamoDB ensures accurate counting
✅ HTTPS Only: All communication encrypted


┌─────────────────────────────────────────────────────────────────┐
│                    Cost Breakdown                                │
└─────────────────────────────────────────────────────────────────┘

Monthly Traffic: 10,000 visitors

Service          Free Tier              Your Usage    Cost
─────────────────────────────────────────────────────────────
Lambda           1M requests/month      10K requests  $0.00
DynamoDB         25GB + 200M requests   <1MB + 10K    $0.00
API Gateway      1M calls/month*        10K calls     $0.00**

Total Monthly Cost: $0.00

* API Gateway free for 12 months, then $3.50 per 1M requests
** After 12 months: ~$0.035/month for 10K visitors


┌─────────────────────────────────────────────────────────────────┐
│                    Scalability                                   │
└─────────────────────────────────────────────────────────────────┘

Current Setup (Free):    10,000 visits/month    → $0.00
Scale to:                100,000 visits/month   → $0.35
Scale to:                1,000,000 visits/month → $3.50

Lambda automatically scales to handle traffic spikes!
