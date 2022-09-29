<?php
namespace Drupal\cp_advisor_moderation\EventSubscriber;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\OpenDialogCommand;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\taxonomy\TermInterface;
use Drupal\views\Ajax\ViewAjaxResponse;
use Drupal\views\ViewExecutable;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Alter a Views Ajax Response.
 */
class ViewsAjaxResponseSubscriber implements EventSubscriberInterface
{

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // Run before main_content_view_subscriber.
    return [KernelEvents::RESPONSE => [['onResponse', 1]]];
  }

  /**
   * Renders the ajax commands right before preparing the result.
   *
   * @param \Symfony\Component\HttpKernel\Event\ResponseEvent $event
   *   The response event, which contains the possible AjaxResponse object.
   *
   * @throws \Drupal\facets\Exception\InvalidProcessorException
   */
  public function onResponse(ResponseEvent $event) {
    $response = $event->getResponse();

    // Only alter views ajax responses.
    if (!($response instanceof ViewAjaxResponse)) {
      return;
    }
    /* @var $view ViewExecutable*/
    $view = $response->getView();
    if ($view->id() === 'dashboard_advisor') {
      if (!$view->total_rows) {
        $options = [
          'dialogClass' => 'modal-not-found-results',
          'width' => '700px',
          'buttons' => [
            [
              'text' => 'Entendido',
              'class' => 'btn-primary ok-button',
              'id' => 'close-button',
              'onclick' => "jQuery('.ui-dialog-titlebar-close').click()",
            ],
          ],
        ];
        $content = "No se encontraron registros para los filtros aplicados. Por favor, revíselos e intente nuevamente";
        $title = "Error de filtrado";
        $responseTwo = new AjaxResponse();
        $responseTwo->addCommand(new OpenModalDialogCommand($title, $content, $options));
        //$responseTwo->addCommand(new InvokeCommand('#page', 'ourCustomJqueryMethod', []));
        $event->setResponse($responseTwo);
      }
    }
  }
}
