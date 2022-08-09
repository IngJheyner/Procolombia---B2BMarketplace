<?php

namespace Drupal\cp_migrate\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\IReadFilter;

class ImportForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'csv_import_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['type'] = array(
      '#type' => 'select',
      '#title' => 'Type',
      '#required' => TRUE,
      '#options'=> [
        'usuarios' => 'Usuarios',
        'states_cities'=> 'Departamentos y ciudades',
        'countries' => 'Paises',
        'sectores' => 'Sectores',
        'categorization' => 'Categorizacion',
        'empresas' => 'Empresas',
        'old_companies' => 'Empresas antiguas',
        'productos' => 'Productos',
        'codigos' => 'Codigos CIIU',
      ]
    );

    $form['trans_type_one'] = array(
      '#type' => 'radios',
      '#title' => t('Select the translations in the load'),
      '#options' => array(
        'both_lang' => t('Translations in both languages'),
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="type"]' => array(
            array('value' => t('')),
            array('value' => t('usuarios')),
            array('value' => t('states_cities')),
            array('value' => t('countries')),
            array('value' => t('sectores')),
            array('value' => t('codigos'))
          ),
        ),
        'required' => array(
          ':input[name="type"]' => array(
            array('value' => t('')),
            array('value' => t('usuarios')),
            array('value' => t('states_cities')),
            array('value' => t('countries')),
            array('value' => t('sectores')),
            array('value' => t('codigos'))
          ),
        ),
      ),
    );

    $form['trans_type_both'] = array(
      '#type' => 'radios',
      '#title' => t('Select the translations in the load'),
      '#options' => array(
        'both_lang' => t('Translations in both languages'),
        'one_lang' => t('Translations in one language'),
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="type"]' => array(
              array('value' => t('categorization')),
              array('value' => t('empresas')),
              array('value' => t('productos')),
              array('value' => t('old_companies')),
          ),
        ),
        'required' => array(
          ':input[name="type"]' => array(
              array('value' => t('categorization')),
              array('value' => t('empresas')),
              array('value' => t('productos')),
          ),
        ),
      ),
    );

    $form['import_csv'] = array(
      '#type' => 'managed_file',
      '#title' => t('Upload file here'),
      '#upload_location' => 'public://',
      '#required' => TRUE,
      "#upload_validators"  => array("file_validate_extensions" => array("xlsx")),
      
    );

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Upload'),
      '#button_type' => 'primary',
    );

    $form['description'] = array(
      '#markup' => '<div class="ayudas">
        <p>Tenga en cuenta estas instrucciones para cuando vaya a realizar un cargue o actualización de registros</p>
        <ul>
        <li>Si se sube el excel nuevamente actualiza los registros</li>
        <li>Si se desea crear solo nuevos registros, use la plantilla y agréguelos para subir</li>
        <li>Si desea actualizar un registro use la plantilla y registre los cambios</li>
        </ul>
        </div>'
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $csv_file = $form_state->getValue('import_csv');
    $type_migration = $form_state->getValue('type');
    $trans_type = NULL;

    $trans_type_one = $form_state->getValue('trans_type_one');
    $one_types = array(
      'usuarios', 
      'states_cities', 
      'countries', 
      'sectores', 
      'codigos'
    );
    if ($type_migration && in_array($type_migration, $one_types)) {
      $trans_type = $trans_type_one;
    }
    $trans_type_both = $form_state->getValue('trans_type_both');
    $both_types = array(
      'categorization',
      'old_companies', 
      'empresas', 
      'productos'
    );
    if ($type_migration && in_array($type_migration, $both_types)) {
      $trans_type = $trans_type_both;
    }
    
    
    $file = File::load($csv_file[0]);
    if ($file) {
      $file->setPermanent();
      $file->save();
    }
    else {
      addMessage('Error al cargar archivo');
    }

    $uri = IOFactory::identify($file->getFileUri());
    $reader = IOFactory::createReader($uri);
    $reader->setReadDataOnly(TRUE);
    $pFilename = realpath($file->getFileUri());
    $workbook = $reader->load($pFilename);
    $sheetData = $workbook->getActiveSheet();
    $rowIterator = $sheetData->getRowIterator();
    $row = array();
    $operations = array();
    $bool_both = $bool_one = FALSE;
    if (!empty($rowIterator)) {
      foreach($rowIterator as $row){
        if ($row->getRowIndex() == 1) {
          continue;
        }
        $cellIterator = $row->getCellIterator();
        foreach ($cellIterator as $cell) {
          $data[$row->getRowIndex()][$cell->getColumn()] = $cell->getCalculatedValue();
        }
        $row = $data[$row->getRowIndex()];
        $row['type'] = $type_migration;

        switch ($trans_type) {
          case 'both_lang':
            $bool_both = TRUE;
            $operations[] = ['\Drupal\cp_migrate\addImportContentBothLangs::addImportContentItemBothLangs', [$row]];
            break;
          
          case 'one_lang':
            $bool_one = TRUE;
            $operations[] = ['\Drupal\cp_migrate\addImportContentOneLang::addImportContentItemOneLang', [$row]];
            break;
        }
      }

      $batch = array(
        'title' => t('Importing Data...'),
        'operations' => $operations,
        'init_message' => t('Import is starting.'),
      );
      if ($bool_both) {
        $batch['finished'] = '\Drupal\cp_migrate\addImportContentBothLangs::addImportContentItemCallback';
      }
      elseif ($bool_one) {
        $batch['finished'] = '\Drupal\cp_migrate\addImportContentOneLang::addImportContentItemCallback';
      }
      batch_set($batch);
    }
  }

}

