<?php

namespace Drupal\cp_advisor_moderation\EventSubscriber;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\RouteCollection;

/**
 * CP Advisor Moderation route subscriber.
 */
class CpAdvisorModerationRouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $route = $collection->get('cp_advisor_moderation.edit_form');
    if ($route) {
      $route->setRequirements([
        '_access_edit_product' => 'TRUE',
      ]);
    }
  }



}
