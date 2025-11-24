// Load environment variables first
require('dotenv').config();

import express, {Application} from "express";
import indexRoute from "./routes/index";
import helloRoute from "./routes/hello";
import aircraftRoute from "./routes/aircraft";
import organizationRoute from "./routes/organization";

var cors = require('cors')

const app: Application = express();

app.use(express.json());
app.use(cors()); 

app.use("/", indexRoute);
app.use("/hello", helloRoute);
app.use("/api", aircraftRoute);
app.use("/api", organizationRoute);

export default app;
