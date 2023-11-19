import I18next from 'i18next';
import './array';
import './string';
import './time';

import {
  AppPath, BasePath, Config, ConfigPath,
  DatabasePath, Env, Json,
  PublicPath, Redirect, ResourcePath, ServerName,
  RoutePath, Send, ServerVersion, SetLocale, StoragePath,
  View, ViewPath, ServerPort, ServerHost, PromiseQueue
} from '.';

import { App } from '@framework/Foundation/Application';
import Electron from '@framework/Server/Electron';
import { GroupBy, Unique } from './array';
import { MatchPercentage, SortByMatchPercentage } from './string';

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

  var promiseQueue: PromiseQueue;


  var groupBy: GroupBy;
  var unique: Unique;

  var matchPercentage: MatchPercentage;
  var sortByMatchPercentage: SortByMatchPercentage;
}

export { };
