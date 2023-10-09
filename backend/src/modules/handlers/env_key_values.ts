import db from '../../config/db';
import logging from '../../config/logging.config';
import { getErrorMessage, getErrorName } from '../../utils/errorHandler';
import {
  BadUserRequestError,
  DatabaseRequestError,
} from '../../utils/errorTypes';
import { logs } from '../../schema/logs.schema';
import { and, eq, sql, like } from 'drizzle-orm';
import { 
  PayloadWithData, 
  PayloadWithIdData, 
  PayloadWithIdDataBody, 
  PayloadWithValueEncryptionEnvironmentIdData 
} from '../interfaces/env_key_values.interfaceRequest';
import { env_key_values } from '../../schema/env_key_values.schema';

const NAMESPACE = 'Env_key_value-route';

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

const createNewEnvKeyValue: eventHandler = async (event) => {
  // data contains the jwtPayload from authentication with user information.
  const { 
    value, 
    encryption_method,
    environment_id, 
    data 
  } = event.payload as PayloadWithValueEncryptionEnvironmentIdData;

  try {
    if (!value || !environment_id || !encryption_method) {
      const e = new BadUserRequestError(
        'Missing value, encryption_method ,environment_id parameter(s).',
        '401'
      );
      throw e;
    }

    // inserting new env_key_value into env_key_values DB.
    const env_key_valuesInDB = await db
      .insert(env_key_values)
      .values({
        value: value,
        encryption_method: encryption_method,
        environment_id: environment_id
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (env_key_valuesInDB.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve env_key_value(s)! Env_key_value array retrieved: ',
        env_key_valuesInDB
      );
      const e = new DatabaseRequestError(
        'Env_key_value has not been added to database',
        '501'
      );
      throw e;
    }

    // inserting new create env_key_value log into logs DB.
    const jsonContent = {
      user_data: data.name + " has created new env_key_value: " + env_key_valuesInDB[0].value + "."
    };
    const createLog = await db
      .insert(logs)
      .values({
        userId: data.id,
        taskDetail: sql`${jsonContent}::json`
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs Database query error.', '501');
        throw e;
      });
    if (createLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve create new env_key_value log! Log array retrieved: ',
        createLog
      );
      const e = new DatabaseRequestError(
        'Create new env_key_value log has not been added to database.',
        '501'
      );
      throw e;      
    }

    logging.info(NAMESPACE, '---------END OF CREATE NEW ENV_KEY_VALUE PROCESS---------');
    return {
      statusCode: 201,
      data: {
        message: 'The following env_key_value has been created:',
        environment: event.payload,
      },
    };

  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 400 : code;
    return {
      statusCode: errorCode,
      error: new Error('Create new env_key_value request failed.'),
    };
  }
};

const getEnvKeyValues: eventHandler = async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    // querying specific env_key_values(s) from database.
    const envKeyValueRequested = 
      id == null
          ? await db
            .select()
            .from(env_key_values)
            .catch((error) => {
              logging.error(NAMESPACE, getErrorMessage(error), error);
              const e = new DatabaseRequestError(
                'Database query error.',
                '501'
              );
              throw e;
            })
          : await db
            .select()
            .from(env_key_values)
            .where(sql`${env_key_values.id} = ${id}`)
            .catch((error) => {
              logging.error(NAMESPACE, getErrorMessage(error), error);
              const e = new DatabaseRequestError(
                'Database query error.',
                '501'
              );
              throw e;
            })
    if (envKeyValueRequested.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve env_key_value(s)! Env_key_value array retrieved: ',
        envKeyValueRequested
      )
      const e = new DatabaseRequestError('Env_key_value(s) do not exist', '404');
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF GET ENV_KEY_VALUEs PROCESS---------')
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        envKeyValueData: envKeyValueRequested,
        authData: data,
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
};

// deletes an env_key_value from environments DB.
const deleteEnvKeyValue: eventHandler =async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      )
      throw e;
    }
    logging.info(NAMESPACE, 'Deleting env_key_value from database.');

    // deleting env_key_value from env_key_values DB.
    const deletedEnvKeyValue = await db
      .delete(env_key_values)
      .where(eq(env_key_values.id, id))
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (deletedEnvKeyValue.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve Env_key_value! Env_key_value array retrieved: ',
        deletedEnvKeyValue
      );
      const e = new DatabaseRequestError('Env_key_value does not exist.', '404');
      throw e;
    }

    // inserting new delete env_key_value into logs DB.
    const jsonContent = {
      user_data: data.name + " has deleted env_key_value: " + deletedEnvKeyValue[0].value + "."
    };
    const deleteOneLog = await db
      .insert(logs)
      .values({
        userId: data.id,
        taskDetail: sql`${jsonContent}::json`
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs Database query error.', '501');
        throw e;
      });

    if (deleteOneLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve delete env_key_value log! Log array retrieved: ',
        deleteOneLog
      );
      const e = new DatabaseRequestError(
        'Delete env_key_value log has not been added to database.',
        '501'
      );
      throw e;      
    }

    logging.info(NAMESPACE, '---------END OF DELETE ENV_KEY_VALUE PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following environment has been deleted from database:',
        envKeyValueData: deleteEnvKeyValue[0],
        authData: data,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Delete one request failed.'),
    };
  }
}

