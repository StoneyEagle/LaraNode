import ServiceProvider from "@framework/Providers/ServiceProvider";
import RouteServiceProvider from "@/app/Providers/RouteServiceProvider";
import AuthServiceProvider from "@/app/Providers/AuthServiceProvider";
import LanguageServiceProvider from "@/app/Providers/LanguageServiceProvider";


export default {

    name: env('APP_NAME', 'NoMercy MediaServer'),

    env: env('APP_ENV', 'production'),

    debug: env('APP_DEBUG', false),

    url: env('APP_URL', 'http://localhost'),

    timezone: 'UTC',
    locale: 'en',
    fallback_locale: 'en',

    key: env('APP_KEY'),
    cipher: 'AES-256-CBC',

    providers: ServiceProvider.defaultProviders().merge([
        AuthServiceProvider.class, 
        LanguageServiceProvider.class,
        RouteServiceProvider.class,
    ]),

}