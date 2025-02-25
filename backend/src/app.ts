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
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "10000", 10);

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "https://contestfront.onrender.com",
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.options("*", cors());
app.use(express.json());

// Serve static files from build folder
app.use(express.static(path.join(__dirname, "../build")));

// API routes
app.use("/api", routes);

// Catch-all route for SPA
app.get("*", (req, res) => {
	const filePath = path.join(__dirname, "../build/index.html");
	console.log(`Serving: ${filePath}`); // Debug log
	res.sendFile(filePath);
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
