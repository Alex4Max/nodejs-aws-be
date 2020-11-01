import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from '../products.json'

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
