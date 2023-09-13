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
import { PayloadWithNameProjectIdData } from '../interfaces/environmentRequest.interface';

const NAMESPACE = 'Project-route';

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
  
};

const deleteEnvironment: eventHandler = async (event) => {
  
};

const deleteAllEnvironments: eventHandler = async (event) => {
  
};

const updateEnvironment: eventHandler = async (event) => {
  
};

export default {
  createNewEnvironment,
  getEnvironments,
  deleteEnvironment,
  deleteAllEnvironments,
  updateEnvironment
};