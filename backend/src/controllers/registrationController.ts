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

		console.log("Received user data:", req.body);

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

export const getRegistrations = async (req: Request, res: Response) => {
	try {
		const registrations = await prisma.user.findMany();
		res.status(200).json(registrations);
	} catch (error) {
		res.status(500).json({ message: "Error fetching registrations", error });
	}
};

export const deleteRegistrations = async (req: Request, res: Response) => {
	const { ids } = req.body;

	if (!Array.isArray(ids) || ids.length === 0) {
		return res
			.status(400)
			.json({ message: "No IDs provided or invalid format" });
	}

	try {
		const numericIds = ids.map((id: string) => parseInt(id));

		const deleteResponse = await prisma.user.deleteMany({
			where: {
				id: { in: numericIds },
			},
		});

		if (deleteResponse.count === 0) {
			return res
				.status(404)
				.json({ message: "No registrations found to delete" });
		}

		res.status(200).json({
			message: `${deleteResponse.count} registrations deleted successfully`,
		});
	} catch (error) {
		console.error("Error deleting registrations:", error);
		res.status(500).json({ message: "Error deleting registrations", error });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Error fetching user", error });
	}
};
export const updateRegistration = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const dataToUpdate = req.body;

		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: dataToUpdate,
		});

		res
			.status(200)
			.json({ message: "User updated successfully", user: updatedUser });
	} catch (error) {}
};
