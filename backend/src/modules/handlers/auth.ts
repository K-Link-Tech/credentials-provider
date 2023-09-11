import db from '../../config/db';
import bcrypt from 'bcrypt';
import { eq, sql } from 'drizzle-orm';
import { signJWT } from '../../utils/JWT-helpers';
import { users } from '../../schema/users.schema';
import { logs } from '../../schema/logs.schema';
import {
  DecodedJWTObj,
  LoginReq,
  RegisterReq,
} from '../interfaces/authRequest.interface';
import logging from '../../config/logging.config';
import { getErrorMessage, getErrorName } from '../../utils/errorHandler';
import {
  AuthenticationError,
  DatabaseRequestError,
} from '../../utils/errorTypes';
import { json } from 'drizzle-orm/pg-core';

const NAMESPACE = 'Auth-route';

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

const refreshAccessToken: eventHandler = async (event) => {
  logging.info(NAMESPACE, 'Refresh token validated, user is authorized.');
  const { id } = event.payload as DecodedJWTObj;
  try {
    if (!id) {
      const e = new DatabaseRequestError('Missing id parameter', '401');
      throw e;
    }

    const userRequested = await db
      .select()
      .from(users)
      .where(sql`${users.id} = ${id}`)
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });
    if (userRequested.length == 0) {
      logging.error(
        NAMESPACE,
        'Uuid given cannot be found! Users array requested: \n',
        userRequested
      );
      const e = new DatabaseRequestError('User(s) does not exist.', '404');
      throw e;
    }
    const accessToken = signJWT(userRequested[0], 'accessPrivateKey');
    logging.info(
      NAMESPACE,
      '---------END OF ACCESS TOKEN REFRESH PROCESS---------'
    );
    return {
      statusCode: 200,
      data: {
        message: 'Refreshing of accessToken successful.',
        accessSigningPayload: accessToken,
        userType: userRequested[0],
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Refreshing accessToken failed.'),
    };
  }
};

const validateToken: eventHandler = async (event) => {
  logging.info(NAMESPACE, 'Token validated, user is authorized.');
  logging.info(NAMESPACE, '---------END OF TOKEN VALIDATION PROCESS---------');
  const decoded = event.payload;
  return {
    statusCode: 200,
    data: {
      message: 'Authorized user.',
      decodedSignature: decoded,
    },
  };
};

const register: eventHandler = async (event) => {
  const { name, email, password } = event.payload as RegisterReq;
  try {
    if (!email || !password || !name) {
      const e = new DatabaseRequestError(
        'Missing name, email, password parameter(s).',
        '401'
      );
      throw e;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    logging.info(NAMESPACE, 'Password hashed!');
    const usersInDB = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
      }).returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (usersInDB.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve user(s)! User array retrieved: ',
        usersInDB
      );
      const e = new DatabaseRequestError('User has not been added to database.', '501');
      throw e;
    }

    const registerLog = await db
      .insert(logs)
      .values({
        userId: usersInDB[0].id,
        taskDetail: json('user_details').default({
          user_data: `New user created: ${usersInDB[0].name}`
        }),
      })
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs Database query error.', '501');
        throw e;
      });

      if (registerLog.length.valueOf() === 0) {
        logging.error(
          NAMESPACE,
          'Database query failed to retrieve register log! Log array retrieved: ',
          registerLog
        );
        const e = new DatabaseRequestError('Register log has not been added to database.', '501');
        throw e;
      }

    logging.info(NAMESPACE, 'Data has been sent to database.');
    logging.info(NAMESPACE, '---------END OF REGISTRATION PROCESS---------');

    return {
      statusCode: 201,
      data: {
        message: 'The following user has been registered:',
        user: event.payload,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 400 : code;
    return {
      statusCode: errorCode,
      error: new Error('Register new user request failed.'),
    };
  }
};

const loginUser: eventHandler = async (event) => {
  const { email } = event.payload as LoginReq;
  const { password } = event.payload as LoginReq;
  
  try {
    if (!email || !password) {
      const e = new DatabaseRequestError(
        'Missing email or password parameter(s).',
        '401'
      );
      throw e;
    }
    logging.info(NAMESPACE, 'Login info received.');
    const usersInDB = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Users Database query error.', '501');
        throw e;
      });

    console.log(usersInDB);
    logging.info(
      NAMESPACE,
      'Users info retrieved from database. User Retrieved data: \n',
      usersInDB
    );

    if (usersInDB.length == 0) {
      const e = new DatabaseRequestError(
        'Email is incorrect or not registered. Unable to retrieve user.',
        '401'
      );
      throw e;
    }

    const result = bcrypt.compareSync(password, usersInDB[0].password);
    if (!result) {
      const e = new AuthenticationError('Password is wrong.', '401');
      throw e;
    }
    const refreshToken = signJWT(usersInDB[0], 'refreshPrivateKey');
    const accessToken = signJWT(usersInDB[0], 'accessPrivateKey');

    const loginLog = await db
      .insert(logs)
      .values({
        userId: usersInDB[0].id,
        taskDetail: json('user_details').default({
          user_data: usersInDB[0].name + " logged in."
        }),
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs Database query error.', '501');
        throw e;
      });
    
      if (loginLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve login log! Log array retrieved: ',
        loginLog
      );
      const e = new DatabaseRequestError('Login log has not been added to database.', '501');
      throw e;
    }

    return {
      statusCode: 200,
      data: {
        message: 'Both tokens authentication successful. Login Success!',
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: usersInDB[0],
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null || code === undefined ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Login request failed.'),
    };
  }
};

export default {
  validateToken,
  loginUser,
  register,
  refreshAccessToken,
};
