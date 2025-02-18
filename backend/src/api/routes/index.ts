import { Router } from "express";
import registrationRoutes from "./registration";

const router = Router();

router.use("/registration", registrationRoutes);

export default router;
