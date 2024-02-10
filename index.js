import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Enable cors at the server side.
const corsOption = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));
mongoose
  .connect("mongodb://localhost:27017/PortfolioDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
const userSchema = new mongoose.Schema({
  username: String,
  register: String,
  phone: Number,
  address: String,
  email: String,
  password: String,
  cpassword: String,
});
const User = new mongoose.model("User", userSchema);
//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successful ✅", user: user });
        } else {
          res.send({ message: "Email & Password didn't match ❌" });
        }
      } else {
        res.send({ message: "User not Found ❌" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/register", (req, res) => {
  const { username, register, phone, address, email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send({ message: "User Already Registered ❌" });
      } else {
        const user = new User({
          username,
          register,
          phone,
          address,
          email,
          password,
        });
        user
          .save()
          .then(() => {
            res.send({ message: "Registration Successful ✅" });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.listen(9002, () => {
  console.log("Be started at port 9002");
});
