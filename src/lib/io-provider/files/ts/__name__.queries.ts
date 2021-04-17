import { Inject, Injectable } from '@nestjs/common';
import Knex from 'knex';

@Injectable()
export class <%= classify(name) %>Queries {
  private readonly baseTable = '<%= base %>';

  constructor(@Inject('Knex') private readonly knex: Knex) {}

  /**
   * Returns query builder based on base table
   */
  private builder(trx?: Knex.Transaction): Knex.QueryBuilder {
    return this.knex(this.baseTable);
  }
}
