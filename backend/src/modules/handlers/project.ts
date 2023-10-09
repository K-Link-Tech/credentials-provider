import db from '../../config/db';
import logging from '../../config/logging.config';
import { getErrorMessage, getErrorName } from '../../utils/errorHandler';
import {
  BadUserRequestError,
  DatabaseRequestError,
} from '../../utils/errorTypes';
import {
  PayloadWithNameUrlData,
  PayloadWithIdData,
  PayloadWithData,
  PayloadWithIdDataBody,
  UpdateReqBody
} from '../interfaces/projectRequest.interface';
import { projects } from '../../schema/projects.schema';
import { environments } from '../../schema/environments.schema';
import { logs } from '../../schema/logs.schema';
import { and, eq, sql, like } from 'drizzle-orm';

const NAMESPACE = 'Project-route';

type event = {
  source: string;
  payload: Object;
};

type eventHandler = (event: event) => Object;

const createNewProject: eventHandler = async (event) => {
  // data contains the jwtPayload from authentication with user information.
  const { name, url, data } = event.payload as PayloadWithNameUrlData;

  try {
    if (!name || !url) {
      const e = new BadUserRequestError(
        'Missing name, url parameter(s).',
        '401'
      );
      throw e;
    }

    // inserting new project into projects DB.
    const projectsInDB = await db
      .insert(projects)
      .values({
        name: name,
        url: url
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (projectsInDB.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve project(s)! Project array retrieved: ',
        projectsInDB
      );
      const e = new DatabaseRequestError(
        'Project has not been added to database.',
        '501'
      );
      throw e;
    }

    // inserting uatEnvironment into environments DB.
    const uatEnvironment = await db
      .insert(environments)
      .values({
        name: name + "_uat",
        project_id: projectsInDB[0].id
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Environment Database query error.', '501');
        throw e;
      });

    if (uatEnvironment.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve uatEnvironment! Environments array retrieved: ',
        uatEnvironment
      );
      const e = new DatabaseRequestError('UatEnvironment has not been added to database.', '501');
      throw e;
    }

    // inserting prodEnvironment into environments DB.
    const prodEnvironment = await db
      .insert(environments)
      .values({
        name: name + "_prod",
        project_id: projectsInDB[0].id
      })
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Environment Database query error.', '501');
        throw e;
      });

    if (prodEnvironment.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve prodEnvironment! Environments array retrieved: ',
        prodEnvironment
      );
      const e = new DatabaseRequestError('ProdEnvironment has not been added to database.', '501');
      throw e;
    }

    // inserting new create project log into logs DB.
    const jsonContent = {
      user_data: data.name + " has created project: " + projectsInDB[0].name + "."
    };
    const loginLog = await db
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

    if (loginLog.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve login log! Log array retrieved: ',
        loginLog
      );
      const e = new DatabaseRequestError('Login log has not been added to database.', '501');
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF CREATE NEW PROJECT PROCESS---------');
    return {
      statusCode: 201,
      data: {
        message: 'The following project has been created:',
        project: event.payload,
      },
    };
  } catch (error) {
    logging.error(NAMESPACE, getErrorMessage(error), error);
    const code = parseInt(getErrorName(error));
    const errorCode = code === null ? 400 : code;
    return {
      statusCode: errorCode,
      error: new Error('Create new project request failed.'),
    };
  }
};

const getProjects: eventHandler = async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    // querying specific project(s) from database.
    const projectsRequested =
      id == null
        ? await db
          .select()
          .from(projects)
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
          .from(projects)
          .where(sql`${projects.id} = ${id}`)
          .catch((error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError(
              'Database query error.',
              '501'
            );
            throw e;
          });

    if (projectsRequested.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve project(s)! Project array retrieved: ',
        projectsRequested
      );
      const e = new DatabaseRequestError('Project(s) do not exist', '404');
      throw e;
    }
    logging.info(NAMESPACE, '---------END OF GET PROJECTS PROCESS---------')
    return {
      statusCode: 200,
      data: {
        message: `The following here is the data:`,
        projectsData: projectsRequested,
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

const deleteProject: eventHandler = async (event) => {
  const { id, data } = event.payload as PayloadWithIdData;

  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      );
      throw e;
    }
    logging.info(NAMESPACE, 'Deleting project from database.');

    // deleting project from projects DB.
    const deletedProject = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (deletedProject.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve project! Project array retrieved: ',
        deletedProject
      );
      const e = new DatabaseRequestError('Project does not exist.', '404');
      throw e;
    }

    // inserting new delete project into logs DB.
    const jsonContent = {
      user_data:
        data.name + " has deleted project: " + deletedProject[0].name
        + " and all related environments."
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
        'Database query failed to retrieve delete log! Log array retrieved: ',
        deleteOneLog
      );
      const e = new DatabaseRequestError('Delete project log has not been added to database.', '501');
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF DELETE PROJECT PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following project has been deleted from database:',
        projectData: deletedProject,
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

