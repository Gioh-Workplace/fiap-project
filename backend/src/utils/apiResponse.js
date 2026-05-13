export const successResponse = (
    res,
    statusCode = 200,
    message = "Operação realizada com sucesso.",
    data = null,
    extra = {}
  ) => {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== null && { data }),
      ...extra,
    });
  };
  
  export const errorResponse = (
    res,
    statusCode = 500,
    message = "Erro interno do servidor.",
    errors = null
  ) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  };