import { Router } from "express";
import { registerUser } from "../controllers/registrationController";

const router = Router();

// Define the route with the correct function signature
router.post("/", async (req, res) => {
	console.log("Received a POST request on /registration");

	try {
		await registerUser(req, res);
	} catch (error) {
		console.error("Error in /registration route:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
