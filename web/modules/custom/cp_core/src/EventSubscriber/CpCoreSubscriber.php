<?php

namespace Drupal\cp_core\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Drupal\Core\Url;

/**
 * Class CpCoreSubscriber.
 *
 * @package Drupal\cp_core\EventSubscriber
 */
class CpCoreSubscriber implements EventSubscriberInterface {

  /**
   * Listen to kernel.request events and call customRedirection.
   * {@inheritdoc}
   * @return array Event names to listen to (key) and methods to call (value)
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['customRedirection', 34];
    return $events;
  }

  /**
   * Manipulates the request object.
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The Event to process.
   */
  public function customRedirection(GetResponseEvent $event) {
    /*$response = $event->getRequest();
    $query_string = \substr($response->getRequestUri(), 2);

    // Redirect if query_string start with q=
    if (\stripos($query_string, 'q=') !== false) {
      $redirect_target_url = Url::fromUserInput('/' . \substr($query_string, 2));
      $response = new RedirectResponse(
        $redirect_target_url->setAbsolute()->toString(),
        301
      );
      $event->setResponse($response);
    }

    return true;*/
  }

}
