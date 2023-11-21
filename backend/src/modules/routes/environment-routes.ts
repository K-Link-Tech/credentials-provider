import { Request, Router } from 'express';
import handler from '../handlers/environment';
import { 
  routerEnclose, 
  routerEncloseAuthentication 
} from '../../utils/routerEnclose';
import authenticateToken from '../../middleware/authorization';
import { PayloadWithData, PayloadWithNameProjectIdData, UpdateEnvReqBody } from '../interfaces/environmentRequest.interface';


const router = Router();

// creates a new environment
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
  routerEnclose(handler.createNewEnvironment, (req: Request) => {
    const body: PayloadWithNameProjectIdData = req.body;
    return {
      source: "express",
      payload: body
    }
  })
);

// get environment by project id or environment id
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
  routerEnclose(handler.getEnvironments, (req: Request) => {
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

// get all environments
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
  routerEnclose(handler.getEnvironments, (req: Request) => {
    const data = req.body as PayloadWithData;
    return {
      source: "express",
      payload: data
    }
  })
);

// deletes a specific environment
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
  routerEnclose(handler.deleteEnvironment, (req: Request) => {
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

// deletes all environments
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
  routerEnclose(handler.deleteAllEnvironments, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    return {
      source: "express",
      payload: {
        data: data
      }
    }
  })
);

// updates an environment 
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
  routerEnclose(handler.updateEnvironment, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    const body: UpdateEnvReqBody = req.body;
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