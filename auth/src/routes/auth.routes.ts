import  { Router} from "express";
import { AuthController } from "../controllers/auth.controller";
import { RegisterValidator, ConfirmationUserValidator } from "../validators/auth.validator";
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

/**
 * Do register user
 */
router.get(
    '/confirm',
    ConfirmationUserValidator,
    controller.userConfirmation
);

// export router
export { router };