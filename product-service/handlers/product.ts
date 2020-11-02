import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from '../products.json'
import { headers, statusCodes } from '../constants';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters;
    if (!id) {
      return {
        headers,
        statusCode: statusCodes.NOT_FOUND,
        body:  JSON.stringify({ message: 'Wrong parameters' }),
      }
    }

    // TODO remove this await and Promise after cross-check
    const product = await new Promise(resolve => resolve(products.find(p => p.id === id)));
    if (!product) {
      return {
        headers,
        statusCode: statusCodes.NOT_FOUND,
        body:  JSON.stringify({ message: `Product with id ${id} does not exist` }),
      }
    }

    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    };
  }
};
