import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
	try {
		const {
			firstName,
			lastName,
			email,
			vehicleModel,
			otherNotes,
			city,
			state,
			phone,
			year,
			make,
		} = req.body;

		console.log("Received user data:", req.body); // Log incoming request data

		// Validate required fields
		if (!firstName || !lastName || !email) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				vehicleModel,
				otherNotes,
				city,
				state,
				phone,
				year,
				make,
			},
		});

		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser });
	} catch (error) {
		res.status(500).json({ message: "Error registering user", error });
	}
};
