import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.test.ts'],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            obsidian: path.resolve(__dirname, 'tests/__mocks__/obsidian.ts'),
        },
    },
});
