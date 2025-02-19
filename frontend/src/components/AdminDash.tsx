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

	useEffect(() => {
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
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

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
			if (idsToDelete.length === 0) {
				alert("No registrations selected for deletion.");
				return;
			}

			await axios.post("http://localhost:5000/api/registration/delete", {
				ids: idsToDelete,
			});

			setRegistrations((prevRegistrations) =>
				prevRegistrations.filter(
					(registration) => !idsToDelete.includes(registration.id)
				)
			);
			setCheckedRows(new Set());
		} catch (err) {
			setError("Failed to delete selected registrations.");
		}
	};

	const handleExport = (format: "csv" | "excel") => {
		const dataToExport = Array.from(checkedRows).length
			? registrations.filter((registration) => checkedRows.has(registration.id))
			: registrations;

		if (dataToExport.length === 0) {
			alert("No data available for export.");
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
	};

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
							onClick={handleDelete}
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
		</>
	);
};

export default AdminDash;
