<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "Edit Post {$post->getSubject()} ({$post->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('mojpost-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . 'mojform.html.php'; ?>
        <input type="hidden" name="action" value="mojpost-edit">
        <input type="hidden" name="id" value="<?= $post->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('mojpost-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('post-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="post-delete">
                <input type="hidden" name="id" value="<?= $post->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
