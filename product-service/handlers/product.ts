import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from '../products.json'

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters;
    if (!id) {
      return {
        statusCode: 404,
        body:  JSON.stringify({ message: 'Wrong parameters' }),
      }
    }

    const product = await new Promise(resolve => resolve(products.find(p => p.id === id)));
    if (!product) {
      return {
        statusCode: 404,
        body:  JSON.stringify({ message: `Product with id ${id} does not exist` }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
