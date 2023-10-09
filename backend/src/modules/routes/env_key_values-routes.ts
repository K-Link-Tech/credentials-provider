import { Request, Router } from 'express';
import handler from '../handlers/env_key_values';
import authenticateToken from '../../middleware/authorization';
import { 
  routerEnclose, 
  routerEncloseAuthentication 
} from '../../utils/routerEnclose';
import { 
  PayloadWithData, 
  PayloadWithValueEncryptionEnvironmentIdData, 
  UpdateEnvKeyReqBody 
} from '../interfaces/env_key_values.interfaceRequest';


const router = Router();

// creates a new env_key_value
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
  routerEnclose(handler.createNewEnvKeyValue, (req: Request) => {
    const body: PayloadWithValueEncryptionEnvironmentIdData = req.body;
    return {
      source: "express",
      payload: body
    }
  })
);

// get all env_key_values
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
  routerEnclose(handler.getEnvKeyValues, (req: Request) => {
    const data = req.body as PayloadWithData;
    return {
      source: "express",
      payload: data
    }
  })
);

// delete one env_key_values
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
  routerEnclose(handler.deleteEnvKeyValue, (req: Request) => {
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

// deletes all env_key_values
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
  routerEnclose(handler.deleteAllEnKeyValues, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    return {
      source: "express",
      payload: {
        data: data
      }
    }
  })
);

// updates an env_key_value 
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
  routerEnclose(handler.updateEnvKeyValue, (req: Request) => {
    const data: PayloadWithData = req.body.data;
    const body: UpdateEnvKeyReqBody = req.body;
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