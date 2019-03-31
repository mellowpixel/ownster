<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/assets/php/SharedFunctions.php");
include_once("$root/inc/DataBaseClass.php");

class OccasionsConfig
{
	public $opt,
		   $errors = array("error"=>false, "error_msg"=>array()),
		   $occasion_url = "";
	
	public function __construct($options = NULL) {
		$this->extendOptions($options);

		$this->prices = (object)array(
						"notebooks_from"	=>"£7.99",
						"wallets_from"		=>"£5.99"
					);

		if(isset($this->opt->occasion)){

			$db = new DataBase();
			$document_path = $_SERVER["REQUEST_URI"];
	        $url_levels = explode("/", $document_path);
	        $this->occasion_url = "/".implode("/", array($url_levels[1], $url_levels[2]))."/";
	        

			switch ($this->opt->occasion) {
				case 'valentines':

					// Top of the page menu links in the current occasion

					$this->links = array("lanscape_wallets_page"=>array(
												"url"=>"/occasions/valentines-day/personalised-travel-card-holders-landscape/", 
												"name"=>"Travel Card Holders - Lanscape" ),
									 
											"portrait_wallets_page"=>array(
											 	"url"=>"/occasions/valentines-day/personalised-travel-card-holders-portrait/", 
											 	"name"=>"Travel Card Holders - Portrait" )
											
									 		/*"notebooks_page"=>array(
											 	"url"=>"/occasions/valentines-day/personalised-notebooks/", 
											 	"name"=>"Travel Card Holders - Portrait"
											)*/
										);
					switch ($this->opt->level) {

						// --- Page /occasions/valentines-day/ 
						
						case 'select product group':
								$this->page = (object)array(
								
									"page_title"		 => "VALENTINE'S DAY GIFTS",
									"page_description"	 => "For Someone You Love!",
									"num_columns"		 => "2",
									
									"group_blocks" => array(array(
										/* * Landscape Wallets Group */ 
										(object)array(
											"group_description"	 => "<h3>Personalised Travel Card Holders - Lanscape</h3><p>24H Despatch, Free UK Shipping, from only {$this->prices->wallets_from}</p>",
											"group_link_to" 	 => $this->links['lanscape_wallets_page']['url'],
											"group_img"  		 => "/assets/layout-img/occasions/valentines/lscape_wallet.jpg"
										),

										/* * Landscape Wallets Group */ 
										(object)array(
											"group_description"  => "<h3>Personalised Travel Card Holders - Portrait</h3><p>24H Despatch, Free UK Shipping, from only {$this->prices->wallets_from}</p>",
											"group_link_to" 	 => $this->links['portrait_wallets_page']['url'],
											"group_img" 		 => "/assets/layout-img/occasions/valentines/portrait_wallet.jpg"
										)

										/* * Notebooks Group */ 
										/*(object)array(
											"group_description"  => "<h3>Personalised Notebooks</h3><h4 class='green'>Page patterns & variety of sizes available.</h4><p>from {$this->prices->notebooks_from}</p>",
											"group_link_to" 	 => $this->links['notebooks_page'],
											"group_img" 		 => "/assets/layout-img/occasions/valentines/notebook.jpg"
										)*/
									))
								);
						break;

						// --- Page /occasions/valentines-day/personalised-notebooks/

						case 'load notebook templates':
								
								$templates_array = loadGraphicTemplates($db, array("occasion_url"=>$this->occasion_url, 
																					"product_ids"=>array(10),
																					"product_variations"=>array("10"=>array(10, 11, 12, 13, 14, 15))
																					));
								
								$this->page = (object)array(

									"page_title"		 => "VALENTINE'S DAY GIFTS",
									"page_description"	 => "For Someone You Love!",
									"top_menu_links"	 => $this->links,
									"num_columns"		 => "3",
									
									"group_blocks" => $templates_array
								);
						break;

						// --- Page /occasions/valentines-day/personalised-travel-card-holders-landscape/

						case 'load landscape wallet templates':
								
								$templates_array = loadGraphicTemplates($db, array("occasion_url"=>$this->occasion_url, "product_ids"=>array(8)));
								
								$this->page = (object)array(

									"page_title"		 => "VALENTINE'S DAY GIFTS",
									"page_description"	 => "For Someone You Love!",
									"top_menu_links"	 => $this->links,
									"num_columns"		 => "3",
									
									"group_blocks" => $templates_array,
									"thumb_buttons" => "<button class='transparent-butt'>Personalise</button>"
								);
						break;

						// --- Page /occasions/valentines-day/personalised-travel-card-holders-portrait/

						case 'load portrait wallet templates':
								$templates_array = loadGraphicTemplates($db, array("occasion_url"=>$this->occasion_url, "product_ids"=>array(9)));
								
								$this->page = (object)array(

									"page_title"		 => "VALENTINE'S DAY GIFTS",
									"page_description"	 => "For Someone You Love!",
									"top_menu_links"	 => $this->links,
									"num_columns"		 => "3",
									
									"group_blocks" => $templates_array,
									"thumb_buttons" => "<button class='transparent-butt'>Personalise</button>"
								);
						break;
						
					} // end of switch ($this->opt->level)

				break;
				
				default:
					# code...
					break;

			} // end of switch ($this->opt->occasion)

			unset($db);
		} // end of if(isset($this->opt->occasion))
	}

	public function __destruct() {
		
	}

	//--------------------------------------------------------------------------------
	public function extendOptions( $options = NULL ){
		if($options !== NULL){
			// if $options is array convert it to object
			$this->opt = is_array($options) ? (object)$options 
											 : $options ;
			
			foreach ($options as $key => $value) {
				$this->$key = $value;
			}
			// echo "<script>console.log(".json_encode( $this ).")</script>";
		}
	}
}
?>