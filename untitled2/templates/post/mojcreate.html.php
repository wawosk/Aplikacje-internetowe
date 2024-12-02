<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = 'Create Post';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Post</h1>
    <form action="<?= $router->generatePath('mojpost-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . 'mojform.html.php'; ?>
        <input type="hidden" name="action" value="mojpost-create">
    </form>

    <a href="<?= $router->generatePath('post-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
