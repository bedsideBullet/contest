import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDash from "./components/AdminDash";
import RegistrationForm from "./components/RegistrationForm";

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<RegistrationForm />} />
				<Route path="/admin" element={<AdminDash />} />
			</Routes>
		</Router>
	);
};

export default App;
