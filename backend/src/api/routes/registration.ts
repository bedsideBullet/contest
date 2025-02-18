import { Router } from "express";
import { registerUser } from "../../controllers/registrationController";

const router = Router();

router.post("/", registerUser);

export default router;
