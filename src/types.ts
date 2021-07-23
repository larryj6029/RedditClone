import { createUpdootLoader } from "./utils/createUpdootLoader";
// import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  // em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
