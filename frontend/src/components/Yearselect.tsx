import React from "react";
import {
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	SelectChangeEvent,
} from "@mui/material";

interface YearSelectProps {
	value: string;
	onChange: (value: string) => void;
}

const YearSelect: React.FC<YearSelectProps> = ({ value, onChange }) => {
	const years = Array.from(
		{ length: 2025 - 1951 + 1 },
		(_, index) => 1951 + index
	);

	const handleChange = (event: SelectChangeEvent<string>) => {
		onChange(event.target.value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id="vehicle-year">Vehicle Year</InputLabel>
			<Select
				labelId="vehicle-year"
				id="vehicle-year"
				value={value}
				label="Vehicle Year"
				onChange={handleChange}
				required
			>
				{years.map((year) => (
					<MenuItem key={year} value={year}>
						{year}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default YearSelect;
