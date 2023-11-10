import StartSession from "@framework/Middleware/StartSession";
import Cors from "@framework/Middleware/Cors";
import Localization from "@framework/Middleware/Localization";
import ServerName from "@framework/Middleware/ServerName";


export default { 
    middleware: [
        Cors,
        ServerName,
        Localization,
        StartSession,
    ],
    middlewareGroups: {
        web: [
        ],
        api: [
        ],
    },
}