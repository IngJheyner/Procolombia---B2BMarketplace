<?php

namespace Drupal\cp_migrate\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for building migratemedical network form.
 */
class ImportCSV extends ControllerBase
{
    public function content()
    {

        $form = \Drupal::formBuilder()->getForm('Drupal\cp_migrate\Form\ImportForm');

        return $form;
    }
}