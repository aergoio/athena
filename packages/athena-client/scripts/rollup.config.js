import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import pkg from '../package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const nodeExternals = [
];

const externals = Object.keys(pkg.dependencies).concat(...nodeExternals);

const name = 'AthenaClient';

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: externals,

  plugins: [
    // resolve typescript compile error
    typescript(),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Allows node_modules resolution
    resolve({ extensions }),

    // Convert .json files to ES6 modules
    json(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] }),

    // Insert node globals to be required/imported
    globals(),

    // Allows the node builtins to be required/imported
    builtins(),
  ],

  output: [{
    file: pkg.main,
    format: 'cjs',
  }, {
    file: pkg.module,
    format: 'es',
  }, {
    file: pkg.browser,
    format: 'iife',
    name,

    // https://rollupjs.org/guide/en#output-globals-g-globals
    globals: {},
  }],
};
