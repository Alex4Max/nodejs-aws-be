import { CustomAuthorizerEvent } from 'aws-lambda';
import 'source-map-support/register';
// import { headers, statusCodes } from '../constants';

export const basicAuthorizer = async (event: CustomAuthorizerEvent, _context, callback) => {
  console.log(event);
  try {
    if (event?.['type'] !== 'TOKEN') {
      console.log('There is no token in event!');
      callback(`Unauthorized. ${JSON.stringify(event)}`);
    }

    const authCreds = event.authorizationToken?.split(' ')[1];
    const [name, password] = Buffer.from(authCreds, 'base64').toString('utf-8').split(':');

    console.log(`Credentials: user ${name}, password ${password}`);

    const storedPassword = process.env[name];
    const isAllowed = storedPassword && storedPassword === password;

    const policy = generatePolicy(authCreds, event.methodArn, isAllowed);

    callback(null, policy);
  } catch (e) {
    callback(`Unauthorized. ${JSON.stringify(e)}`);
  }
};

const generatePolicy = (principalId, arn, isAllowed) => ({
  principalId,
  policyDocument: {
  Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: isAllowed ? 'Allow' : 'Deny',
      Resource: arn,
    }
  ]},
});