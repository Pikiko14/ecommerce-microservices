import  { Router} from "express";
import { AuthController } from "../controllers/auth.controller";
import { RegisterValidator } from "../validators/auth.validator";
// init router
const router = Router();

// instance controller
const controller = new AuthController();

/**
 * Do register user
 */
router.post(
    '/register',
    RegisterValidator,
    controller.register
);

// export router
export { router };