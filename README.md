# poc-data-node-lambda-stack

To deploy:

`ENV=poc-data STAGE=prod REGION=us-west-2 sls deploy`


To test async invocation (e.g, for error handling alerting tests):

```
aws lambda invoke \
  --function-name PoCDataObjectReplicatorToS3RequesterPays  \
  --invocation-type Event \
  --cli-binary-format raw-in-base64-out \
  --payload '{ "key": "value" }' response.json \
  --profile poc-data-prod
```

https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html

