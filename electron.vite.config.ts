import { defineConfig } from "electron-vite";
import { readdirSync, rmSync } from "fs";
import path, { resolve } from "path";
import pkg from './package.json';

const getFiles = (path = 'src') => {
    const files = readdirSync(resolve(__dirname, 'src', 'server', path), { withFileTypes: true });
    const jsFiles = files.filter((file) => file.isFile() && file.name.endsWith('.ts')).map((file) => file.name);
    const directories = files.filter((file) => file.isDirectory()).map((file) => file.name);
    const filesInDirectories = directories.map((directory) => getFiles(path + '/' + directory)).flat();
    return jsFiles.map((file) => resolve(__dirname, 'src', 'server', path + '/' + file)).concat(filesInDirectories);
}

const getSourceFiles = () => {
    const sourceFiles = getFiles();
    const frameworkFiles = getFiles('framework');

    return [...new Set(sourceFiles.concat(frameworkFiles))] as string[];
}

export default defineConfig(({ command }) => {
  rmSync('dist', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
        main: {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'src', 'server', 'src'),
                    '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                    '@resources': path.resolve(__dirname, 'resources')
                },
            },
            build: {
                resolve: {
                    alias: {
                        '@': path.resolve(__dirname, 'src', 'server', 'src'),
                        '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                        '@resources': path.resolve(__dirname, 'resources')
                    },
                },
                rollupOptions: {
                    preserveEntrySignatures: "allow-extension",
                    input: getSourceFiles(),
                    output: {
                        preserveModules: true,
                    },
                    external: Object.keys('dependencies' in pkg
                        ? pkg.dependencies
                        : {}),
                },
            }
        },
        preload: {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'src', 'server', 'src'),
                    '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                    '@resources': path.resolve(__dirname, 'resources')
                },
            },
            build: {
                resolve: {
                    alias: {
                        '@': path.resolve(__dirname, 'src', 'server', 'src'),
                        '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                        '@resources': path.resolve(__dirname, 'resources')
                    },
                },
                rollupOptions: {
                    preserveEntrySignatures: "allow-extension",
                    input: path.resolve(__dirname, 'src', 'electron', 'preload', 'index.ts'),
                    output: {
                        preserveModules: true,
                    },
                    external: Object.keys('dependencies' in pkg
                        ? pkg.dependencies
                        : {}),
                },
            }
        },
        renderer: {
            root: './',
            base: './',
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'src', 'server', 'src'),
                    '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                    '@resources': path.resolve(__dirname, 'resources')
                },
            },
            build: {
                resolve: {
                    alias: {
                        '@': path.resolve(__dirname, 'src', 'server', 'src'),
                        '@framework': path.resolve(__dirname, 'src', 'server', 'framework'),
                        '@resources': path.resolve(__dirname, 'resources')
                    },
                },
                rollupOptions: {
                    preserveEntrySignatures: "allow-extension",
                    input: path.resolve(__dirname, 'src', 'electron', 'renderer', 'index.ts'),
                    output: {
                        preserveModules: true,
                    },
                    external: Object.keys('dependencies' in pkg
                        ? pkg.dependencies
                        : {}),
                },
            }
        },
    };
});