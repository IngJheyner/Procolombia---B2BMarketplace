<?php
/**
 * @file
 * Change states company and products
 */

namespace Drupal\cp_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Access\AccessResult;
use Drupal\node\Entity\Node;
use Drupal\cp_core\Controller\CpCoreController;

/**
 * Controller for functions procolombia catalogo core.
 */
class CpCoreChgStatesController extends ControllerBase {

	/**
	 * Function to change state in companies and products
	 */
	public function changeStates() {
		$config = $this->config('cp_core.change_state_settings');
		$bool_chg_status = $config->get('bool_chg_status');
		$num_days = $config->get('num_days');

		if ($bool_chg_status) {
			$old_time = time() - ($num_days * 86400);

			// Companies
			$database = \Drupal::database();
			$query = $database->select('node__field_states', 'nfs');
			$query->join('node_field_data', 'nfd', 'nfs.entity_id = nfd.nid');
			$query->join('node__field_semaphore_category', 'nfc', 'nfs.entity_id = nfc.entity_id');
			$query->join('taxonomy_term__field_admin_advisor', 'tfa', 'nfc.field_semaphore_category_target_id = tfa.entity_id');
			$query->join('users_field_data', 'ufd', 'tfa.field_admin_advisor_target_id = ufd.uid');
			$query->addField('nfs', 'field_states_value', 'state');
			$query->addField('nfd', 'title');
			$query->addField('nfd', 'changed');
			$query->addField('nfd', 'nid');
			$query->addField('ufd', 'mail');
			$query->condition('nfs.bundle','company');
			$query->condition('nfs.langcode','en');
			$query->condition('nfd.langcode','en');
			$query->condition('nfs.field_states_value','waiting');
			$query->condition('nfd.type','company');
			$query->condition('nfd.changed', $old_time, '<');
			$query->condition('nfc.bundle','company');
			$query->condition('tfa.bundle','categories_flow_semaphore');
			$result = $query->execute()->fetchAll();
			if (!empty($result)) {
				$asesores = [];
				foreach ($result as $key => $val) {
					$asesores[$val->mail][] = $val->title;
					$company = Node::load($val->nid);
					$company->field_states->value = 'no_resp';
					$company->save();
					if ($company->hasTranslation('es')) {
						$companyEs = $company->getTranslation('es');
						$companyEs->field_states->value = 'no_resp';
						$companyEs->save();
					}
				}

				// Send mails with asesores array
				if (!empty($asesores)) {
					$type = 'company_change_automatic_state';
					$this->sendMailChangeState($type, $asesores);
				}
			}

			// Products
			$query = $database->select('node__field_states', 'nfs');
			$query->join('node__field_pr_ref_company', 'nfcr', 'nfs.entity_id = nfcr.entity_id');
      $query->join('node__field_semaphore_category', 'nfc', 'nfcr.field_pr_ref_company_target_id = nfc.entity_id');
      $query->join('node_field_data', 'nfd', 'nfcr.entity_id = nfd.nid');
      $query->join('taxonomy_term__field_admin_advisor', 'tfa', 'nfc.field_semaphore_category_target_id = tfa.entity_id');
      $query->join('users_field_data', 'ufd', 'tfa.field_admin_advisor_target_id = ufd.uid');
      $query->addField('nfd', 'nid');
      $query->addField('nfd', 'langcode');
      $query->addField('ufd', 'mail');
      $query->condition('nfs.bundle','product');
      $query->condition('nfs.field_states_value','waiting');
      $query->condition('nfcr.bundle','product');
      $query->condition('nfc.bundle','company');
      $query->condition('nfd.type','product');
      $query->condition('nfd.status','0');
      $query->condition('nfd.changed', $old_time, '<');
      $query->condition('tfa.bundle','categories_flow_semaphore');
      $query->groupBy('nfd.nid');
      $query->groupBy('nfd.langcode');
      $query->groupBy('ufd.mail');
			$result = $query->execute()->fetchAll();

      if (!empty($result)) {
        $asesores = [];
        foreach ($result as $key => $val) {
          $asesores[$val->mail][$val->langcode][] = $val->nid;
          $product = Node::load($val->nid);
          if ($product->hasTranslation($val->langcode)) {
            $productEs = $product->getTranslation($val->langcode);
            $productEs->field_states->value = 'no_resp';
            $productEs->save();
          }
          unset($product);
        }

        // Send mails with asesores array
        if (!empty($asesores)) {
          $type = 'product_change_automatic_state';
          $this->sendMailChangeState($type, $asesores, TRUE);
        }
      }
		}

		return [
      '#markup' => 'Cambio de estados',
    ];
	}


	/**
	 * Function to send email
	 * @return AccessResult access
	 */
	public function sendMailChangeState($type, $asesores, $products = false) {
		if (!empty($asesores)) {
			foreach ($asesores as $mail => $companies) {
				$coreController = new CpCoreController;
				$mail = 'duvan.bustos@esinergia.co';
				$prmsts = array(
          'key' => $type,
          'user_type' => 'asesor',
          'count_companies' => count($companies),
        );

        // Number of products for language
				if ($products) {
				  if ($companies['es']) {
            $prmsts['count_es'] = count($companies['es']);
          }
				  if ($companies['en']) {
            $prmsts['count_en'] = count($companies['en']);
          }
        }

        $info = $coreController->_cp_core_get_body_and_subject_mail($prmsts);
        $coreController->_cp_core_send_mail($mail, $type, $info['body'], $info['subject']);
			}
		}
	}


	/**
	 * Function that verifies access to change status in companies and products
	 * @return AccessResult access
	 */
	public function accessChangeState() {
		$params = \Drupal::request()->query->all();
		$bool_empty = !empty($params);
		$bool_isset = isset($params['token']);
		if ($bool_empty && $bool_isset && $params['token'] == 'AY8jh523kS') {
			return AccessResult::allowed();
		}
		return AccessResult::forbidden();
	}

}

