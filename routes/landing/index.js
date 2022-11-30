import { Router } from "express";
import csurf from "csurf-expire";
const csrfProtection = csurf({ cookie: { maxAge: 60 * 60 * 8 } });
import {
  landingPage,
  forgotPassword,
} from "../../controllers/landing/index.js";
import { signedOut } from "../../middleware/AuthMiddleware.js";

const home = Router();

// home route
home.route("/").get(signedOut, csrfProtection, landingPage);

home.route("/forgotpassword").get(signedOut, forgotPassword);

export default home;
