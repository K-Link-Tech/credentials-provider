import { getErrorMessage } from '../utils/errorHandler';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { verifyJWT } from '../utils/JWT-helpers';
import logging from '../config/logging.config';
import { extractJWTReq } from '../modules/interfaces/authRequest.interface';

dotenv.config({ path: resolve(__dirname, '../../../../.env') });

const NAMESPACE = 'Authorization';

type event = {
  source: string;
  payload: object;
};

type eventHandler = (event: event) => Object;

/**
 * This function verifies if the access token stored in the header is valid or not.
 * 
 * @param event An event variable received from the express router containing the access token.
 * @returns An object containing the statusCode and either the decoded jwt payload or an error. 
 */
const authenticateToken: eventHandler = async (event) => {
  const { accessToken } = event.payload as extractJWTReq;
  if (accessToken == undefined) {
    logging.error(NAMESPACE, 'Authorization header is empty.');
    return {
      statusCode: 401,
      error: new Error('Null token received.'),
    };
  }

  try {
    const accessDecoded = verifyJWT(accessToken, 'accessPublicKey');
    logging.debug(NAMESPACE, 'JWT verified!', accessDecoded);
    return {
      statusCode: 200,
      data: accessDecoded,
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    return {
      statusCode: 401,
      error: new Error('Token validation error!'),
    };
  }
};

export default authenticateToken;
