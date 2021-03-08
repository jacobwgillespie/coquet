import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: './src/index.ts',
    output: {dir: 'dist', format: 'cjs', sourcemap: true},
    plugins: [externals(), nodeResolve(), commonjs(), ts({tsconfigOverride: {compilerOptions: {module: 'esnext'}}})],
  },
  {
    input: './src/index.ts',
    output: {file: 'dist/bundle.d.ts', format: 'es'},
    plugins: [dts()],
  },
]
