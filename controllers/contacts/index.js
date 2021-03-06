import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { body, check, validationResult } from "express-validator";
import twilio from "twilio";
import { customAlphabet } from "nanoid";
import {
  cap,
  stringify,
  dlog,
  tlog,
  log,
  size,
} from "../../custom_modules/index.js";
import Contact from "../../models/Contacts.js";
import User from "../../models/UserModel.js";
import { create } from "../../custom_modules/captcha.js";

const logger = bunyan.createLogger({ name: "User Controller" });

//  @desc          Get contacts
//  @route         GET /contacts
//  @access        Private
export const getContacts = asyncHandler(async (req, res) => {
  logger.info(`GET: /contacts`);

  try {
    const user = req.user.withoutPassword();
    user.fname = cap(user.fname);
    user.lname = cap(user.lname);

    // console.log(user);
    dlog(`\n\n`);

    Contact.find()
      .sort({ fname: "asc" })
      .where("owner")
      .equals(`${user._id}`)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        /*  console.log(
          `\n\n\tContacts: ${typeof docs}\n\t${stringify(docs)}\n\tSize: ${size(
            docs
          )}\n\n`
        ); */
        res.render("contact/contacts", {
          title: `Contacts`,
          user: user,
          csrfToken: req.csrfToken,
          hasContacts: size(docs) > 0,
          contacts: docs,
          multicontact: true,
        });
      });
  } catch (err) {
    tlog(err);
    res.redirect("/user");
  }
});

//  @desc          Get contacts count
//  @route         GET /contacts/count
//  @access        Private
export const getContactCount = asyncHandler(async (req, res) => {
  logger.info(`GET: /contacts/count`);

  try {
    const user = req.user.withoutPassword();
    user.fname = cap(user.fname);
    user.lname = cap(user.lname);

    // console.log(user);
    dlog(`\n\n`);

    Contact.find()
      .sort({ fname: "asc" })
      .where("owner")
      .equals(`${user._id}`)
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        /*  console.log(
          `\n\n\tContacts: ${typeof docs}\n\t${stringify(docs)}\n\tSize: ${size(
            docs
          )}\n\n`
        ); */
        return res.json({ status: true, contacts: docs });
      });
  } catch (err) {
    tlog(err);
    return res.json({ status: false, cause: `${err.cause}` });
  }
});

//  @desc           Add new contact
//  @route          POST /contacts/add
//  @access         Private
export const addNewContact = asyncHandler(async (req, res) => {
  logger.info(`POST: /contacts/add`);

  const { fname, lname, email, phone } = req.body;

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // logger.error(`Registration Failure: ${JSON.stringify(result.array())}`);

    const err = result.array();
    const arrResult = [];

    for (const e in err) {
      const objE = err[e];
      const arrObjE = objE.split(":");
      const head = arrObjE[0];
      const value = arrObjE[1];
      const key = head.replace("body", "").replace("[", "").replace("]", "");
      const newObj = {};
      newObj[`${key}`] = value;
      arrResult.push(newObj);
    }

    // console.log(`${stringify(arrResult)}\n`);

    return res.render("contact/contacts", {
      title: "Error",
      error: true,
      errors: arrResult,
      csrfToken: req.csrfToken,
      dashboard: true,
    });
  } else {
    const { fname, lname } = req.body;
    const user = req.user.withoutPassword();
    const data = req.body;
    const emails = [];
    const phones = [];

    for (const d in data) {
      const objD = data[d];
      if (d.toLowerCase().trim().startsWith("email")) {
        emails.push(objD);
      } else if (d.toLowerCase().trim().startsWith("phone")) {
        phones.push(objD);
      }
    }

    const newContact = new Contact({
      emails,
      phones,
      fname,
      lname,
      owner: user._id,
    });

    newContact
      .save()
      .then((doc) => {
        // console.log("\n\tNew contact " + doc);

        res.redirect("/contacts");
      })
      .catch((err) => {
        console.log(err);

        res.redirect("/contacts");
      });

    /*  User.findOne({ email: `${email}` })
       .then((user) => {
         if (user == null) {
           const newUser = new User({
             email,
             password: pwd,
             fname,
             lname,
           });

           newUser
             .save()
             .then((doc) => {
               res.redirect("/auth/signin");
             })
             .catch((err) => {
               console.log(err);
               res.redirect("/auth/register");
             });
         }
       })
       .catch((err) => {
         console.log(err);
         res.status(200).json({ error: err });
       }); */
  }
});

