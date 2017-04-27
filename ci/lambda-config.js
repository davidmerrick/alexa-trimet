module.exports = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    handler: 'index.handler',
    functionName: process.env.LAMBDA_NAME,
    timeout: 10,
    memorySize: 128,
    publish: true, // default: false,
    runtime: 'nodejs4.3'
}