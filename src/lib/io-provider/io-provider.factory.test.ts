import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ApplicationOptions } from '../application/application.schema';
import { ModuleOptions } from '../module/module.schema';
import { QueriesOptionsInput } from './io-provider.schema';

const fileContent =
  "import { Inject, Injectable } from '@nestjs/common';\n" +
  'import Knex from \'knex\';\n' +
  '\n' +
  '@Injectable()\n' +
  'export class FooQueries {\n' +
  '  constructor(@Inject(\'Knex\') private readonly knex: Knex) {}\n' +
  '}\n';

describe('Queries Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should manage name only', async () => {
    const options: QueriesOptionsInput = {
      name: 'foo',
      skipImport: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo.queries.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/foo.queries.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/foo.queries.ts')).toEqual(fileContent);
  });
  xit('should manage name as a path', async () => {
    const options: QueriesOptionsInput = {
      name: 'bar/foo',
      skipImport: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar/foo.queries.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/bar/foo.queries.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar/foo.queries.ts')).toEqual(fileContent);
  });
  xit('should manage name and path', async () => {
    const options: QueriesOptionsInput = {
      name: 'foo',
      path: 'bar',
      skipImport: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar/foo.queries.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/bar/foo.queries.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar/foo.queries.ts')).toEqual(fileContent);
  });
  xit('should manage name to dasherize', async () => {
    const options: QueriesOptionsInput = {
      name: 'fooBar',
      skipImport: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo-bar.queries.ts'),
    ).toBeDefined();
    expect(tree.readContent('/foo-bar.queries.ts')).toEqual(
      "import { Inject, Injectable } from '@nestjs/common';\n" +
      'import Knex from \'knex\';\n' +
      '\n' +
      '@Injectable()\n' +
      'export class FooBarQueries {\n' +
      '  constructor(@Inject(\'Knex\') private readonly knex: Knex) {}\n' +
      '}\n',
  );
  });
  xit('should manage path to dasherize', async () => {
    const options: QueriesOptionsInput = {
      name: 'barBaz/foo',
      skipImport: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/bar-baz/foo.queries.ts'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/bar-baz/foo.queries.spec.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar-baz/foo.queries.ts')).toEqual(fileContent);
  });
  xit('should manage javascript file', async () => {
    const options: QueriesOptionsInput = {
      name: 'foo',
      skipImport: true,
      language: 'js',
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('queries', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo.queries.js'),
    ).toBeDefined();
    expect(
      files.find(filename => filename === '/foo.queries.spec.js'),
    ).toBeDefined();
    expect(tree.readContent('/foo.queries.js')).toEqual(fileContent);
  });
  xit('should manage declaration in app module', async () => {
    const app: ApplicationOptions = {
      name: '',
    };
    let tree: UnitTestTree = await runner.runSchematicAsync('application', app).toPromise();
    const options: QueriesOptionsInput = {
      name: 'foo',
      flat: true,
    };
    tree = await runner.runSchematicAsync('queries', options, tree).toPromise();
    expect(tree.readContent(normalize('/src/app.module.ts'))).toEqual(
      "import { Module } from '@nestjs/common';\n" +
        "import { AppController } from './app.controller';\n" +
        "import { AppService } from './app.service';\n" +
        "import { FooQueries } from './foo.queries';\n" +
        '\n' +
        '@Module({\n' +
        '  imports: [KnexModule],\n' +
        '  controllers: [AppController],\n' +
        '  providers: [AppService, FooQueries],\n' +
        '})\n' +
        'export class AppModule {}\n',
    );
  });
  it('should manage declaration in foo module', async () => {
    const app: ApplicationOptions = {
      name: '',
    };
    let tree: UnitTestTree = await runner.runSchematicAsync('application', app).toPromise();
    const module: ModuleOptions = {
      name: 'foo',
    };
    tree = await runner.runSchematicAsync('module', module, tree).toPromise();;
    const options: QueriesOptionsInput = {
      name: 'foo',
      path: 'foo',
      flat: true,
    };
    tree = await runner.runSchematicAsync('queries', options, tree).toPromise();
    expect(tree.readContent(normalize('/src/foo/foo.module.ts'))).toEqual(
      "import { Module } from '@nestjs/common';\n" +
        "import { KnexModule } from '@r-vision/nestjs-common';\n" +
        "import { FooQueries } from './foo.queries';\n" +
        '\n' +
        '@Module({\n' +
        '  imports: [KnexModule],\n' +
        '  providers: [FooQueries]\n' +
        '})\n' +
        'export class FooModule {}\n',
    );
  });
});
