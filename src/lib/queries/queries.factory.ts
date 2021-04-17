import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../../utils/module.declarator';
import { ModuleFinder } from '../../utils/module.finder';
import { Location, NameParser } from '../../utils/name.parser';
import { mergeSourceRoot } from '../../utils/source-root.helpers';
import {QueriesOptions, QueriesOptionsInput} from './queries.schema';

export function main(optionsInput: QueriesOptionsInput): Rule {
  const options = transform(optionsInput);
  return (tree: Tree, context: SchematicContext) => {
    const merged = mergeSourceRoot(options);
    const added = addDeclarationToModule(options);
    const generated = generate(options);
    const branch = mergeWith(generated);

    const result = branchAndMerge(

      chain ([merged, added, branch]),

      // chain([
      //   mergeSourceRoot(options),
      //   addDeclarationToModule(options),
      //   mergeWith(generate(options)),
      // ]),
    )(tree, context);

    // result.subscribe(x => console.dir(x));

    return result;
  };
}

function transform(source: QueriesOptionsInput): QueriesOptions {
  const { flat, language = 'ts' } = source;
  let { name, path } = source;
  const metadata = 'providers';
  const type = 'queries';

  if (!name) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse({ name, path });
  name = strings.dasherize(location.name);
  path = strings.dasherize(location.path);

  path = flat
    ? path
    : join(path as Path, name);

  return { ...source, language, metadata, module: null, name, path, type };
}

function generate(options: QueriesOptions) {
  return (context: SchematicContext) => {
    const result = apply(url(join('./files' as Path, options.language)), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);

    return result;
  }
}

function addDeclarationToModule(options: QueriesOptions): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }

    const module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });

    if (!module) {
      return tree;
    }

    options.module = module;

    let content = (tree.read(module) || '').toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();

    content = declarator.declare(content, {
      metadata: 'imports',
      type: 'package', //?
      name: '@r-vision/nestjs-common',
      className: 'KnexModule', //?
      path: '' as Path,
      module: '' as Path,
      // symbol?: 'string',
      // staticOptions: { //?
      //   name: 'static',
      //   value: { option: 'value' },
      // },
    });

    content = declarator.declare(content, options as DeclarationOptions);

    tree.overwrite(
      options.module,
      content,
    );

    return tree;
  };
}
