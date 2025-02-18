import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./api/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
