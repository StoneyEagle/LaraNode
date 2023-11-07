import Cors from "./Middleware/Cors";
import ServerName from "./Middleware/ServerName";

export default { 
    middleware: [
        Cors,
        ServerName,
    ],
}