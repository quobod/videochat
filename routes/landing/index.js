import { Router } from "express";
import csurf from "csurf-expire";
const csrfProtection = csurf({ cookie: { maxAge: 60 * 60 * 8 } });
import { landingPage } from "../../controllers/landing/index.js";
import { signedOut } from "../../middleware/AuthMiddleware.js";

const home = Router();

// home route
home.route("/").get(signedOut, csrfProtection, landingPage);

export default home;
