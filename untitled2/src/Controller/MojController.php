<?php

namespace App\Controller;
use App\Exception\NotFoundException;
use App\Model\Post;
use App\Service\Router;
use App\Service\Templating;

class MojController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $posts = Post::findAll();
        $html = $templating->render('post/mojindex.html.php', [
            'posts' => $posts,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $post = Post::fromArray($requestPost);
            $content = $post->getContent();
            $processedContent = $this->processCalculations($content);
            $post->setContent($processedContent);


            // @todo missing validation
            $post->save();

            $path = $router->generatePath('mojpost-index');
            $router->redirect($path);
            return null;
        } else {
            $post = new Post();
        }

        $html = $templating->render('post/mojcreate.html.php', [
            'post' => $post,
            'router' => $router,
        ]);
        return $html;
    }
    private function processCalculations(string $content): string
    {
        $processedContent = eval('return ' . $content . ';');
        return $processedContent;
    }



    public function editAction(int $postId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $post = Post::find($postId);
        if (!$post) {
            throw new NotFoundException("Missing post with id $postId");
        }

        if ($requestPost) {
            $post->fill($requestPost);
            // @todo missing validation
            $post->save();

            $path = $router->generatePath('post-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('post/mojpostedit.html.php', [
            'post' => $post,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $postId, Templating $templating, Router $router): ?string
    {
        $post = Post::find($postId);
        if (!$post) {
            throw new NotFoundException("Missing post with id $postId");
        }

        $html = $templating->render('post/show.html.php', [
            'post' => $post,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $postId, Router $router): ?string
    {
        $post = Post::find($postId);
        if (!$post) {
            throw new NotFoundException("Missing post with id $postId");
        }

        $post->delete();
        $path = $router->generatePath('post-index');
        $router->redirect($path);
        return null;
    }
}
