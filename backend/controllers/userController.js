/* get User require from user model */
const User = require("../models/UserModel");
const { hashPassword } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken")


const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("user exists");
    } else {
      /* 用hashedPasswrod把password加密 */
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      res
      /* cookie以后用户用这个访问过来 */
        .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        })
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
    try {
      const { email, password, doNotLogout } = req.body;
      if (!(email && password)) {
        return res.status(400).send("All inputs are required");
      }
      
      /* find one user, if user found then, do something， else：没有found 就回复wrong credentials */
      const user = await User.findOne({ email });
      if (user) {
        // to do: compare passwords
        let cookieParams = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        };
  
        /* 如果dont logout被勾选了，就overwrite.  如果勾选了，就设置7天不用login。下面是计算从1ms开始 */
        if (doNotLogout) {
          cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 1000=1ms
        }
  
        return res.cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        ).json({
            success: "user logged in",
            userLoggedIn: { _id: user._id, name: user.name, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, doNotLogout }
        });
      } else {
         return res.status(401).send("wrong credentials") 
      }
    } catch (err) {
      next(err);
    }
  };

module.exports = { getUsers, registerUser, loginUser };

