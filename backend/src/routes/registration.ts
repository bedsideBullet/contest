import { Router } from "express";
import {
	registerUser,
	getRegistrations,
} from "../controllers/registrationController";

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

router.get("/registrations", async (req, res) => {
	console.log("Received a GET request on /registrations");

	try {
		await getRegistrations(req, res);
	} catch (error) {
		console.error("Error in /registrations route:", error);
		res.status(500).json({ message: "Server error" });
	}
});
export default router;

// import { Router } from "express";
// import {
// 	registerUser,
// 	getRegistrations,
// } from "../controllers/registrationController";

// const router = Router();

// // Define the route with the correct function signature
// router.post("/", async (req, res) => {
// 	console.log("Received a POST request on /registration");

// 	try {
// 		await registerUser(req, res);
// 	} catch (error) {
// 		console.error("Error in /registration route:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// });

// // Route to fetch all registrations
// router.get("/registrations", async (req, res) => {
// 	console.log("Received a GET request on /registrations");

// 	try {
// 		await getRegistrations(req, res);
// 	} catch (error) {
// 		console.error("Error in /registrations route:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// });

// export default router;
