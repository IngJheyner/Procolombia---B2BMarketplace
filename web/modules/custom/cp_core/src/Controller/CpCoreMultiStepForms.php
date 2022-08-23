<?php

namespace Drupal\cp_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormState;

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
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   *
   */
  public function multistepForm(Request $request, $nid = NULL) {

    $form_state = (new FormState())->addBuildInfo('args', [$request, 'step', $nid]);
    // $form_state->setValues($request->query->all());
    return $this->formBuilder()->buildForm('Drupal\cp_core\Form\CpCoreMultiStepForm', $form_state);
  }


}
