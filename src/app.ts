import express, {Application} from "express";
import indexRoute from "./routes/index";
import helloRoute from "./routes/hello";
import aircraftRoutes from "./routes/aircraft";
import organizationRoutes from "./routes/organization";

import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/", indexRoute);
app.use("/hello", helloRoute);

app.use("/aircraft", aircraftRoutes);
app.use("/organization", organizationRoutes);

export default app;
