<?php

namespace Drupal\cp_ia_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CpIASearchController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    //get id of logged in user
    $user = \Drupal::currentUser();
    $uid = $user->id();
    return [
      // Your theme hook name.
      '#theme' => 'cp_ia_search_template_hook',
      '#uid' => $uid,
    ];
  }

  /**
   * Returns type content product based on nid.
   */
  public function getProducts(Request $request) {
    try{
      //recieve array of nids
      $nids = $request->request->get('nids');
      //convert nids in array
      $nids = explode(',', $nids);
      //paginate
      $page = $request->request->get('page');
      $limit = $request->request->get('limit');
      $offset = ($page - 1) * $limit;
      $nids = array_slice($nids, $offset, $limit);
      $products = [];
      //get node with title, description, image, and category and id
      foreach ($nids as $nid) {
        //get type of content product
        $node = \Drupal\node\Entity\Node::load($nid);
        $type = $node->getType();
        //get taxonomy term with name and id of category
        $term = \Drupal\taxonomy\Entity\Term::load($node->get('field_categorization')->target_id);
        //check if term is not null
        if ($term != null) {
          $category = $term->getName();
        } else {
          $category = 'No tiene categoría';
        };
        //get type of content company and get name of company
        $company = \Drupal\node\Entity\Node::load($node->get('field_pr_ref_company')->target_id);
        $company_name = $company->getTitle();
        if ($type == 'product') {
          $products[] = [
            'nid' => $nid,
            'title' => $node->getTitle(),
            'description' => $node->get('field_body')->value,
            'image' => NULL,
            'category' => $category,
            'company' => $company_name,
          ];
        }
      }
      return new JsonResponse([
        'success' => TRUE,
        'products' => $products,
      ]);
    } catch(\Exception $e) {
      return new JsonResponse($e->getMessage());
    }
  }
}