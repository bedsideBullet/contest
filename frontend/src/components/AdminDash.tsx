import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Box,
	Checkbox,
	Button,
	Snackbar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
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

const AdminDash: React.FC = () => {
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
	const [alert, setAlert] = useState<{
		message: string;
		severity: "error" | "info" | "success" | "warning";
	}>({ message: "", severity: "info" });
	const [alertOpen, setAlertOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [authDialogOpen, setAuthDialogOpen] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const correctUsername = "admin";
	const correctPassword = "PSCms2017!";

	useEffect(() => {
		if (!authDialogOpen) {
			const fetchRegistrations = async () => {
				try {
					const response = await axios.get(
						"http://localhost:5000/api/registration/registrations"
					);
					setRegistrations(response.data);
				} catch (err) {
					setError("Failed to fetch registrations");
				} finally {
					setLoading(false);
				}
			};

			fetchRegistrations();
		}
	}, [authDialogOpen]);

	const columns = [
		{ label: "", accessor: "checkbox" },
		{ label: "First Name", accessor: "firstName" },
		{ label: "Last Name", accessor: "lastName" },
		{ label: "Email", accessor: "email" },
		{ label: "Phone", accessor: "phone" },
		{ label: "City", accessor: "city" },
		{ label: "State", accessor: "state" },
		{ label: "Year", accessor: "year" },
		{ label: "Make", accessor: "make" },
		{ label: "Model", accessor: "vehicleModel" },
		{ label: "Other Notes", accessor: "otherNotes" },
	];

	const handleCheckboxChange = (id: number) => {
		const newCheckedRows = new Set(checkedRows);
		if (newCheckedRows.has(id)) {
			newCheckedRows.delete(id);
		} else {
			newCheckedRows.add(id);
		}
		setCheckedRows(newCheckedRows);
	};

	const handleDelete = async () => {
		try {
			const idsToDelete = Array.from(checkedRows);

			await axios.post("http://localhost:5000/api/registration/delete", {
				ids: idsToDelete,
			});

			setRegistrations((prevRegistrations) =>
				prevRegistrations.filter(
					(registration) => !idsToDelete.includes(registration.id)
				)
			);
			setCheckedRows(new Set());
			setAlert({
				message: "Selected registrations deleted successfully.",
				severity: "success",
			});
			setAlertOpen(true);
		} catch (err) {
			setError("Failed to delete selected registrations.");
			setAlert({
				message: "Failed to delete selected registrations.",
				severity: "error",
			});
			setAlertOpen(true);
		}
		setDialogOpen(false);
	};

	const handleExport = (format: "csv" | "excel") => {
		const dataToExport = Array.from(checkedRows).length
			? registrations.filter((registration) => checkedRows.has(registration.id))
			: registrations;

		if (dataToExport.length === 0) {
			setAlert({
				message: "No data available for export.",
				severity: "warning",
			});
			setAlertOpen(true);
			return;
		}

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
		const rows = dataToExport.map((registration) => [
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
		]);

		const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

		if (format === "excel") {
			XLSX.writeFile(workbook, "registrations.xlsx");
		} else {
			XLSX.writeFile(workbook, "registrations.csv", { bookType: "csv" });
		}
		setAlert({
			message: `Data exported successfully as ${
				format === "excel" ? "Excel" : "CSV"
			}.`,
			severity: "success",
		});
		setAlertOpen(true);
	};

	const handleAuthSubmit = () => {
		if (username === correctUsername && password === correctPassword) {
			setAuthDialogOpen(false);
			setLoading(true);
		} else {
			setAlert({
				message: "Incorrect username or password.",
				severity: "error",
			});
			setAlertOpen(true);
		}
	};

	if (authDialogOpen) {
		return (
			<Dialog
				open={authDialogOpen}
				aria-labelledby="auth-dialog-title"
				aria-describedby="auth-dialog-description"
			>
				<DialogTitle id="auth-dialog-title">
					{"Authentication Required"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="auth-dialog-description">
						Please enter your username and password to access the admin
						dashboard.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="username"
						label="Username"
						type="text"
						fullWidth
						variant="standard"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						margin="dense"
						id="password"
						label="Password"
						type="password"
						fullWidth
						variant="standard"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAuthSubmit} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
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
				<Typography variant="h2" gutterBottom align="center">
					Registrations
				</Typography>
				<Container maxWidth="xl" sx={{ mt: 10 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 4,
							mx: 5,
						}}
					>
						<Button
							variant="contained"
							color="error"
							onClick={() => setDialogOpen(true)}
							disabled={checkedRows.size === 0}
						>
							Delete
						</Button>
						<Button variant="contained" onClick={() => handleExport("csv")}>
							Export
						</Button>
					</Box>
					<Paper elevation={5} sx={{ padding: "2rem", borderRadius: 2 }}>
						<TableContainer>
							<Table>
								<TableHead sx={{ bgcolor: "grey.200" }}>
									<TableRow>
										{columns.map((column) => (
											<TableCell key={column.label} sx={{ fontWeight: "bold" }}>
												{column.label}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{registrations.map((registration) => (
										<TableRow key={registration.id} hover>
											<TableCell padding="checkbox">
												<Checkbox
													checked={checkedRows.has(registration.id)}
													onChange={() => handleCheckboxChange(registration.id)}
												/>
											</TableCell>
											{columns.slice(1).map((column) => (
												<TableCell key={column.accessor}>
													{column.accessor === "otherNotes"
														? (() => {
																const value =
																	registration[
																		column.accessor as keyof Registration
																	];
																const text =
																	typeof value === "string"
																		? value
																		: String(value);
																const words = text?.split(" ") ?? [];
																return words.length > 15
																	? words.slice(0, 15).join(" ") + " ..."
																	: text;
														  })()
														: registration[
																column.accessor as keyof Registration
														  ]}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Container>
			</Box>
			<Snackbar
				open={alertOpen}
				autoHideDuration={6000}
				onClose={() => setAlertOpen(false)}
			>
				<Alert
					onClose={() => setAlertOpen(false)}
					severity={alert.severity}
					sx={{ width: "100%" }}
				>
					{alert.message}
				</Alert>
			</Snackbar>
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete the selected registrations?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AdminDash;
