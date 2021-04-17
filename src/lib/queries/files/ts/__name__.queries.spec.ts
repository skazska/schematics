import { Test, TestingModule } from '@nestjs/testing';
import { <%= classify(name) %>queries } from './<%= name %>.queries';

describe('<%= classify(name) %>queries', () => {
  let queries: <%= classify(name) %>queries;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%= classify(name) %>queries],
    }).compile();

    queries = module.get<<%= classify(name) %>queries>(<%= classify(name) %>queries);
  });

  it('should be defined', () => {
    expect(queries).toBeDefined();
  });
});
