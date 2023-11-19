import StartSession from "@framework/Middleware/StartSession";
import Cors from "@framework/Middleware/Cors";
import Localization from "@framework/Middleware/Localization";
import ServerName from "@framework/Middleware/ServerName";
import LocalizationMiddleware from "@/app/Http/Middleware/Localization";


export default {
    middleware: [
        Cors,
        ServerName,
        Localization,
        LocalizationMiddleware,
        StartSession,
    ],
    middlewareGroups: {
        web: [
            LocalizationMiddleware,
        ],
        api: [
            LocalizationMiddleware,
        ],
    },
};