import { Router } from "express";
import movieController from "../controllers/movie";
import userController from "../controllers/user";
import passport from "passport";

const router = Router();

// Route to get the movies
router.get("/list", movieController.getMoviesList);

// Route to get a movie by id
router.get("/find/:id", movieController.getMovieById);

// Route to add movies
router.post("/add", passport.authenticate("jwt", { session: false }), movieController.addMovie);

// Route to update movies
router.post("/update/:id", passport.authenticate("jwt", { session: false }), movieController.updateMovie);

// Route to delete movies
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), movieController.deleteMovie);

// Route to register user
router.post("/register", userController.processRegisterPage);

// Route to login user
router.post("/login", userController.processLogin);

// Route to logout user
router.get("/logout", userController.processLogout);

export default router;
