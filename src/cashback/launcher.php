<?php

namespace Application\Common;

session_start();


$cookieJar = new \Guzzle\Plugin\Cookie\CookieJar\ArrayCookieJar;
if (isset($_SESSION['cache.cookies'])) {
    $cookieJar->unserialize($_SESSION['cache.cookies']);
}

$datasources = json_decode(file_get_contents(__DIR__ . '/../config/datasource.json'), true);


$templateBuilder = new TemplateBuilder(__DIR__ . '/Presentation/Templates');
$domainFactory = new DomainObjectFactory;
$domainFactory->setNamespace('\\Application\\DomainObjects');
$mapperFactory = new DataMapperFactory($datasources);
$mapperFactory->setNamespace('\\Application\\DataMappers');
$mapperFactory->setShared([
    'CookieJar' => $cookieJar,
    ]);
$serviceFactory = new ServiceFactory($domainFactory, $mapperFactory);
$serviceFactory->setNamespace('\\Application\\Services');



$action = $request->getParameter('action');
$command = $request->getMethod() . $action;
$resource = ucfirst($request->getParameter('resource'));



$recognition = $serviceFactory->create('Recognition');
$recognition->authenticate();



$class = '\\Application\\Controllers\\'.$resource;
$controller = new $class($serviceFactory);
$controller->$command($request);

$class = '\\Application\\Views\\' . $resource;
$view = new $class($serviceFactory, $templateBuilder);
echo $view->$action();


$_SESSION['cache.cookies'] = $cookieJar->serialize();