import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
	cors({
		origin: "https://contest-1.onrender.com/",
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.options("*", cors());

app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
