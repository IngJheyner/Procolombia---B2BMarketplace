/**
 * @file
 * Global utilities.
 *
 */
(function($, Drupal) {

  'use strict';

  Drupal.behaviors.matchmaking_pro = {
    attach: function(context, settings) {

      // Custom code here 
			//When form is load open modal     
			document.addEventListener('load', function(e) {
				let modalFirstStep = document.getElementById('legal-modal');
				let showFirstStepModal = new bootstrap.Modal(modalFirstStep, {})
				modalFirstStep.classList.add('modal');
				const btnAgreeFirstSt = document.querySelector('.agree-stp1');
				//open modal first step form when is first time loading page and hide it when is continue clicked
				if(window.location.hash !== "#cp-core-multistep-form" ) {
					showFirstStepModal.show();
					hideModal(btnAgreeFirstSt,showFirstStepModal);					
				}else{
					showFirstStepModal.hide();
				}
				function hideModal(btn, modal){
						e = e || n;
						btn.addEventListener('click',()=>{
						modal.hide();
						
					})
				}
				
	
			}, true);
    }
  };

})(jQuery, Drupal);