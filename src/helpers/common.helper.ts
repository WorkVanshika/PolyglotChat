import { validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const customValidate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Validating request...");
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map((err: any) => {
      return extractedErrors.push({ meta: err.param, ...err.msg });
    });

    return res.status(422).json({
      status: "ERROR",
      status_code: 422,
      error: "UNPROCESSABLE_ENTITY",
      errors: extractedErrors,
      description:
        "Sorry, there was an error processing your request, Please verify and resubmit.",
    });
  };
};
