import { Request, Router } from 'express';
import handler from '../handlers/environment';
import { 
  routerEnclose, 
  routerEncloseAuthentication 
} from '../../utils/routerEnclose';
import authenticateToken from '../../middleware/authorization';
import { PayloadWithNameProjectIdData } from '../interfaces/environmentRequest.interface';


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


export default router;