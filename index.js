const { validateEmail, checkPassword, validateName } = require("./validations");

const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bcrypt = require("bcrypt"),
      bodyParser = require("body-parser");

const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/webassignment8", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  joined: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

// Home Page
app.get("/", (req, res) => {
  res.send("Welcome to Assignment 8 - INFO6150.");
});

// Create new user
app.post("/user/create", async (req, res) => {

  try {

    let user = await User.findOne({ email: req.body.email });
    let passBool, emailBool, nameBool = false;

    if (user) {
      res.status(400).send({ message: "Email Address already exists." });
    } else {

      if (validateEmail(req.body.email)) {
        // console.log("Proper email address");
        emailBool = true;
      } else {
        emailBool = false;
        res.status(400).send({ message: "Please input email address correctly!"});
      }

      if (checkPassword(req.body.password)) {
        passBool = true;
        // console.log("Password is correct");
      } else {
        passBool = false;
        res.status(400).send({ message: "Please input password correctly!"});
      }

      if (validateName(req.body.name)) {
        nameBool = true;
        // console.log("Password is correct");
      } else {
        nameBool = false;
        res.status(400).send({ message: "Please input name correctly!"});
      }
      if (passBool && emailBool) {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const innerResult = await User.create({
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          user_type: req.body.user_type
        });
        res.status(201).send(innerResult);
      }   
    }    
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error Occurred!"});
  }

});

// Update user details


app.put('/user/edit', async (req, res) => {
 

  const { name, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user details
  user.name = name;
  user.password = await bcrypt.hash(password, 10);

  try {
    await user.save();
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get all users
app.get("/user/getAll", async (req, res) => {
  console.log("Get called");
 const users = await User.find({});

      users.forEach(user => delete user.password);
      const newResult = users.map(item => {
        return {
          id: item._id,
          email: item.email,
          password: item.password,
          name: item.name
        }
      })
      res.status(200).send(newResult);
      console.log('getting');
  });
  


 

// Delete user
app.delete("/user/delete", async (req, res) => {
  console.log("Delete called")
  const user = await User.findOne({email: req.body.email});

  if (user) {
      User.findByIdAndDelete(user._id)
        .then(item => {
          if (!item) {
            res.status(404).send({
              message: `Cannot delete User with email=${user.email}. User not found!`
            });
          } else {
            res.send({
              message: `User with email id ${user.email} was deleted successfully!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete User with email=" + user.email
          });
        });
    
  } else {
    res.status(404).send({
      message: `User was not found! Please check the email address.`
    });
  }
});



app.listen(3333, () => {
  console.log("Server started at port 3333");
});