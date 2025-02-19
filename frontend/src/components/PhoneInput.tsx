import React, { useState } from "react";
import { TextField, FormHelperText, FormControl } from "@mui/material";

interface PhoneInputProps {
	value: string;
	onChange: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
	const [error, setError] = useState<boolean>(false);

	const validatePhoneNumber = (number: string) => {
		const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
		return phoneRegex.test(number);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;

		const cleaned = input.replace(/\D/g, "");
		const formatted = cleaned
			.replace(/^(\d{3})(\d{3})(\d{4}).*/, "($1) $2-$3")
			.slice(0, 14);

		onChange(formatted);

		if (formatted.length === 14 && validatePhoneNumber(formatted)) {
			setError(false);
		} else {
			setError(true);
		}
	};

	return (
		<FormControl fullWidth error={error}>
			<TextField
				label="Phone Number"
				value={value}
				onChange={handleChange}
				placeholder="(123) 456-7890"
				required
			/>
			{error && <FormHelperText>Invalid phone number format.</FormHelperText>}
		</FormControl>
	);
};

export default PhoneInput;
