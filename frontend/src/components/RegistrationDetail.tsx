import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Box,
	Button,
	AlertColor,
	Snackbar,
} from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";

interface Registration {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	vehicleModel: string;
	otherNotes: string;
	city: string;
	state: string;
	phone: string;
	year: string;
	make: string;
}

const RegistrationDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [registration, setRegistration] = useState<Registration | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] =
		useState<AlertColor>("success");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRegistration = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/registration/${id}`
				);
				setRegistration(response.data);
			} catch (err) {
				setError("Failed to fetch registration details");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchRegistration();
		}
	}, [id]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	if (!registration) {
		return <Alert severity="error">Registration not found</Alert>;
	}

	const handleDelete = async () => {
		try {
			console.log(`Attempting to delete registration with ID: ${id}`);
			await axios.delete(`http://localhost:5000/api/registration/${id}`);
			setSnackbarMessage("Registration deleted successfully");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
			setTimeout(() => navigate("/admin"), 2000);
		} catch (err) {
			setSnackbarMessage("Failed to delete registration");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleExport = () => {
		if (!registration) return;

		const headers = [
			[
				"First Name",
				"Last Name",
				"Email",
				"Phone",
				"City",
				"State",
				"Year",
				"Make",
				"Model",
				"Other Notes",
			],
		];
		const rows = [
			[
				registration.firstName,
				registration.lastName,
				registration.email,
				registration.phone,
				registration.city,
				registration.state,
				registration.year,
				registration.make,
				registration.vehicleModel,
				registration.otherNotes,
			],
		];

		const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Registration");

		XLSX.writeFile(workbook, `registration_${id}.xlsx`);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	if (!registration) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<Alert severity="error">Registration not found</Alert>
			</Box>
		);
	}

	return (
		<>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-start",
					width: "100vw",
					minHeight: "100vh",
					bgcolor: "background.default",
					padding: "2rem",
				}}
			>
				<Container
					sx={{
						mt: 5,
					}}
				>
					<Paper elevation={3} sx={{ padding: "2rem", borderRadius: 2 }}>
						<Box display={"flex"} justifyContent={"center"} mb={4}>
							<Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
								Registration Details
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								<strong>Name:</strong> {registration.firstName}{" "}
								{registration.lastName}
							</Typography>
							<Typography variant="h6" gutterBottom>
								<strong>Email:</strong> {registration.email}
							</Typography>
							<Typography variant="h6" gutterBottom>
								<strong>Phone:</strong> {registration.phone}
							</Typography>
							<Typography variant="h6" gutterBottom>
								<strong>Vehicle:</strong> {registration.year}{" "}
								{registration.make} {registration.vehicleModel}
							</Typography>
							<Typography variant="h6" gutterBottom>
								<strong>Location:</strong> {registration.city},{" "}
								{registration.state}
							</Typography>
							<Typography variant="h6" gutterBottom>
								<strong>Other Notes:</strong>{" "}
								{registration.otherNotes || "No additional notes"}
							</Typography>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Button variant="contained" color="warning" href="/admin">
								Back to Registrations
							</Button>
							<Button variant="contained" color="error" onClick={handleDelete}>
								Delete
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleExport}
							>
								Export
							</Button>
						</Box>
					</Paper>
				</Container>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={6000}
					onClose={() => setSnackbarOpen(false)}
				>
					<Alert
						onClose={() => setSnackbarOpen(false)}
						severity={snackbarSeverity}
					>
						{snackbarMessage}
					</Alert>
				</Snackbar>
			</Box>
		</>
	);
};

export default RegistrationDetail;
