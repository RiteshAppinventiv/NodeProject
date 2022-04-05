import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
const userSignupValidator = [
  check("username")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("USERNAME Must be single line and does not include any special character")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .matches(/^(?=.*)[a-zA-Z\d@$.!%,*#?&]/)
    .withMessage("username does not include special characters."),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6})
    .withMessage("Password must be more than 6 charecters")
    .matches("(?=.*[a-z])").withMessage("Password must contain atleast one small character")
    .matches("(?=.*[A-Z])").withMessage("Password must contain atleast one Capital character")
    .matches(/^(?=.*\d)[a-zA-Z\d@$.!%*#?&]/)
    .withMessage("password must contain a special charcter with Number"),
  check("location")
    .not()
    .isEmpty()
    .withMessage("lOCATION can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("phone")
    .not()
    .isEmpty()
    .withMessage("phone number can not be empty!")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10 })
    .withMessage("Please enter a valid phone number")
    .isLength({ max: 10 })
    .withMessage("Please enter a valid phone number"),
check("status")
    .not()
    .isEmpty()
    .withMessage("status name can not be empty!"),
    
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(402).json({ errors: errors.array() });
    }
    next();
  },
];

const userLoginValidator = [
  check("username")
    .not()
    .trim()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 4 })
    .withMessage("Please enter a valid password!")
    .isLength({ max: 10 })
    .withMessage("Please enter a valid password!"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(402).json({ errors: errors.array });
    next();
  },
];

export default userSignupValidator;
