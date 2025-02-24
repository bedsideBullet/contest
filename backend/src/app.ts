// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import routes from "./routes";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(
// 	cors({
// 		origin: "https://contest-1.onrender.com/",
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
const port = process.env.PORT || 5000;

app.use(
	cors({
		origin: "https://contest-1.onrender.com",
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.options("*", cors());

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api", routes);

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
