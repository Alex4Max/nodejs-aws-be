import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import * as products from '../products.json'
import { headers, statusCodes } from '../constants';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    };
  }
};
