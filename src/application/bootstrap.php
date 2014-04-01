<?php


//Initializing composer0based autoloader
require __DIR__ . '/../../vendor/autoload.php';

$uri = isset($_SERVER['REQUEST_URI'])
           ? $_SERVER['REQUEST_URI']
           : '/';

$builder = new Fracture\Http\RequestBuilder;

$request = $builder->create([
    'get'    => $_GET,
    'files'  => $_FILES,
    'server' => $_SERVER,
    'post'   => $_POST,
]);
$request->setUri($uri);

$configuration = json_decode(file_get_contents(__DIR__ . '/config/routes.json'), true);

$router = new Fracture\Routing\Router(new Fracture\Routing\RouteBuilder);
$router->import($configuration);

$router->route($request);



$action = $request->getParameter('action');
$command = $request->getMethod() . $action;
$resource = ucfirst($request->getParameter('resource'));


$class = '\\Application\\Controllers\\'.$resource;
$controller = new $class;
$controller->$command($request);

$class = '\\Application\\Views\\' . $resource;
$view = new $class;
$view->$action();