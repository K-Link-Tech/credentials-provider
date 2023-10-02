import db from '../../config/db';
import bcrypt from 'bcrypt';
import { and, eq, sql, arrayContains } from 'drizzle-orm';
import { getErrorMessage, getErrorName } from '../../utils/errorHandler';
import logging from '../../config/logging.config';
import { ReqParams, UpdateParams } from '../interfaces/usersRequest.interface';
import {
  BadUserRequestError,
  DatabaseRequestError,
} from '../../utils/errorTypes';
import { logs } from '../../schema';

const NAMESPACE = 'Log-routes';

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

const getUserLogs: eventHandler =async (event) => {
  const { id, authData } = event.payload as ReqParams;

  if (id == null) {
    const e = new BadUserRequestError('Missing user id.', '400');
    throw e;
  }

  try {
    const logsRequested = await db
      .select()
      .from(logs)
      .where(sql`${logs.userId} = ${id}`)
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          'Database query error.',
          '501'
        );
        throw e;
      });
    if (logsRequested.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve logs(s)! Log array retrieved: ',
        logsRequested
      );
      const e = new DatabaseRequestError('Log(s) do not exist.', '404');
      throw e;
    }
    logging.info(NAMESPACE, '---------END OF GET LOGS PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        logsData: logsRequested,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Get request failed.'),
    };
  }
}
const getUserCreateLogs: eventHandler =async (event) => {
  const { id, authData } = event.payload as ReqParams;

  if (id == null) {
    const e = new BadUserRequestError('Missing user id.', '400');
    throw e;
  }

  try {
    const logsRequested = await db
      .select()
      .from(logs)
      .where(
        and(
          sql`${logs.userId} = ${id}`,
          arrayContains))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          'Database query error.',
          '501'
        );
        throw e;
      });
    if (logsRequested.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve logs(s)! Log array retrieved: ',
        logsRequested
      );
      const e = new DatabaseRequestError('Log(s) do not exist.', '404');
      throw e;
    }
    logging.info(NAMESPACE, '---------END OF GET LOGS PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        logsData: logsRequested,
        authData: authData,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Get request failed.'),
    };
  }
}

const 

export {
  getUserLogs,

}