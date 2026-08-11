# Build & Deployment Guide

This guide documents the Vite and TanStack Router compilation processes.

## Release Compilation

1. Run `bun x tsc --noEmit` to ensure a completely clean compile without any types mismatch.
2. Run `bun run build` to package client bundles into `.output/public`.
3. Check the Router manifest configuration in `src/routeTree.gen.ts` to ensure no routing collisions.
