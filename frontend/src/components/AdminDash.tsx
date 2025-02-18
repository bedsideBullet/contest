import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Grid,
	Paper,
	CircularProgress,
	Alert,
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

const AdminDash: React.FC = () => {
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchRegistrations = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/registrations"
				);
				setRegistrations(response.data);
			} catch (err) {
				setError("Failed to fetch registrations");
			} finally {
				setLoading(false);
			}
		};

		fetchRegistrations();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				Admin Dashboard
			</Typography>
			<Grid container spacing={2}>
				{registrations.map((registration) => (
					<Grid item xs={12} key={registration.id}>
						<Paper elevation={3} sx={{ padding: 2 }}>
							<Typography variant="h6">{`${registration.firstName} ${registration.lastName}`}</Typography>
							<Typography>Email: {registration.email}</Typography>
							<Typography>Phone: {registration.phone}</Typography>
							<Typography>City: {registration.city}</Typography>
							<Typography>State: {registration.state}</Typography>
							<Typography>Year: {registration.year}</Typography>
							<Typography>Make: {registration.make}</Typography>
							<Typography>
								Vehicle Model: {registration.vehicleModel}
							</Typography>
							<Typography>Other Notes: {registration.otherNotes}</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default AdminDash;
