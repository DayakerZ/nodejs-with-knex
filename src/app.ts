import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "yaml";
import * as path from "path";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

const swaggerFilePath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = yaml.parse(fs.readFileSync(swaggerFilePath, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world from node js with typescript",
  });
});

app.listen(port, () => {
  console.log("listening on Port :", port);
});
