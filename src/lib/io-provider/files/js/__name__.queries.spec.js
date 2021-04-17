import { Test } from '@nestjs/testing';
import { <%= classify(name) %>queries } from './<%= name %>.io-provider';

describe('<%= classify(name) %>io-provider', () => {
  let queries;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [<%= classify(name) %>queries],
    }).compile();

    queries = module.get(<%= classify(name) %>queries);
  });

  it('should be defined', () => {
    expect(queries).toBeDefined();
  });
});