//  @desc           Search contacts by keyword
//  @route          POST /contacts/search
//  @access         Private
export const searchContacts = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/contacts/search`);
  const { searchKey } = req.body;
  const user = req.user;

  // console.log(`\n\tSearcing by keyword: ${searchKey}`);

  Contact.find(
    {
      $or: [
        { emails: { $in: `${searchKey}` } },
        { fname: `${searchKey}` },
        { lname: `${searchKey}` },
        { phones: { $in: `${searchKey}` } },
      ],
    },
    (err, docs) => {
      if (err) {
        log(`\n\tError`);
        log(err);
        log(`\n\n`);

        res.render("user/dashboard", {
          title: `Dashboard`,
          user: user,
          csrfToken: req.csrfToken,
          error: true,
          errors: err,
        });
      }
      // log(`\n`);
      // dlog(docs);
      // log(`\n`);

      res.render("user/dashboard", {
        title: `Dashboard`,
        user: user,
        csrfToken: req.csrfToken,
        hasContacts: docs.length > 0,
        contacts: docs,
        dashboard: true,
      });
    }
  );
});

//  @desc           View single contact
//  @route          GET /contacts/view/contact/:contactId
//  @access         Private
export const viewContact = asyncHandler(async (req, res) => {
  logger.info(`GET: /contacts/view/contact/:contactId`);

  const { contactId } = req.params;

  // dlog(`\n\tViewing contact ID: ${contactId}\n`);

  Contact.findOne({ _id: contactId }, (err, doc) => {
    if (err) {
      tlog(err);
      res.redirect(`/contacts`);
    } else {
      // dlog(doc);

      res.render("contact/contact", {
        doc: doc,
        csrfToken: req.csrfToken,
        title: doc.fname,
        contactid: doc._id,
        user: true,
        singlecontact: true,
      });
    }
  });
});

//  @desc           Edit single contact
//  @route          POST /contacts/edit/contact/:contactId
//  @access         Private
export const editContact = asyncHandler(async (req, res) => {
  logger.info(`POST: /contacts/edit/contact/:contactId`);
  // log(`\n\tEditing contact\n`);

  const data = req.body;
  const contactid = req.body.contactid;
  const fname = data.fname;
  const lname = data.lname;

  let emails = [],
    phones = [];

  dlog(`\n\n`);

  for (const d in data) {
    const objD = data[d];
    if (d.toLowerCase().trim().startsWith("email")) {
      emails.push(objD);
    } else if (d.toLowerCase().trim().startsWith("phone")) {
      phones.push(objD);
    }
  }

  const updatedData = {
    fname: fname,
    lname: lname,
    emails: emails,
    phones: phones,
  };

  log(`\n\t\tSubmitted Data`);
  // log(updatedData);
  // log(`\n\n`);

  const updateOptions = {
    upsert: true,
    new: true,
    overwrite: false,
  };

  Contact.findOneAndUpdate(
    { _id: `${contactid}` },
    updatedData,
    updateOptions,
    (err, doc) => {
      if (err) {
        log(`\n\n\t\tError`);
        tlog(err);
      }

      // log(`\n\tUpdated Document`);
      // log(doc);
      res.redirect("/contacts");
    }
  );
});

//  @desc           Delete single contact
//  @route          GET /contacts/delete/contact/:contactId
//  @access         Private
export const deleteContact = asyncHandler(async (req, res) => {
  logger.info(`GET: /contacts/delete/contact/:contactId`);

  const { contactId } = req.params;

  log(`\n\tDeleting contact ID: ${contactId}\n`);

  Contact.deleteOne({ _id: `${contactId}` }, (err, results) => {
    if (err) {
      dlog(`Error deleting document: ${contactId}`);
      dlog(err);
      return res.json({ status: false });
    }
    return res.json({ status: true, results });
  });
});
