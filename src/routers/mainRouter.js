import express from "express";
import { gltfLoader, home, objLoader } from "../controllers/mainController";
import routes from "../routes";

const mainRouter = express.Router();

mainRouter.get(routes.home, home);
mainRouter.get(routes.objLoader, objLoader);
mainRouter.get(routes.gltfLoader, gltfLoader);

export default mainRouter;
