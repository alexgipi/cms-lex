export const ERROR_HANDLERS = {
    CastError: res => res.status(400).send({ error: 'id used is malformed' }),
  
    ValidationError: (res, { message }) =>
      res.status(409).send({ error: message }),
  
    JsonWebTokenError: res =>
      res.status(401).json({ error: 'token missing or invalid' }),
  
    TokenExpiredError: res =>
      res.status(401).json({ error: 'token expired' }),
  
    defaultError: res => res.status(500).end(),
};
  

export default function errorHandlerMiddleware(error, request, response, next) {
    console.log("AQUIII-> ERROR: " + error)
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
    handler(response, error);
}