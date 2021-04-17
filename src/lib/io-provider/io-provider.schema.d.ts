import { Path } from '@angular-devkit/core';

export type QueriesOptionsInput = Partial<QueriesOptions>;

export interface QueriesOptions {
  /**
   * The name of the provider.
   */
  name: string;
  /**
   * The name of the base.
   */
  base: string;
  /**
   * The path to create the service.
   */
  path: string;
  /**
   * The path to insert the service declaration.
   */
  module: Path | null;
  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata: string;
  /**
   * Nest element type name
   */
  type: string;
  /**
   * Application language.
   */
  language?: string;
  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
}
