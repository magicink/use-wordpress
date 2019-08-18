import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default [{
  external: ['react'],
  input: `${path.resolve(__dirname, 'src', 'index.js')}`,
  output: {
    exports: 'named',
    file: `${path.resolve(__dirname, 'dist', 'bundle.js')}`,
    format: 'cjs'
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-parameters',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-computed-properties',
        '@babel/plugin-transform-template-literals',
      ],
      runtimeHelpers: true
    }),
    flow({ all: true }),
    resolve(),
    terser()
  ]
}]
