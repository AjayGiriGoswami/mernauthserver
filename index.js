const express = require("express");
const app = express();
const cors = require("cors");
const port = 2000;
require("./DB/Connection");
const userData = require("./Model/UserData");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const jwtsecertkey = "ajay2580ajay2580";
const nodemailer = require("nodemailer");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("server start");
});

// Singup api
app.post("/Signup", async (req, res) => {
  const { name, email, number, password } = req.body;
  //   console.log(req.body);
  try {
    const olduser = await userData.findOne({ email: email });
    const hashpassword = await bcrpt.hash(password, 10);
    if (olduser) {
      // user are existed
      res.json("existed");
    } else {
      userData.insertMany({
        name,
        email,
        number,
        password: hashpassword,
      });
      res.status(201).json({ status: 201 });
    }
  } catch (error) {
    console.log(error);
  }
});

// login api
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  try {
    const olduser = await userData.findOne({ email: email });
    if (!olduser) {
      // User is Not Existed
      res.json("Not Existed");
    } else {
      const match = await bcrpt.compare(password, olduser.password);
      if (!match) {
        res.json("Wrong Password");
      } else {
        const token = jwt.sign({ email: olduser.email }, jwtsecertkey, {
          expiresIn: "1d",
        });
        res.cookie("token", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });
        const result = {
          olduser,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {}
});

// ForgotPassword Api
app.post("/ForgotPassword", async (req, res) => {
  const { email } = req.body;
  //   console.log(req.body);
  try {
    const olduser = await userData.findOne({ email: email });
    if (!olduser) {
      res.json("Not Existed");
    } else {
      const token = jwt.sign({ id: olduser._id }, jwtsecertkey, {
        expiresIn: "1d",
      });
      const link = `http://localhost:3000/RestPassowrd/${olduser._id}/${token}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ajay124767@gmail.com",
          pass: "ezmf comm qsqx xqsc",
        },
      });

      const mailOptions = {
        from: "ajay124767@gmail.com",
        to: email,
        subject: "Rest Password Link",
        text: link,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({ status: 201 });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// RestPassword
app.post("/RestPassword/:id/:token", async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  //   console.log(req.body);
  try {
    const decode = await jwt.verify(token, jwtsecertkey);
    const id = decode.id;
    const hashpassword = await bcrpt.hash(password, 10);
    await userData.findByIdAndUpdate({ _id: id }, { password: hashpassword });
    res.status(201).json({ status: 201 });
  } catch (error) {
    res.json(404).json("expries");
  }
});

app.listen(port, () => {
  console.log("http://localhost:2000");
});
