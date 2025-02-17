import React from "react";
import {
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	SelectChangeEvent,
} from "@mui/material";

interface MakeSelectProps {
	value: string;
	onChange: (value: string) => void;
}

const MakeSelect: React.FC<MakeSelectProps> = ({ value, onChange }) => {
	const vehicleMakes = [
		"Acura",
		"BMW",
		"Buick",
		"Cadillac",
		"Chevrolet",
		"Chrysler",
		"Dodge",
		"Ford",
		"GMC",
		"Honda",
		"Jeep",
		"Lincoln",
		"Ram",
		"Toyota",
	];

	const handleChange = (event: SelectChangeEvent<string>) => {
		onChange(event.target.value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id="vehicle-make-select-label">
				Select a Vehicle Make
			</InputLabel>
			<Select
				labelId="vehicle-make-select-label"
				id="vehicle-make-select"
				value={value}
				label="Select a Vehicle Make"
				onChange={handleChange}
				required
			>
				{vehicleMakes.map((make) => (
					<MenuItem key={make} value={make}>
						{make}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default MakeSelect;
