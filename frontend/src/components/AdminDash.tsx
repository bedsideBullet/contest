import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Container,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
} from "@mui/material";

interface Registration {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	vehicleModel: string;
	otherNotes: string;
	createdAt: string;
}

const AdminDash = () => {
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRegistrations = async () => {
			try {
				const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/admin/registrations`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (Array.isArray(response.data)) {
					setRegistrations(response.data);
				} else {
					throw new Error("Data format is not valid");
				}
			} catch (error) {
				const errorMessage = (error as any).message;
				setError(errorMessage);
				console.error("Error fetching data:", errorMessage);
			}
		};

		fetchRegistrations();
	}, []);

	const handleExport = async () => {
		try {
			const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/admin/export`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					responseType: "blob",
				}
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "registrations.csv");
			document.body.appendChild(link);
			link.click();
		} catch (error) {
			console.error("Error exporting data:", (error as any).message);
		}
	};

	if (error) {
		return (
			<Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
		);
	}

	return (
		<Container>
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Admin Dashboard
				</Typography>
				<Button variant="contained" color="primary" onClick={handleExport}>
					Export to CSV
				</Button>
				<TableContainer component={Paper} sx={{ mt: 2 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Vehicle Model</TableCell>
								<TableCell>Other Notes</TableCell>
								<TableCell>Created At</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{registrations.map((registration) => (
								<TableRow key={registration.id}>
									<TableCell>{registration.firstName}</TableCell>
									<TableCell>{registration.lastName}</TableCell>
									<TableCell>{registration.email}</TableCell>
									<TableCell>{registration.vehicleModel}</TableCell>
									<TableCell>{registration.otherNotes}</TableCell>
									<TableCell>{registration.createdAt}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	);
};

export default AdminDash;