const deleteAllEnKeyValues: eventHandler = async (event) => {
  const { data } = event.payload as PayloadWithData;

  try {
    logging.info(NAMESPACE, 'Deleting ALL env_key_values from database.');

    // deleting all env_key_value from database.
    const deletedEnvKeyValues = await db
      .delete(env_key_values)
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });
    
    if (deletedEnvKeyValues.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve env_key_values! Env_key_value array retrieved: ',
        deletedEnvKeyValues
      );
      const e = new DatabaseRequestError('No env_key_values exist.', '404');
      throw e;
    }

    // inserting new delete all environments into logs DB.
    const jsonContent = {
      user_data: data.name + " has deleted all env_key_values below.",
      deletedEnvKeyValues: deletedEnvKeyValues
    }

    const deleteAllLog = await db
      .insert(logs)
      .values({
        userId: data.id,
        taskDetail: sql`${jsonContent}::json`
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs Database query error.', '501');
        throw e;
      });
    
    if (deleteAllLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve delete all log! Log array retrieved: ',
        deleteAllLog
      );
      const e = new DatabaseRequestError(
        'Delete all env_key_values log has not been added to database.',
        '501'
      );
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF DELETE ALL ENV_KEY_VALUES PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following env_key_values have been deleted from database:',
        envKeyValueData: deletedEnvKeyValues,
        authData: data,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Delete all request failed!'),
    };
  }
}

const updateEnvKeyValue: eventHandler = async (event) => {
  const { id, data, body } = event.payload as PayloadWithIdDataBody;
  const { value, encryption_method } = body;

  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      );
      throw e;
    }

    if (value === undefined || encryption_method === undefined) {
      logging.error(
        NAMESPACE,
        'Missing parameters to update env_key_value data! Parameters retrieved: \n',
        { 
          value: value, 
          encryption_method: encryption_method 
        }
      );
      const e = new BadUserRequestError(
        'Update request body cannot be empty!',
        '400'
      );
      throw e;
    }

    logging.info(NAMESPACE, 'Updating env_key_value in database.');
    const originalEnvKeyValue = await db
      .select()
      .from(env_key_values)
      .where(eq(env_key_values.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Get request query error!', '501');
        throw e;
      });

    if (originalEnvKeyValue.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve environment!');
      const e = new DatabaseRequestError('Uuid given cannot be found!', '404');
      throw e;
    }

    // updating the particular env_key_value in env_key_values DB.
    let hasUpdated: boolean = false;
    if (value) {
      await db
        .update(env_key_values)
        .set({ value: value })
        .where(eq(env_key_values.id, id))
        .catch((error) => {
          logging.error(NAMESPACE, getErrorMessage(error), error);
          const e = new DatabaseRequestError(
            'Update env_key_values database query error!',
            '501'
          );
          throw e;
        });
      hasUpdated = true;
    }
    if (encryption_method) {
      await db
        .update(env_key_values)
        .set({ encryption_method: encryption_method })
        .where(eq(env_key_values.id, id))
        .catch((error) => {
          logging.error(NAMESPACE, getErrorMessage(error), error);
          const e = new DatabaseRequestError(
            'Update env_key_values database query error!',
            '501'
          );
          throw e;
        });
      hasUpdated = true;
    }

    if (!hasUpdated) {
      logging.error(
        NAMESPACE, 
        'No parameters were updated, update request failed. Printing hasUpdated: ',
        hasUpdated
      );
      const e = new DatabaseRequestError(
        'Update request failed after running database update query.',
        '500'
      );
      throw e;
    }

    const updatedEnvKeyValue = await db
      .select()
      .from(env_key_values)
      .where(eq(env_key_values.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Get request query error!', '501');
        throw e;
      });

    if (updateEnvKeyValue.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve env_key_value!');
      const e = new DatabaseRequestError(
        'Update process failed please check request body parameters.',
        '501'
      );
      throw e;
    }

    // inserting update env_key_value into log DB.
    const jsonContent = {
      user_data: data.name + " has updated env_key_value: " + originalEnvKeyValue[0] + ".",
      originalProject: originalEnvKeyValue[0],
      updatedProject: updatedEnvKeyValue[0]
    };

    const updateLog = await db
      .insert(logs)
      .values({
        userId: data.id,
        taskDetail: sql`${jsonContent}::json`
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Logs database query error.', '501');
        throw e;
      });

    if (updateLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve delete log! Log array retrieved: ',
        updateLog
      );
      const e = new DatabaseRequestError(
        'Update env_key_value log has not been added to database.', 
        '501'
      );
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF UPDATE ENV_KEY_VALUE PROCESS---------');
    return {
      statusCode: 202,
      data: {
        message: 'The following user has been updated in database:',
        originalProject: originalEnvKeyValue[0],
        updatedProject: updatedEnvKeyValue[0],
        authData: data,
      },
    };

  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 500 : code;
    return {
      statusCode: errorCode,
      error: new Error('Update request failed.'),
    };
  }
}

export default {
  createNewEnvKeyValue,
  getEnvKeyValues,
  deleteEnvKeyValue,
  deleteAllEnKeyValues,
  updateEnvKeyValue
};