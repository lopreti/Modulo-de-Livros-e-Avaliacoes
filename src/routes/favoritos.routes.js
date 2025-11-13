import express from "express";
import * as favoritosController from "../controllers/favoritos.controller.js";

const router = express.Router();

router.get("/", favoritosController.listarFavoritos);
router.get("/usuario/:id", favoritosController.listarFavoritosUsuario);
router.post("/", favoritosController.criarFavorito);
router.delete("/:id", favoritosController.excluirFavorito);

export default router;