import Joi from "joi";

export const schemaUser = Joi.object({
  firstName: Joi.string().required(),
  middleName: Joi.string().optional().allow("", null),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  status: Joi.string().optional().allow("", null),
});

export function modelUser(value) {
  const { error } = schemaUser.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    firstName: value.firstName,
    middleName: value.middleName ?? "",
    lastName: value.lastName,
    email: value.email,
    password: value.password,
    status: value.status ?? "active",
  };
}
