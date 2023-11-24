import { app, BrowserWindow, screen, shell, Tray, Menu, App, nativeImage } from "electron";
import waitPort from "wait-port";
        
class Electron {

    mainWindow: BrowserWindow | undefined;
    splash: BrowserWindow | undefined;
    tray: Tray | undefined;

    config: {
        host: string;
        port: number;
        icon: string;
        open: boolean;
        title: string;
        tooltip: string;
    } = {
            host: serverHost(),
            port: serverPort(),
            icon: '',
            open: true,
            title: '',
            tooltip: '',
        };

    constructor(config: Partial<Electron['config']>) {
        this.config = { ...this.config, ...config };
    }

    make(): App {

        app.commandLine.appendSwitch('disable-web-security');

        app.setBadgeCount(10);

        app.whenReady().then(() => {

            this.splashWindow();
            this.trayMenu();

            waitPort({
                path: '/routes',
                host: this.config.host.replace(/https?:\/\//, ''),
                port: this.config.port,
                output: 'silent',
            })
                .then(() => {
                    this.splash?.close();
                    this.createWindow();
                })
                .catch((error: Error) => {
                    console.error(error);
                });

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
            });
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        return app;
    }

    createWindow(): this {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width } = primaryDisplay.workAreaSize;

        this.mainWindow = new BrowserWindow({
            title: this.config.title,
            show: false,
            width: Math.floor(width / 1.2),
            height: Math.floor((width / 1.2) / 16 * 9),
            minWidth: 1320,
            minHeight: 860,
            resizable: true,
            maximizable: true,
            roundedCorners: false,
            center: true,
            icon: this.config.icon,
            darkTheme: true,
            kiosk: false,
            autoHideMenuBar: true,
            thickFrame: true,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                autoplayPolicy: 'no-user-gesture-required',
                webgl: true,
                sandbox: false,
                webSecurity: false,
                scrollBounce: true,
            },
        });

        this.mainWindow.on('ready-to-show', () => {
            if (this.config.open) {
                this.mainWindow?.show();
            }
        });

        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url).then();
            return { action: 'deny' };
        });

        this.mainWindow.on('close', (event) => {
            // @ts-ignore-next-line
            if (!app.isQuiting) {
                event.preventDefault();
                this.mainWindow?.hide();
            }
            return false;
        });

        this.mainWindow.loadURL(this.config.host).then();

        return this;
    }

    splashWindow(): this {
        this.splash = new BrowserWindow({
            width: 600,
            height: 300,
            frame: false,
            center: true,
            icon: this.config.icon,
            darkTheme: true,
            // alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                autoplayPolicy: 'no-user-gesture-required',
                webgl: true,
                sandbox: false
            },
        });

        this.splash.loadURL(`https://cdn.nomercy.tv/splash.html`)
            .then()
            .catch(() => null);

        this.splash.on('ready-to-show', () => {
            this.splash?.show();
            this.splash?.focus();
        });

        return this;
    }

    trayMenu(): this {
        const trayMenu = Menu.buildFromTemplate([
            {
                label: 'Show App',
                click: () => {
                    this.mainWindow?.show();
                },
            },
            {
                label: 'Quit',
                click: () => {
                    // @ts-ignore-next-line
                    app.isQuiting = true;
                    app.quit();
                },
            },
        ]);
        this.tray = new Tray(nativeImage.createFromPath(this.config.icon));
        this.tray.setContextMenu(trayMenu);
        this.tray.setToolTip(this.config.tooltip);

        this.tray.on('click', () => {
            this.mainWindow?.show();
        });

        return this;
    }
}

export default Electron;
