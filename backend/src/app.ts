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
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "10000", 10);

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.options("*", cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../dist")));

app.use("/api", routes);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
