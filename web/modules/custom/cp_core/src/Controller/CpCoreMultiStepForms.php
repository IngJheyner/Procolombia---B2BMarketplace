<?php

namespace Drupal\cp_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormState;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\Core\Render\RendererInterface;

/**
 * Returns responses for Node routes.
 */
class CpCoreMultiStepForms extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var Drupal\Core\Entity\EntityManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The render object.
   *
   * @var Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * Construct the controller.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The render object.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, RendererInterface $renderer) {
    $this->entityTypeManager = $entity_type_manager;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('renderer')
    );
  }

  /**
   * Construct the multi-step form.
   */
  public function multistepForm(Request $request, $nid = NULL) {

    $form_state = (new FormState())->addBuildInfo('args', [$request, 'step', $nid]);
    // $form_state->setValues($request->query->all());
    return $this->formBuilder()->buildForm('Drupal\cp_core\Form\CpCoreMultiStepForm', $form_state);
  }

  /**
   * Function to toggle tue user status.
   */
  public function toggleProductAvailability(NodeInterface $node) {
    $response = new AjaxResponse();
    if ($node->field_pr_product_availability->value) {
      $status = 'off';
      $node->field_pr_product_availability->value = FALSE;
    }
    else {
      $status = 'on';
      $node->field_pr_product_availability->value = TRUE;
    }
    $node->save();
    $url = Url::fromRoute('cp_core.product_toggle_availability', ['node' => $node->id()]);
    $build = [
      '#type' => 'link',
      '#title' => $status,
      '#url' => $url,
      '#attributes' => [
        'class' => [$status, 'use-ajax', 'toggle'],
        'id' => 'product-availability-toggle-' . $node->id(),
      ],
    ];
    $link = $this->renderer->render($build);
    $response->addcommand(new ReplaceCommand('#product-availability-toggle-' . $node->id(), $link));
    return $response;
  }

  /**
   * Function to toggle tue user status.
   */
  public function toggleCompanyPublished(NodeInterface $node) {
    $response = new AjaxResponse();
    if ($node->field_com_published->value) {
      $status = 'off';
      $node->field_com_published->value = FALSE;
    }
    else {
      $status = 'on';
      $node->field_com_published->value = TRUE;
    }
    $node->save();
    $url = Url::fromRoute('cp_core.company_toggle_published', ['node' => $node->id()]);
    $build = [
      '#type' => 'link',
      '#title' => $status == 'on' ? $this->t('Yes') : $this->t('No'),
      '#url' => $url,
      '#attributes' => [
        'class' => [$status, 'use-ajax', 'toggle'],
        'id' => 'company-published-toggle-' . $node->id(),
      ],
    ];
    $link = $this->renderer->render($build);
    $response->addcommand(new ReplaceCommand('#company-published-toggle-' . $node->id(), $link));
    return $response;
  }

}
