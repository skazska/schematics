import { Inject, Injectable } from '@nestjs/common';
import Knex from 'knex';

@Injectable()
export class <%= classify(name) %>Queries {
  constructor(@Inject('Knex') private readonly knex: Knex) {}
}
