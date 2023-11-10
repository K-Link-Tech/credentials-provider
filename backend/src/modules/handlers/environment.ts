import db from '../../config/db';
import logging from '../../config/logging.config';
import { getErrorMessage, getErrorName } from '../../utils/errorHandler';
import {
  BadUserRequestError,
  DatabaseRequestError,
} from '../../utils/errorTypes';
import { environments } from '../../schema/environments.schema';
import { logs } from '../../schema/logs.schema';
import { and, eq, sql, like } from 'drizzle-orm';
import { PayloadWithData, PayloadWithIdData, PayloadWithIdDataBody, PayloadWithNameProjectIdData, UpdateEnvReqBody } from '../interfaces/environmentRequest.interface';

const NAMESPACE = 'Environment-route';

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

const createNewEnvironment: eventHandler = async (event) => {
  // data contains the jwtPayload from authentication with user information.
  const { name, project_id, data } = event.payload as PayloadWithNameProjectIdData;

  try {
    if (!name || !project_id) {
      const e = new BadUserRequestError(
        'Missing name, projectId parameter(s).',
        '401'
      );
      throw e;
    }

    // inserting new environment into environments DB
    const environmentsInDB = await db
      .insert(environments)
      .values({
        name: name,
        project_id: project_id
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });
    if (environmentsInDB.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve environment(s)! Environment array retrieved: ',
        environmentsInDB
      );
      const e = new DatabaseRequestError(
        'Environment has not been added to database',
        '501'
      );
      throw e;
    }

    // inserting new create environment log into logs DB.
    const jsonContent = {
      user_data: data.name + " has created new environment: " + environmentsInDB[0].name + "."
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
        'Database query failed to retrieve create new environment log! Log array retrieved: ',
        createLog
      );
      const e = new DatabaseRequestError(
        'Create new environment log has not been added to database.',
        '501'
      );
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF CREATE NEW ENVIRONMENT PROCESS---------');
    return {
      statusCode: 201,
      data: {
        message: 'The following environment has been created:',
        environment: event.payload,
      },
    };

  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 400 : code;
    return {
      statusCode: errorCode,
      error: new Error('Create new environment request failed.'),
    };
  }

};

const getEnvironments: eventHandler = async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    // querying specific environment(s) from database.
    const environmentRequested =
      id == null
        ? await db
          .select()
          .from(environments)
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
          .from(environments)
          .where(sql`${environments.project_id} = ${id}`)
          .catch((error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError(
              'Database query error.',
              '501'
            );
            throw e;
          })
    if (environmentRequested.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve environment(s)! Environment array retrieved: ',
        environmentRequested
      )
      const e = new DatabaseRequestError('Environment(s) do not exist', '404');
      throw e;
    }
    logging.info(NAMESPACE, '---------END OF GET ENVIRONMENTS PROCESS---------')
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        environmentData: environmentRequested,
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

// deletes an environment from environments DB.
const deleteEnvironment: eventHandler = async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      );
      throw e;
    }
    logging.info(NAMESPACE, 'Deleting environment from database.');

    // deleting environment from environments DB.
    const deletedEnvironment = await db
      .delete(environments)
      .where(eq(environments.id, id))
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (deletedEnvironment.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve environment! Environment array retrieved: ',
        deletedEnvironment
      );
      const e = new DatabaseRequestError('Environment does not exist.', '404');
      throw e;
    }

    // inserting new delete environment into logs DB.
    const jsonContent = {
      user_data:
        data.name + " has deleted environment: " + deletedEnvironment[0].name + "."
    }
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

    logging.info(NAMESPACE, '---------END OF DELETE ENVIRONMENT PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following environment has been deleted from database:',
        environmentData: deleteEnvironment[0],
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
};

// deletes all environments from environments DB.
const deleteAllEnvironments: eventHandler = async (event) => {
  const { data } = event.payload as PayloadWithData;
  
  try {
    logging.info(NAMESPACE, 'Deleting ALL environments from database.');

    // deleting all environments from database.
    const deletedEnvironments = await db
      .delete(environments)
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });
    
    if (deletedEnvironments.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve environments! Environment array retrieved: ',
        deletedEnvironments
      );
      const e = new DatabaseRequestError('No environments exist.', '404');
      throw e;
    }

    // inserting new delete all environments into logs DB.
    const jsonContent = {
      user_data: data.name + " has deleted all environments below.",
      deletedEnvironments: deletedEnvironments
    };

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
        'Delete all environments log has not been added to database.',
        '501'
      );
      throw e;
    }
    
    logging.info(NAMESPACE, '---------END OF DELETE ALL ENVIRONMENTS PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following environments have been deleted from database:',
        environmentData: deletedEnvironments,
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
};

// updates an environment from environments DB.
const updateEnvironment: eventHandler = async (event) => {
  const { id, data, body } = event.payload as PayloadWithIdDataBody;
  const { name } = body as UpdateEnvReqBody;

  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      );
      throw e;
    }

    if (name === undefined) {
      logging.error(
        NAMESPACE,
        'Missing parameter to update environment data! Parameters retrieved: \n',
        { name: name }
      );
      const e = new BadUserRequestError(
        'Update request body cannot be empty!',
        '400'
      );
      throw e;
    }

    logging.info(NAMESPACE, 'Updating environment in database.');
    const originalEnvironment = await db
      .select()
      .from(environments)
      .where(eq(environments.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Get request query error!', '501');
        throw e;
      });

    if (originalEnvironment.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve environment!');
      const e = new DatabaseRequestError('Uuid given cannot be found!', '404');
      throw e;
    }

    // updating the particular environment in environment DB.
    await db
      .update(environments)
      .set({ name: name })
      .where(eq(environments.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          'Update environments database query error!',
          '501'
        );
        throw e;
      });
    
    const updatedEnvironment = await db
      .select()
      .from(environments)
      .where(eq(environments.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError(
          'Get request query error!',
          '501'
        );
        throw e;
      });
    
    if (updatedEnvironment.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve environment!');
      const e = new DatabaseRequestError(
        'Update process failed please check request body parameters.',
        '501'
      )
      throw e;
    }

    // inserting update environment into logs DB.
    const jsonContent = {
      user_data: data.name + " has updated environment: " + originalEnvironment[0].name + ".",
      originalEnvironment: originalEnvironment[0],
      updateEnvironment: updateEnvironment[0]
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
      const e = new DatabaseRequestError('Update environment log has not been added to database.', '501');
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF UPDATE ENVIRONMENT PROCESS---------');
    return {
      statusCode: 202,
      data: {
        message: 'The following user has been updated in database:',
        originalProject: originalEnvironment[0],
        updatedProject: updateEnvironment[0],
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
};

export default {
  createNewEnvironment,
  getEnvironments,
  deleteEnvironment,
  deleteAllEnvironments,
  updateEnvironment
};