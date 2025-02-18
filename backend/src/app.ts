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
// 		origin: "http://localhost:5000/api/registration", // Frontend URL
// 		credentials: true,
// 		optionsSuccessStatus: 200,
// 	})
// );

// app.use(bodyParser.json());

// app.use("/api", routes);

// app.listen(port, () => {
// 	console.log(`Server is running on port ${port}`);
// });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow frontend to access backend
app.use(
	cors({
		origin: "http://localhost:5173", // ✅ Correct frontend URL
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

// ✅ Explicitly handle preflight requests
app.options("*", cors());

// ✅ Use built-in Express JSON parser instead of bodyParser
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
