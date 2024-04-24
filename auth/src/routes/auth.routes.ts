import  { Router} from "express";
import { AuthController } from "../controllers/auth.controller";
import {
    LoginValidator,
    RecoveryValidator,
    RegisterValidator,
    ChangePasswordValidator,
    ConfirmationUserValidator,
} from "../validators/auth.validator";
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

/**
 * Do register user
 */
router.post(
    '/login',
    LoginValidator,
    controller.login
);

/**
 * Do init recovery user password
 */
router.post(
    '/recovery',
    RecoveryValidator,
    controller.recovery
);

/**
 * Do change password
 */
router.post(
    '/change-password',
    ChangePasswordValidator,
    controller.changePassword
);

// export router
export { router };