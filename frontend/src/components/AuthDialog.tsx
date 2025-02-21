import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
} from "@mui/material";

interface AuthDialogProps {
	open: boolean;
	username: string;
	password: string;
	setUsername: (value: string) => void;
	setPassword: (value: string) => void;
	onSubmit: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
	open,
	username,
	password,
	setUsername,
	setPassword,
	onSubmit,
}) => {
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter") {
			onSubmit();
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
				<Button onClick={onSubmit} color="primary">
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AuthDialog;
