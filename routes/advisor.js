const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Advisor = require("../model/Advisor");

/**
 * @method - POST
 * @param - /admin/advisor
 * @description - Adding advisor
 */

router.post(
  "/advisor",
  [
    check("advisorName", "Please Enter a Valid Advisor name").not().isEmpty(),
    check("photoUrl", "Please enter a valid url").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { advisorName, photoUrl } = req.body;

    try {
      let advisor = await Advisor.findOne({
        advisorName,
      });
      if (advisor) {
        return res.status(400).json({
          msg: "Advisor Already Exists",
        });
      }

      advisor = new Advisor({
        advisorName,
        photoUrl,
      });

      await advisor.save((err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          console.log("Advisor succesfully added");
          res.status(200).send("Advisor succesfully added");
        }
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

module.exports = router;
