import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'

export default {
  input: './src/index.ts',
  output: {dir: 'dist', format: 'cjs', sourcemap: true},
  plugins: [externals(), nodeResolve(), commonjs(), ts({tsconfigOverride: {compilerOptions: {module: 'esnext'}}})],
}
