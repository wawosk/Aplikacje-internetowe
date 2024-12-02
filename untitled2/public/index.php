<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : null;

switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction(
            isset($_REQUEST['post']) ? $_REQUEST['post'] : null,
            $templating,
            $router
        );
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], isset($_REQUEST['post']) ? $_REQUEST['post'] : null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    case 'moja':
        $controller = new \App\Controller\MojController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'mojpost-create':
        $controller = new \App\Controller\MojController();
        $view = $controller->createAction(
            isset($_REQUEST['post']) ? $_REQUEST['post'] : null,
            $templating,
            $router
        );
        break;

    case 'mojpost-index':
        $controller = new \App\Controller\MojController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'mojpost-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\MojController();
        $view = $controller->editAction($_REQUEST['id'], isset($_REQUEST['post']) ? $_REQUEST['post'] : null, $templating, $router);
        break;

    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
