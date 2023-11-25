import ServiceProvider from "@framework/Providers/ServiceProvider";
import NetworkServiceProvider from "@/app/Providers/NetworkServiceProvider";
import AppServiceProvider from "@/app/Providers/AppServiceProvider";
import AuthServiceProvider from "@/app/Providers/AuthServiceProvider";
import LanguageServiceProvider from "@/app/Providers/LanguageServiceProvider";
import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";
import ElectronServiceProvider from "@/app/Providers/ElectronServiceProvider";

export default {

    name: env('APP_NAME', 'NoMercy MediaServer'),

    env: env('APP_ENV', 'production'),

    debug: env('APP_DEBUG', false),

    url: env('APP_URL', 'http://localhost'),

    timezone: 'UTC',
    locale: 'en',
    country: 'US',
    fallback_locale: 'en',

    key: env('APP_KEY'),
    cipher: 'AES-256-CBC',

    providers: ServiceProvider.defaultProviders().merge([
        NetworkServiceProvider.class,
        AuthServiceProvider.class,
        AppServiceProvider.class,
        LanguageServiceProvider.class,
        RouteServiceProvider.class,
        ElectronServiceProvider.class,
    ]),
};