export default function validate(validationSchema) {
  return (request, response, next) => {
    const data = request.body;

    const validationResult = validationSchema.validate(data);

    if (Boolean(validationResult.error)) {
      const { message, path } = validationResult.error.details[0];
      return response
        .status(400)
        .json({ success: false, errors: [{ path, message }] });
    }

    next();
  };
}
