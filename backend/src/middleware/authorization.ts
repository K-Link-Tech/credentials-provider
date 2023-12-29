import { getErrorMessage, getErrorName } from '../utils/errorHandler';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { verifyJWT } from '../utils/JWT-helpers';
import logging from '../config/logging.config';
import { DecodedJWTObj, extractJWTReq } from '../modules/interfaces/authRequest.interface';

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
    const accessDecoded = await verifyJWT(accessToken, 'accessPublicKey');
    return {
      statusCode: 200,
      data: accessDecoded,
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = !code ? 401 : code;
    logging.error(NAMESPACE, "error code: ", errorCode);
    const errorMsg = getErrorMessage(error) ? getErrorMessage(error) : "Token validation error!";
    return {
      statusCode: errorCode,
      error: new Error(errorMsg),
    }
  }
};

export default authenticateToken;
