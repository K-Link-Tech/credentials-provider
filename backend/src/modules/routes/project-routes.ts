import { Request, Router } from 'express';
import handler from '../handlers/project';
import { 
  routerEnclose, 
  routerEncloseAuthentication 
} from '../../utils/routerEnclose';
import authenticateToken from '../../middleware/authorization';
import {
  PayloadWithNameUrlScopeData,
  PayloadWithData,
  UpdateReqBody
} from '../interfaces/projectRequest.interface';

const router = Router();

// create new project
router.post(
  '/create',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.createNewProject, (req: Request) => {
    const body: PayloadWithNameUrlScopeData = req.body;
    return {
      source: "express",
      payload: body
    }
  })
);

// get projects by id
router.get(
  '/:id',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.getProjects, (req: Request) => {
    const params = req.params.id;
    const data: PayloadWithData = req.body.data;
    return {
      source: "express",
      payload: {
        id: params,
        data: data
      }
    }
  })
);

// get all projects
router.get(
  '/',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.getProjects, (req: Request) => {
    const data = req.body as PayloadWithData;
    return {
      source: "express",
      payload: data
    }
  })
);

// deletes a specific project
router.delete(
  '/:id',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.deleteProject, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    const params = req.params.id;
    return {
      source: "express",
      payload: {
        id: params,
        data: data
      }
    }
  })
);

// deletes all projects
router.delete(
  '/',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.deleteAllProjects, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    return {
      source: "express",
      payload: {
        data: data
      }
    }
  })
);

// updates a project
router.patch(
  '/:id',
  routerEncloseAuthentication(authenticateToken, (req: Request) => {
    const accessToken: string | undefined = req.headers.authorization?.split(' ')[1];
    const refreshToken: string | undefined = req.headers.authorization?.split(' ')[2];
    return {
      source: "express",
      payload: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
  }),
  routerEnclose(handler.updateProject, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    const body: UpdateReqBody = req.body;
    const params = req.params.id;
    return {
      source: "express",
      payload: {
        id: params,
        data: data,
        body: body
      }
    }
  })
);


export default router;