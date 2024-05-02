import userModel from "../features/user/user.model.js";

export const basicAuthorizer = (req, res, next) => {
  // check if authorizer header is empty
  const authHeader = req.header("Authorization");
  console.log(authHeader);
  if (!authHeader) res.status(401).send("No  authorization details found");
  const base64cred = authHeader.split(" ")[1];
  console.log(base64cred);

  // decode credentials
  const decodeCreds = Buffer.from(base64cred, "base64").toString("utf8");
  console.log(decodeCreds);
  const creds = decodeCreds.split(":");

  const user = userModel
    .getAll()
    .find((u) => u.email == creds[0] && u.password == creds[1]);
  if (user) next();
  else return res.status(401).send("Incorrect Credentials");
};
