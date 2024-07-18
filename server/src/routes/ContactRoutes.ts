import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware";
import { searchContacts } from "../controllers/ContactsController";

const contatRoutes = Router();

contatRoutes.post("/search", verifyToken, searchContacts);

export default contatRoutes;
