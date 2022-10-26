import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { dlog, log, stringify } from "../../custom_modules/index.js";
const logger = bunyan.createLogger({ name: "Landing Controller" });

// @desc        Home page
// @route       GET /
// @access      Public
export const landingPage = asyncHandler(async (req, res) => {
  logger.info(`GET /`);

  log(`Route /\n${req}\n`);

  try {
    req.flash("success_msg", "Hey there");
    res.render("home/home", {
      title: process.env.SITE_NAME || "RMT",
      signedin: false,
      landing: true,
      csrfToken: req.csrfToken,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
});
