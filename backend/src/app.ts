import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
