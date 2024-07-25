import { Request, Response, NextFunction } from "express";
export interface NewUserrequestBody {
  name: String;
  email: String;
  photo: String;
  gender: String;
  _id: String;
  dob: Date;
}
export type ControllerType = (
  req: Request<{}, {}, NewUserrequestBody>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any,Record<string, any>>>;
