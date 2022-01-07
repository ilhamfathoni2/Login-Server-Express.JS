const { user } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExist) {
      return res.status(400).send({
        status: "failed",
        message: "email already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedpassword,
      phone: req.body.phone,
      address: req.body.address,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.TOKEN_KEY
    );

    res.status(200).send({
      status: "success",
      data: {
        id: newUser.id,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Register Failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (userExist) {
      const isValid = await bcrypt.compare(
        req.body.password,
        userExist.password
      );

      if (!isValid) {
        return res.status(400).send({
          status: "failed",
          message: "credential is invalid",
        });
      }

      const token = jwt.sign(
        { id: userExist.id, email: userExist.email },
        process.env.TOKEN_KEY
      );

      res.status(200).send({
        status: "success",
        data: {
          id: userExist.id,
          token,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const dataUser = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    const token = jwt.sign(
      { id: dataUser.id, email: dataUser.email },
      process.env.TOKEN_KEY
    );

    res.send({
      status: "success",
      data: {
        id: dataUser.id,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const data = await user.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      message: "Get data user success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { idUser } = req.user;
    const { id } = req.params;

    await user.destroy({
      where: {
        id,
      },
      idUser,
    });
    const data = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      message: "Delete user success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await user.update(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      },

      {
        where: {
          id: req.user.id,
        },
      }
    );
    const data = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      message: "Update success",
      datas: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
