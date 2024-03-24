import { defineConfig } from 'vite';
import dotenv from 'dotenv'

export default ({ mode }) => {
  const dotenvConfig = dotenv.config({path: `src/.env.${mode}`}).parsed;

  return defineConfig({
    define: {
      "process.env": dotenvConfig,
    },
    root: 'src',
    base: '/client',
    build: {
      outDir: '../dist',
    },
  });
}