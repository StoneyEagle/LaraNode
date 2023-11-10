import Route from "@framework/Routing/Route";

Route.get('/', function () {
    return send('<h1>Hello Dashboard</h1>');
});
