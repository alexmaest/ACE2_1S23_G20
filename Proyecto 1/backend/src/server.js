import express from "express";
import cors from "cors";
import body from "body-parser";
import { registerUser, loginUser } from "./hooks/useQuerys.js";

const app = express();

app.use(body.urlencoded({ extended: false }));
app.use(body.json());
const port = 3555;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/register", async (req, res) => {
  const { username, fullname, password } = req.body;

  const _registerUser = await registerUser(username, fullname, password);

  console.log({ _registerUser });

  res.send({ message: "User registered" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const _loginUser = await loginUser(username, password);

  if (_loginUser.length > 0) {
    return res.status(200).send({
      id: _loginUser[0].user_id,
      name: _loginUser[0].username,
      fullname: _loginUser[0].fullname,
    });
  }

  return res.status(400).send({ message: "Invalid password or username" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
