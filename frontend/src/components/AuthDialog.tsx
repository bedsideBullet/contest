import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
	Alert,
	Snackbar,
} from "@mui/material";

interface AuthDialogProps {
	open: boolean;
	username: string;
	password: string;
	setUsername: (value: string) => void;
	setPassword: (value: string) => void;
	onSubmit: (username: string, password: string) => boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
	open,
	username,
	password,
	setUsername,
	setPassword,
	onSubmit,
}) => {
	const [alert, setAlert] = useState<{
		message: string;
		severity: "error" | "info" | "success" | "warning";
	}>({ message: "", severity: "info" });
	const [alertOpen, setAlertOpen] = useState(false);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};

	const handleSubmit = () => {
		const success = onSubmit(username, password);
		if (!success) {
			setAlert({
				message: "Incorrect username or password.",
				severity: "error",
			});
			setAlertOpen(true);
		}
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="auth-dialog-title"
			aria-describedby="auth-dialog-description"
			onKeyDown={handleKeyDown}
		>
			<DialogTitle id="auth-dialog-title">
				{"Authentication Required"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="auth-dialog-description">
					Please enter your username and password to access the admin dashboard.
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
				<Button onClick={handleSubmit} color="primary">
					Submit
				</Button>
			</DialogActions>
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
		</Dialog>
	);
};

export default AuthDialog;
