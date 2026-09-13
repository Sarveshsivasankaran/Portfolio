import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { include: ['tests/*.test.{ts,tsx}'], environment: 'jsdom', testTimeout: 20_000, hookTimeout: 30_000 } })
