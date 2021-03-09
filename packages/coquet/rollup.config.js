import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import dts from 'rollup-plugin-dts'
import {terser} from 'rollup-plugin-terser'

export default [
  {
    input: './src/index.ts',
    output: {dir: 'dist', format: 'cjs', sourcemap: true},
    plugins: [
      externals({devDeps: false}),
      nodeResolve(),
      commonjs(),
      ts({
        tsconfigOverride: {
          compilerOptions: {module: 'esnext'},
        },
        check: false,
        typescript: require('typescript'),
      }),
      terser(),
    ],
  },
  {
    input: './src/index.ts',
    output: {file: 'dist/index.d.ts', format: 'es'},
    plugins: [dts({respectExternal: true})],
  },
]
