import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type ContextType = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
  req: Request,
  resposne: Response
}