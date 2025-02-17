import React from "react";
import {
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	SelectChangeEvent,
} from "@mui/material";

interface StateSelectProps {
	value: string;
	onChange: (value: string) => void;
}

const StateSelect: React.FC<StateSelectProps> = ({ value, onChange }) => {
	const usStates = [
		"Alabama",
		"Alaska",
		"Arizona",
		"Arkansas",
		"California",
		"Colorado",
		"Connecticut",
		"Delaware",
		"Florida",
		"Georgia",
		"Hawaii",
		"Idaho",
		"Illinois",
		"Indiana",
		"Iowa",
		"Kansas",
		"Kentucky",
		"Louisiana",
		"Maine",
		"Maryland",
		"Massachusetts",
		"Michigan",
		"Minnesota",
		"Mississippi",
		"Missouri",
		"Montana",
		"Nebraska",
		"Nevada",
		"New Hampshire",
		"New Jersey",
		"New Mexico",
		"New York",
		"North Carolina",
		"North Dakota",
		"Ohio",
		"Oklahoma",
		"Oregon",
		"Pennsylvania",
		"Rhode Island",
		"South Carolina",
		"South Dakota",
		"Tennessee",
		"Texas",
		"Utah",
		"Vermont",
		"Virginia",
		"Washington",
		"West Virginia",
		"Wisconsin",
		"Wyoming",
	];

	const handleChange = (event: SelectChangeEvent<string>) => {
		onChange(event.target.value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id="us-state-select-label">Select a State</InputLabel>
			<Select
				labelId="us-state-select-label"
				id="us-state-select"
				value={value}
				label="Select a State"
				onChange={handleChange}
				required
			>
				{usStates.map((state) => (
					<MenuItem key={state} value={state}>
						{state}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default StateSelect;
