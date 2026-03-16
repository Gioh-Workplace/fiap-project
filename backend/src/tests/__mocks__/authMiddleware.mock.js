export const mockAuth = (req, res, next) => {
    req.user = { role: req.headers["x-user-role"] };
    next();
  };
  