//site key 6LdzB6YUAAAAAOu9AopfhgQsIhJ8e3_2Ee0Sl7Im
//secret key 6LdzB6YUAAAAAOrbWUyfZatE3FNogvUI3f_-qUy1

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/subscribe", (req, res) => {
  console.log(req.body);

  if (req.body.captcha === undefined && !req.body.captcha)
    return res.json({
      message: "please provide recatcha"
    });
  const secretKey = "6LdzB6YUAAAAAOrbWUyfZatE3FNogvUI3f_-qUy1";
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${
    req.body.captcha
  }&remoteip={req.connection.remoteAddress}`;

  request(verifyUrl, (err, response, body) => {
    if (err) throw err;
    if (response.statusCode !== 200) {
      return res.status(404).json({
        message: "something went wrong"
      });
    }
    const bodyJson = JSON.parse(body);

    console.log(bodyJson);

    if (bodyJson.success != true && !bodyJson.success) {
      return res.status(400).json({
        message: "failed..."
      });
    }

    return res.json({ message: "success" });
  });
});

app.listen(8000, () => {
  console.log(`server is running at 8000`);
});
