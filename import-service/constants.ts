export const BUCKET = 'bucket-for-files';

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export enum statusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export const defaultImage = 'https://fondoescritorio.com.es/file/631/600x338/16:9/fondo-de-escritorio-de-un-salto-de-snow_2022337173.jpg';