// Please don't change the pre-written code
// Import the necessary modules here
import fs from "fs";
// Write your code here
async function log(logData) {
  try {
    logData = `\n${new Date().toString()}\n${logData}`;
    const fsPromises = fs.promises;
    await fsPromises.appendFile("log.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

export const loggerMiddleware = async (req, res, next) => {
  // Write your code here
  const logData = `req URL: ${req.originalUrl}\nreqBody: ${JSON.stringify(
    req.body
  )}\n`;
  await log(logData);
  next();
};
export default loggerMiddleware;
