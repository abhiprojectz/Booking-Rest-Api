const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/User");
const Advisor = require("../model/Advisor");
const auth = require("../middleware/auth");

/**
 * @method - POST
 * @param - /register
 * @description - User register
 */

router.post(
  "/register",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let userId = user.id;

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            userId,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving!");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User login
 */

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      let userId = user.id;

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
            userId,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get List of all advisors
 * @param - /<user-id>/advisor
 */

router.get("/:userid/advisor", async (req, res) => {
  var uid = req.params.userid;

  try {
    console.log(uid);

    const user = await User.findById(uid, (err, result) => {
      if (err) {
        return res.status(400).send("User Not Exist");
      } else {
        Advisor.find({}, function (err, advisors) {
          var advisorMap = {};

          advisors.forEach(function (advisor) {
            advisorMap[advisor._id] = advisor;
          });

          return res.status(200).send(advisorMap);
        });

        // res.json(result);
        // return res.status(200).send("User found!!");
      }
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/**
 * @method - POST
 * @description - Can book a call with an advisor
 * @param - /user/<user-id>/advisor/<advisor-id>
 */

router.post("/:userid/advisor/:advisorid", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  var uid = req.params.userid;
  var bookedAdvisor = req.params.advisorid;
  const { bookingTime } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      uid,
      {
        $addToSet: {
          bookedAdvisors: {
            bookedAdvisor: bookedAdvisor,
            bookingTime: bookingTime,
          },
        },
      },
      {
        new: true,
      },

      (err, result) => {
        if (err) {
          // res.send(err);
          console.log(err);
          return res.status(400).send("User Not Exist");
        } else {
          console.log("Booking with advisor succesfully added.");
          return res
            .status(200)
            .send("Booking with advisor succesfully added.");
        }
      }
    );
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/**
 * @method - GET
 * @description - Get list of all booking time
 * @param - /<user:id>/advisor/booking
 */

router.get(
  "/:userid/advisor/booking",

  [check("bookingTime", "Please enter a valid date.").isDate()],

  async (req, res) => {
    var uid = req.params.userid;

    try {
      console.log(uid);

      const user = await User.findById(uid, (err, result) => {
        if (err) {
          return res.status(400).send("User Not Exist");
        }
      })
        .populate("bookedAdvisors.bookedAdvisor")
        .exec(function (err, data) {
          if (err) throw err;
          console.log(data.bookedAdvisors);
          res.status(200).json(data.bookedAdvisors);
        });
    } catch (e) {
      res.status(500).send({ message: "Error in Fetching all bookings" });
    }
  }
);

module.exports = router;
