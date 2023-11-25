import { App, BrowserWindow, BrowserWindowConstructorOptions, Menu, Tray, app, nativeImage, screen, shell } from "electron";

class Electron {

    mainWindow: BrowserWindow | undefined;
    splash: BrowserWindow | undefined;
    tray: Tray | undefined;
    static customWindows: BrowserWindow[] = [];

    config: {
        host: string;
        port: number;
        icon: string;
        open: boolean;
        title: string;
        tooltip: string;
        url: string;
    } = {
            host: serverHost(),
            port: serverPort(),
            icon: '',
            open: true,
            title: '',
            tooltip: '',
            url: '',
        };

    constructor(config: Partial<Electron['config']>) {
        this.config = { ...this.config, ...config };

        app.commandLine.appendSwitch('disable-web-security');
    }

    make(): App {

        app.setBadgeCount(10);

        app.whenReady().then(() => {

            this.splashWindow();
            this.trayMenu();

            setTimeout(() => {

                // waitPort({
                //     path: '/routes',
                //     host: this.config.host.replace(/https?:\/\//, ''),
                //     port: this.config.port,
                //     output: 'silent',
                // })
                //     .then(() => {
                this.splash?.close();
                this.createWindow();
                // })
                // .catch((error: Error) => {
                //     console.error(error);
                // });

            }, 5000);
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

    private createWindow(): this {
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

        this.mainWindow.loadURL(this.config.url).then();

        return this;
    }

    private splashWindow(): this {
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

    private trayMenu(): this {
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

    public static custonWindow({ options, url }: { options: BrowserWindowConstructorOptions, url: string; }) {

        app.commandLine.appendSwitch('disable-web-security');

        const window = new BrowserWindow({
            resizable: true,
            maximizable: true,
            roundedCorners: false,
            center: true,
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
            ...options,
        });

        window.loadURL(url).then();

        Electron.customWindows.push(window);

        const closeWindow = () => {
            window.hide();
            Electron.customWindows = Electron.customWindows.filter((w) => w !== window);
        };

        return {
            window,
            closeWindow
        };
    }
}

export default Electron;
