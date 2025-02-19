import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Container,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Box,
	Button,
} from "@mui/material";
import axios from "axios";

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
	const { id } = useParams<{ id: string }>(); // Use React Router to get the `id` param
	const [registration, setRegistration] = useState<Registration | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

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

	return (
		<Container maxWidth="md" sx={{ mt: 5 }}>
			<Paper elevation={3} sx={{ padding: "2rem", borderRadius: 2 }}>
				<Typography variant="h4" gutterBottom>
					Registration Details
				</Typography>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Name: {registration.firstName} {registration.lastName}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Email: {registration.email}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Phone: {registration.phone}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Vehicle: {registration.year} {registration.make}{" "}
						{registration.vehicleModel}
					</Typography>
					<Typography variant="body1" gutterBottom>
						City: {registration.city}, State: {registration.state}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Other Notes: {registration.otherNotes || "No additional notes"}
					</Typography>
				</Box>
				<Button variant="contained" color="primary" href="/admin/dashboard">
					Back to Registrations
				</Button>
			</Paper>
		</Container>
	);
};

export default RegistrationDetail;
