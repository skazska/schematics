import { Test, TestingModule } from '@nestjs/testing';
import { <%= classify(name) %><%= classify(type) %> } from './<%= name %>.<%= type %>';

describe('<%= classify(name) %><%= type %>', () => {
  let <%= type %>: <%= classify(name) %><%= type %>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%= classify(name) %><%= type %>],
    }).compile();

    <%= type %> = module.get<<%= classify(name) %><%= type %>>(<%= classify(name) %><%= type %>);
  });

  it('should be defined', () => {
    expect(<%= type %>).toBeDefined();
  });
});
