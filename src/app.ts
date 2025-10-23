import express, {Application} from "express";
import indexRoute from "./routes/index";
import helloRoute from "./routes/hello";

const app: Application = express();

app.use(express.json());

app.use("/", indexRoute);
app.use("/hello", helloRoute);

export default app;
