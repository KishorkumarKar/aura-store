import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { ApiError } from "../utils/ApiError";

type ReqProperty = "body" | "query" | "params";

export function validate(schema: ObjectSchema, property: ReqProperty = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/"/g, ""),
      }));
      return next(ApiError.badRequest("Validation failed", details));
    }

    // Overwrite with the coerced/sanitized value (defaults applied, etc).
    req[property] = value;
    next();
  };
}
