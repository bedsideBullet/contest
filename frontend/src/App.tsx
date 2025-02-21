import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDash from "./components/AdminDash";
import RegistrationForm from "./components/RegistrationForm";
import RegistrationDetail from "./components/RegistrationDetail"; // Import the RegistrationDetail component

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<RegistrationForm />} />
				<Route path="/admin" element={<AdminDash />} />
				<Route path="/registration/:id" element={<RegistrationDetail />} />{" "}
				{/* Add this route */}
			</Routes>
		</Router>
	);
};

export default App;
