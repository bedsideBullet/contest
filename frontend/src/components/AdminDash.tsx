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
	TablePagination,
} from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import AuthDialog from "./AuthDialog";

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
	const [authDialogOpen, setAuthDialogOpen] = useState(
		!sessionStorage.getItem("auth")
	);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredRegistrations, setFilteredRegistrations] = useState<
		Registration[]
	>([]);

	const correctUsername =
		import.meta.env.VITE_ADMIN_USERNAME || "defaultUsername";
	const correctPassword =
		import.meta.env.VITE_ADMIN_PASSWORD || "defaultPassword";

	useEffect(() => {
		if (!authDialogOpen) {
			const fetchRegistrations = async () => {
				try {
					const response = await axios.get(
						"http://localhost:5000/api/registration/registrations"
					);
					setRegistrations(response.data);
					setFilteredRegistrations(response.data);
				} catch (err) {
					setError("Failed to fetch registrations");
				} finally {
					setLoading(false);
				}
			};

			fetchRegistrations();
		}
	}, [authDialogOpen]);

	useEffect(() => {
		const filtered = registrations.filter((registration) =>
			`${registration.firstName} ${registration.lastName} ${registration.email} ${registration.phone}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
		setFilteredRegistrations(filtered);
	}, [searchQuery, registrations]);

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
		{ label: "Details", accessor: "details" },
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
			? filteredRegistrations.filter((registration) =>
					checkedRows.has(registration.id)
			  )
			: filteredRegistrations;

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

	const handleAuthSubmit = (username: string, password: string) => {
		if (username === correctUsername && password === correctPassword) {
			setAuthDialogOpen(false);
			setLoading(true);
			sessionStorage.setItem("auth", "true");
			return true;
		}
		return false;
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (authDialogOpen) {
		return (
			<AuthDialog
				open={authDialogOpen}
				username={username}
				password={password}
				setUsername={setUsername}
				setPassword={setPassword}
				onSubmit={handleAuthSubmit}
			/>
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
					top: 0,
					left: 0,
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "flex-start",
					width: "100vw",
					minHeight: "100vh",
					backgroundImage: "url('src/assets/untitled (26).png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					zIndex: -1,
					padding: "2rem",
				}}
			>
				<Typography variant="h2" gutterBottom align="center">
					Registrations
				</Typography>
				<Container maxWidth="xl">
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
					<TextField
						label="Search Name, Email, or Phone"
						fullWidth
						variant="outlined"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						sx={{
							mr: 2,
							mb: 2,
							bgcolor: "background.paper",
							borderRadius: 2,
						}}
					/>

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
									{filteredRegistrations
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((registration) => (
											<TableRow key={registration.id} hover>
												<TableCell padding="checkbox">
													<Checkbox
														checked={checkedRows.has(registration.id)}
														onChange={() =>
															handleCheckboxChange(registration.id)
														}
													/>
												</TableCell>
												{columns.slice(1, -1).map((column) => (
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
												<TableCell>
													<Link to={`/registration/${registration.id}`}>
														View details
													</Link>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={filteredRegistrations.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
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
