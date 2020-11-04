"use strict";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./routes";
import mainRouter from "./routers/mainRouter";

const app = express();

app.use(helmet());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(routes.home, mainRouter);

export default app;