const deleteAllProjects: eventHandler = async (event) => {
  const { data } = event.payload as PayloadWithData;

  try {

    logging.info(NAMESPACE, 'Deleting ALL projects from database.');

    // deleting all project from projects DB.
    const deletedProjects = await db
      .delete(projects)
      .returning()
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Database query error.', '501');
        throw e;
      });

    if (deletedProjects.length.valueOf() === 0) {
      logging.error(
        NAMESPACE,
        'Database query failed to retrieve projects! Project array retrieved: ',
        deletedProjects
      );
      const e = new DatabaseRequestError('No projects exist.', '404');
      throw e;
    }

    // inserting new delete all projects into logs DB.
    const jsonContent = {
      user_data: data.name + " has deleted all projects below and all related environments.",
      deletedProjects: deletedProjects
    };

    const deleteAllLog = await db
      .insert(logs)
      .values({
        userId: data.id,
        taskDetail: sql`${jsonContent}::json`,
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
        'Delete all projects log has not been added to database.',
        '501'
      );
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF DELETE ALL PROJECTS PROCESS---------');
    return {
      statusCode: 200,
      data: {
        message: 'The following projects have been deleted from database:',
        projectData: deletedProjects,
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

const updateProject: eventHandler = async (event) => {
  const { id, data, body } = event.payload as PayloadWithIdDataBody;
  const { name, url } = body as UpdateReqBody;
  try {
    if (!id) {
      const e = new DatabaseRequestError(
        'Missing id parameter',
        '401'
      );
      throw e;
    }

    if (name === undefined && url === undefined) {
      logging.error(
        NAMESPACE,
        'Missing parameters to update project data! Parameters retrieved: \n',
        { name: name, url: url }
      );
      const e = new BadUserRequestError(
        'Update request body cannot be empty!',
        '400'
      );
      throw e;
    }

    logging.info(NAMESPACE, 'Updating project in database.');
    const originalProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Get request query error!', '501');
        throw e;
      });

    if (originalProject.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve project!');
      const e = new DatabaseRequestError('Uuid given cannot be found!', '404');
      throw e;
    }

    // updating the particular project in projects DB.
    let hasUpdated: boolean = false;
    if (name) {
      await db
        .update(projects)
        .set({ name: name })
        .where(eq(projects.id, id))
        .catch((error) => {
          logging.error(NAMESPACE, getErrorMessage(error), error);
          const e = new DatabaseRequestError(
            'Update projects database query error!',
            '501'
          );
          throw e;
        });

      // updating names of environments related to the project
      const oldEnvironmentsInDB = await db
        .select()
        .from(environments)
        .where(
          and(
            eq(environments.project_id, originalProject[0].id),
            like(environments.name, "%" + originalProject[0].name + "%")
          )
        )
        .catch((error) => {
          logging.error(NAMESPACE, getErrorMessage(error), error);
          const e = new DatabaseRequestError(
            'Environments database get query error.',
            '501'
          );
          throw e;
        });
      // This loop updates each of the environments that contains the
      // old project name to a new project name by using regEx and string.replace()
      for (let i = 0; i < oldEnvironmentsInDB.length; i++) {
        const regExToUpdate = new RegExp(originalProject[0].name, 'gi');
        const newName = oldEnvironmentsInDB[i].name.replace(regExToUpdate, name);
        await db
          .update(environments)
          .set({ name: newName })
          .where(
            and(
              eq(environments.project_id, originalProject[0].id),
              eq(environments.name, oldEnvironmentsInDB[i].name)
            )
          )
          .catch((error) => {
            logging.error(NAMESPACE, getErrorMessage(error), error);
            const e = new DatabaseRequestError(
              'Update environments database error!',
              '501'
            );
            throw e;
          });
      }
      hasUpdated = true;
    }
    if (url) {
      await db
        .update(projects)
        .set({ url: url })
        .where(eq(projects.id, id))
        .catch((error) => {
          logging.error(NAMESPACE, getErrorMessage(error), error);
          const e = new DatabaseRequestError(
            'Update projects database query error!',
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

    const updatedProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .catch((error) => {
        logging.error(NAMESPACE, getErrorMessage(error), error);
        const e = new DatabaseRequestError('Get request query error!', '501');
        throw e;
      });

    if (updatedProject.length.valueOf() === 0) {
      logging.error(NAMESPACE, 'Database query failed to retrieve project!');
      const e = new DatabaseRequestError(
        'Update process failed please check request body parameters.',
        '501'
      );
      throw e;
    }

    // inserting update project into logs DB.
    const jsonContent = {
      user_data: data.name + " has updated project: " + originalProject[0].name + ".",
      originalProject: originalProject[0],
      updatedProject: updatedProject[0]
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
        'Update project log has not been added to database.', 
        '501'
      );
      throw e;
    }

    logging.info(NAMESPACE, '---------END OF UPDATE PROJECT PROCESS---------');
    return {
      statusCode: 202,
      data: {
        message: 'The following user has been updated in database:',
        originalProject: originalProject[0],
        updatedProject: updatedProject[0],
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
  createNewProject,
  getProjects,
  deleteProject,
  deleteAllProjects,
  updateProject
};