import I18next from 'i18next';

import {
  AppPath, BasePath, Config, ConfigPath,
  DatabasePath, Env, Json,
  PublicPath, Redirect, ResourcePath, ServerName,
  RoutePath, Send, ServerVersion, SetLocale, StoragePath,
  View, ViewPath, ServerPort, ServerHost
} from '.';

import { App } from '@framework/Foundation/Application';
import Electron from '@framework/Server/Electron';

declare global {
  var serverVersion: ServerVersion;
  var base_path: BasePath;
  var app_path: AppPath;
  var config_path: ConfigPath;
  var database_path: DatabasePath;
  var public_path: PublicPath;
  var resource_path: ResourcePath;
  var storage_path: StoragePath;
  var route_path: RoutePath;
  var view_path: ViewPath;
  var env: Env;
  var config: Config;
  var routes: (arg0: () => void) => void;
  var i18next: typeof I18next;
  var setLocale: SetLocale;
  var serverName: ServerName;
  var serverHost: ServerHost;
  var serverPort: ServerPort;

  var app: App;

  var send: Send;
  var json: Json;
  var view: View;
  var redirect: Redirect;

  var electron: Electron;
}

declare var require: any;

export { };
