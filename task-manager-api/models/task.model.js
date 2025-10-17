import Joi from "joi";

export const schemaTask = Joi.object({
  task: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(200).allow(""),
});

export function modelTask(value) {
  const { error } = schemaTask.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    task: value.task ?? "",
    description: value.description ?? "",
    status: value.status ?? "pending",
    createdAt: new Date(),
  };
}
