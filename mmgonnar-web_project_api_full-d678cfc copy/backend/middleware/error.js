module.exports = (err, req, res, next) => {
  const statusCode = err.status || 500;

  const reqType = req.type === "user" ? "user" : "card";

  const errorMessages = {
    user: {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
    },
    card: {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
    },
  };

  const message = errorMessages[reqType][statusCode] || "Internal Server Error";

  res.status(statusCode).json({ message });
};
