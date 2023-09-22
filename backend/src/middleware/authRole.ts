import { roles } from "../modules/interfaces/user.interface";
import { ReqParams } from "../modules/interfaces/usersRequest.interface";
import { AuthorizationError } from "../utils/errorTypes";
import logging from '../config/logging.config';
import { getErrorMessage, getErrorName } from "../utils/errorHandler";


const NAMESPACE = 'AuthRole';

type event = {
  source: string;
  payload: object;
};

type eventHandler = (event: event) => Object;

type userRole = {  role: roles }

type userParamsIdUserIdRole = {
  role: roles;
  paramsId: string;
  userId: string;
}

const authAdmin: eventHandler = async (event) => {
  const { role } = event.payload as userRole;
  try {
    if (role === 'admin') {
      return {
        statusCode: 200,
        isAuthorized: true,
      }  
    } else {
      return {
        statusCode: 403,
        error: new AuthorizationError("User Not Authorized", "403")
      }
    }
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Role check failed!'),
    };
  }
};

const authUser: eventHandler = async (event) => {
  const { paramsId, userId, role } = event.payload as userParamsIdUserIdRole;
  try {
    if (role === 'admin' || paramsId === userId) {
      return {
        statusCode: 200,
        isAuthorized: true,
      }  
    } else {
      return {
        statusCode: 403,
        error: new AuthorizationError("User Not Authorized", "403")
      }
    }
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Role check failed!'),
    };
  }
};

export {
  authAdmin,
  authUser
}