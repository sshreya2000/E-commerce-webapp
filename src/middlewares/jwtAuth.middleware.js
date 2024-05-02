import jwt from "jsonwebtoken";
export const jwtAuthorizer = (req, res, next) => {
  console.log(req.headers);
  // check if authorizer header is empty
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader)
    return res.status(401).send("No  authorization details found");
  // decode credentials
  const decodeCreds = jwt.verify(
    authHeader,
    "Ejo3TcEx2iQQpwgRkF43XprlNfRUZGVK",
    (err, decoded) => {
      if (err) return res.status(403).send("Incorrect Credentials");
      console.log(decoded);
      req.userID = decoded.userID;
      next();
    }
  );
};
