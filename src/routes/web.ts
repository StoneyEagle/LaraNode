import Route from "@framework/Routing/Route";

Route.get('/', function ({ response }) {
    return response.view('<h1>Hello Home</h1>');
});
