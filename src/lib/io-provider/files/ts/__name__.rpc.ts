import { Inject, Injectable } from '@nestjs/common';
import Hemera from 'nats-hemera';

@Injectable()
export class <%= classify(name) %>Rpc {
  constructor(@Inject('Hemera') hemera: Hemera<Hemera.Request, Hemera.Response>) {}
}
