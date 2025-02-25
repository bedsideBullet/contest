// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import routes from "./routes";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// app.use(
// 	cors({
// 		origin: process.env.FRONTEND_URL,
// 		credentials: true,
// 		optionsSuccessStatus: 200,
// 	})
// );

// app.options("*", cors());

// app.use(express.json());

// app.use("/api", routes);

// app.listen(port, () => {
// 	console.log(`Server is running on port ${port}`);
// });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // Not strictly needed since express.json() covers this
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000; // Render sets PORT, no need to parse explicitly

// CORS configuration
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "https://contestfront.onrender.com", // Default to deployed URL
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.options("*", cors());

app.use(express.json());

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, "dist"))); // Assumes dist is in the same dir as server.js in deployment

// API routes
app.use("/api", routes);

// Catch-all route for SPA
app.get("*", (req, res) => {
	console.log(`Serving index.html for ${req.path}`); // Debug log
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Listen on 0.0.0.0 for Render compatibility
app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
