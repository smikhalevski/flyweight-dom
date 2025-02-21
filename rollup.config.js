const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: './src/main/index.ts',
  output: [
    { format: 'cjs', entryFileNames: '[name].js', dir: './lib' },
    { format: 'es', entryFileNames: '[name].mjs', dir: './lib' },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
};
