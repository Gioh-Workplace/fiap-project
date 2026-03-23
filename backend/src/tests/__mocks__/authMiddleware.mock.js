export const auth = (req, res, next) => {
  req.user = {
    id: "mock-user-id",
    role: req.headers["x-user-role"] || "aluno",
  };
  next();
};