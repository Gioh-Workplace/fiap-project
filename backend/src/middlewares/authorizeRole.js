import { errorResponse } from "../utils/apiResponse.js";

function authorizeRole(...rolesPermitidos) {
    return (req, res, next) => {
      if (!rolesPermitidos.includes(req.user.role)) {
        return errorResponse(res, 403, "Acesso negado.");
      }
      next();
    };
  }

  export default authorizeRole;
  