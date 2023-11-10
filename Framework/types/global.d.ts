import I18next from 'i18next';

import {
  AppPath, BasePath,
  Config, ConfigPath,
  DatabasePath, Env,
  Json,
  PublicPath, Redirect, ResourcePath,
  RoutePath, Send, SetLocale, StoragePath,
  View,
  ViewPath
} from '../Foundation/Helpers';

declare global {
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
  var serverName: serverName;
  var serverPort: serverPort;
  var serverProtocol: serverProtocol;
  var serverHost: serverHost;
  var serverUrl: serverUrl;

  var send: Send;
  var json: Json;
  var view: View;
  var redirect: Redirect;
}

export { };
