<?php
include_once("../../inc/SessionClass.php");
include_once("../../inc/DataBaseClass.php");

$session    = new Session();
$db         = new DataBase();
$login      = $session->getSessionValue("user_login");
$password   = $session->getSessionValue("user_password");

$login_page = "../../cmslogin/";

if($login && $password){
    $result = mysql_query("SELECT * FROM settings WHERE email = '$login'");
    if($result){
        $user_data = mysql_fetch_assoc($result);
         
        if($user_data && $login === $user_data['email'] && $password === $user_data['password']){
            
            // Enter Edit Mode and Carry on with this page
            // $session->setSessionValue("editmode", true);
        
        } else {
            redirectToPage($login_page);
        }
    } else {
        redirectToPage($login_page);
    }
} else {
    redirectToPage($login_page);
}

function redirectToPage($page){
    echo"<script type='text/javascript'>window.location = '$page'</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Canvas Manager</title>
    <link href="../../assets/js/jHtmlArea/style/jHtmlArea.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/sales-style.css" rel="stylesheet" type="text/css" />
    <link type="text/css" rel="stylesheet" href="../../assets/js/DatePicker/jquery.ui.datepicker.min.css" />
    <link type="text/css" rel="stylesheet" href="../../assets/js/DatePicker/jquery-ui-1.10.3.custom.min.css" />
    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="../assets/css/ie8-FontsFormat.css" />
        <script src="../assets/js/html5shiv.min.js"></script>
    <![endif]-->
</head>

<body>
	<header>
		<nav>
			
		</nav>
	</header>

	<main>
		<?php
			
			// include_once("../../inc/DataBaseClass.php");
            ini_set("log_errors", 1);
            $date = date("d-m-y");
            ini_set("error_log", "../../error_log/php-error$date.log");
    		// $db = new DataBase();
    		
    		$current_page = isset($_GET["page"]) ? $_GET["page"] : 1;
    		$per_page = isset($_GET["perpage"]) ? $_GET["perpage"] : 40;
    		if(isset($_GET["time"])){
    			$timeframe = $_GET["time"];
                if (isset($_GET["fromtime"]) && isset($_GET["totime"])) {
                    $tf = strtotime( $_GET["fromtime"]);
                    $tt = strtotime( $_GET["totime"] );
                    $from_time = date("Y-m-d H:i:s", $tf);
                    $to_time = date("Y-m-d H:i:s", $tt);

                }
    			switch($timeframe){
    				case "today" : $where_time = "AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)"; break;
    				case "month" : $where_time = "AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)"; break;
    				case "year"  : $where_time = "AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)"; break;
                    case "range" : $where_time = "AND payment_date <= '$from_time' AND payment_date >= '$to_time'"; break;
    				default : $where_time = "";
    			}
    		} else {
                $from_time = date("Y-m-d H:i:s");
                $to_time = date("Y-m-01 H:i:s");

                $timeframe = "range";
                $where_time = "AND payment_date <= '$from_time' AND payment_date >= '$to_time'";

                $timeframe = "range&fromtime=$from_time&totime=$to_time";
    		}

            if(isset($_GET["time"]) && $_GET["time"] == "range"){
                $timeframe .= "&fromtime=".$_GET["fromtime"]."&totime=".$_GET["totime"];
            }

            // Get payment dates of the first and the last item
            $timeA_res = mysql_query("SELECT payment_date FROM completed_payments WHERE payment_date >= '2014-12-01 00:00:00' $where_time ORDER BY payment_date DESC LIMIT 1");
            if($timeA_res && mysql_num_rows($timeA_res)){
                $first_item_date = mysql_result($timeA_res,0);
            }

            $timeB_res = mysql_query("SELECT payment_date FROM completed_payments WHERE payment_date >= '2014-12-01 00:00:00' $where_time ORDER BY payment_date ASC LIMIT 1");
            if($timeB_res && mysql_num_rows($timeB_res)){
                $last_item_date = mysql_result($timeB_res,0);
            }

            // count pages                    
            $numres = mysql_query("SELECT order_number FROM completed_payments WHERE payment_date > '2014-12-01 00:00:00' $where_time");
    		$tot_pages = ceil(mysql_num_rows($numres) / $per_page);

            date_default_timezone_set("Europe/London");

            $a = ($current_page * $per_page)-$per_page;
    		$result = mysql_query("SELECT * FROM completed_payments WHERE payment_date >= '2014-12-01 00:00:00' $where_time ORDER BY payment_date DESC LIMIT $a, $per_page");
    		if($result){
    			$output = "<table>
								<tr>
									<td><input type='text' class='per-page-inp' value='$per_page'/> На страницу </td>
									<td><button class='gray-butt prev-page-butt' title='Предыдущая страница' data-page='$current_page'><-</button></td>
									<td><input type='text' class='go-to-page-inp' value='$current_page'/> of $tot_pages</td>
									<td><button class='gray-butt next-page-butt' title='Следущая страница' data-page='$current_page' data-tot_pages='$tot_pages'>-></button></td>
                                    <td><input type='text' id='date-to' class='date-picker'/> - <input type='text' id='date-from' class='date-picker'/></td>
									<td><button class='gray-butt' id='today-butt' title='Показать все заказы за сегодняшний день'>За сутки</button></td>
									<td><button class='gray-butt' id='month-butt' title='Показать все заказы за последний месяц'>За месяц</button></td>
									<td><button class='gray-butt' id='year-butt' title='Показать все заказы за последний год'>За год</button></td>
									<td><button class='gray-butt' id='allrecords-butt' title='Показать все заказы'>Все заказы</button></td>
									<td>&nbsp;&nbsp;&nbsp;</td>
									<td><button class='gray-butt' id='send-review-invitation' title='Выслать приглашение оставить отзыв для заказов старше одной недели.'>Выслать Email для отзывов</button></td>
								</tr>
							</table><input type='hidden' id='timeframe' value='$timeframe'/>";

                $output.="<div id='sales-stats'>
                            <span id='incomestat'>
                                <h3 class='stat-header'>Приход</h3>
                                <h1 class='stat-value'>
                                </h1>
                            </span>
                            <span id='printsstat'>
                                <h3 class='stat-header'>Кол-во распечаток</h3>
                                <h1 class='stat-value'>
                                </h1>
                            </span>
                            <span id='ordersstat'>
                                <h3 class='stat-header'>Кол-во Заказов</h3>
                                <h1 class='stat-value'>
                                </h1>
                            </span>
                            <span id='vouchersstat'>
                                <h3 class='stat-header'>Кол-во Ваучеров</h3>
                                <h1 class='stat-value'>
                                </h1>
                            </span>
                            <span id='webpaymentsstat'>
                                <h3 class='stat-header'>Оплат через сайт</h3>
                                <h1 class='stat-value'>
                                </h1>
                            </span>
                          </div>";

    			$output.= "<table id='data-table'><tr><th>Дата и время заказа</th><th>Номер заказа</th><th>Оплата</th><th>Адрес клиента</th><th>E-mail клиента</th><th>Отзыв</th><th>Оплаченная сумма</th><th>Продукт и кол-во</th></tr>";
    			
                while($row = mysql_fetch_assoc($result)){
    				//---------------------------------------------------------------------------------
    				$items_output = "";
    				$items_codes = json_decode($row["items"]); // Items data in json
    				if(is_array($items_codes)){ // If json successfully decoded
    					foreach ($items_codes as $obj) { // Loop through individual items
    						if(file_exists("../../paid_orders/".$obj->item_id."/")){ // If unique item's folder exists
	    						$dir_list = scandir("../../paid_orders/".$obj->item_id."/"); // Scan files in dirrectory
	    						$items_output.= "<a class='orde-folder-link' data-item_id='".$obj->item_id."'>".$obj->item_id." x".$obj->qty."</a></br>";
	    						if(is_array($dir_list)){
	    							$items_output.="<div class='files-window ".$obj->item_id."'><button class='close-butt'>X</button>";
	    							foreach ($dir_list as $dir_item) {
	    								if(is_file("../../paid_orders/".$obj->item_id."/".$dir_item)){
	    									$items_output.="<a class='download-link' href='/paid_orders/".$obj->item_id."/".$dir_item."' target='_blank'>$dir_item</a></br>";
	    								}
	    							}
	    							if(file_exists("../../paid_orders/".$obj->item_id."/thumbnails")){
										$sub_dir_list = scandir("../../paid_orders/".$obj->item_id."/thumbnails/");
										if(is_array($sub_dir_list)){
											foreach ($sub_dir_list as $sub_dir_item) {
			    								if(is_file("../../paid_orders/".$obj->item_id."/thumbnails/".$sub_dir_item)){
			    									$items_output.="<a  class='download-link' href='/paid_orders/".$obj->item_id."/thumbnails/".$sub_dir_item."' target='_blank'>/thumbnails/$sub_dir_item</a></br>";
			    								}
			    							}
										}
									}
	    							$items_output.="</div>";
	    						}
	    					} else {
	    						$items_output.= "<a class='orde-folder-link exist-not' data-item_id='".$obj->item_id."'>".$obj->item_id." x".$obj->qty."</a></br>";
	    					}
    					}
    				} else {
    					$items_array = array();
    					$pieces = explode("[**]", $row["items"]);
    					if(is_array($pieces)){
	    					foreach ($pieces as $id_qty_str) {
	    						$id_qty_arr = explode("[><]", $id_qty_str);
	    						array_push( $items_array, (object)array("item_id"=>$id_qty_arr[0], "qty"=>$id_qty_arr[1]));
	    						$items_output.= "<a class='orde-folder-link'>".$id_qty_arr[0]." x".$id_qty_arr[1]."</a></br>";
	    					}
	    				} else {
	    					$id_qty_arr = explode("[><]", $id_qty_str);
	    					array_push( $items_array, (object)array("item_id"=>$id_qty_arr[0], "qty"=>$id_qty_arr[1]));
	    					$items_output.= "<a class='orde-folder-link'>".$id_qty_arr[0]." x".$id_qty_arr[1]."</a></br>";
	    				}

	    				$json_encoded_items = json_encode($items_array);

	    				$res_json_convert = mysql_query("UPDATE completed_payments SET items = '$json_encoded_items' WHERE order_number =".$row["order_number"]);

    				}

    				//---------------------------------------------------------------------------------
    				$popupwindow = "";
    				if($row["user_review"] != null){
    					$data = json_decode($row["user_review"]);
    					if(is_object($data) && property_exists($data, "review")){

    						$review_status = "received";
    						$r_status_text = "Отзыв";
    						$popupwindow = "<div class='review-window' id='window".$row["order_number"]."'><p>Дата: ".$data->date."</p><p>Оценка: ".$data->rating."</p><p>".html_entity_decode($data->review)."</p><button class='close-butt' data-windowid='".$row["order_number"]."'>X</button></div>";
    					} else {
    						$review_status = "sent";
    						$r_status_text = "Выслан";
    					}
    				} else {
    					$review_status = "not-sent";
    					$r_status_text = "Не выслан";
    				}

    				//---------------------------------------------------------------------------------

    				$v_code = $row["payment_type"] == "instant" ? "Без Ваучера</td>" : "Ваучер: ".$row["voucher_code"];
    				$gross_paid = $row["mc_gross"] != null ? "£".$row["mc_gross"] : "Нет информации";
                    $output.= "<tr>";
                    $output.= 	"<td>".date( "d M Y H:i" , strtotime($row["payment_date"]))."</td>";
                    $output.= 	"<td>".$row["order_number"]."</td>";
    				$output.= 	"<td>".$v_code."</td>";
    				$output.= 	"<td>".$row["first_name"]." ".$row["last_name"]."</br>".$row["address_street"]."</br>".$row["address_zip"]." ".$row["address_city"]."</br>".$row["address_country"]."</td>";
    				$output.= 	"<td>".$row["payer_email"]."</td>";
    				$output.= 	"<td><div class='review-status $review_status'>$r_status_text</div>$popupwindow</td>";
    				$output.= 	"<td>".$gross_paid."</td>";
    				$output.= 	"<td>".$items_output."</td>";
    				$output.= "</tr>";
    			}
                
                if(isset($from_time) && isset($to_time)){
                    $first_item_date = $from_time;
                    $last_item_date = $to_time;
                }

                if(isset($first_item_date) && isset($last_item_date)){
                    $tf = strtotime($first_item_date);
                    $first_item_date = date("d M Y", $tf);
                    
                    $tl = strtotime($last_item_date);
                    $last_item_date = date("d M Y", $tl);

                    $output.= "<input type='hidden' id='date-keeper' data-datefrom='$first_item_date' data-dateto='$last_item_date'/>";
                }

    			$output.= "</table>";
    			$output.= "<table class='bottom-table'>
								<tr>
									<td><input type='text' class='per-page-inp' value='$per_page'/> На страницу </td>
									<td><button class='prev-page-butt' title='Предыдущая страница' data-page='$current_page'><-</button></td>
									<td><input type='text' class='go-to-page-inp' value='$current_page'/> of $tot_pages</td>
									<td><button class='next-page-butt' title='Следущая страница' data-page='$current_page' data-tot_pages='$tot_pages'>-></button></td>
								</tr>
							</table>";
    			timeRangeStats( $where_time );
                echo $output;
                
    		} else{
                echo mysql_error();
            }

            function timeRangeStats( $where_time ){
                $time_range_res = mysql_query("SELECT * FROM completed_payments WHERE payment_date >= '2014-12-01 00:00:00' $where_time");
                if($time_range_res){
                    
                    $total_income = 0;
                    $total_orders = 0;
                    $total_items = 0;
                    $total_vauchers = 0;
                    $total_website_paiments = 0;

                    while ($row = mysql_fetch_array($time_range_res)) {
                        $total_income += ($row["mc_gross"] != null && is_numeric($row["mc_gross"]))? round($row["mc_gross"], 2) : 0;
                        $items_codes = json_decode($row["items"]); // Items data in json
                        if(is_array($items_codes)){ // If json successfully decoded
                            foreach ($items_codes as $obj){
                                $total_items += $obj->qty;
                            }
                        }
                        if($row["payment_type"] == "instant"){
                            $total_website_paiments += 1;
                        } else {
                            $total_vauchers += 1;
                        }

                        $total_orders++;
                    }
                    $total_income = round($total_income, 2);
                    echo "<input type='hidden' id='stats' data-income='$total_income' data-prints='$total_items' data-orders='$total_orders' data-numvauchers='$total_vauchers' data-webpayments='$total_website_paiments'>";
                }
            }
		?>
	</main>

	<footer>
	</footer>
</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.storageapi.min.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/DatePicker/jquery.ui.core.min.js"></script>
<script type="text/javascript" src="../../assets/js/DatePicker/jquery.ui.widget.min.js"></script>
<script type="text/javascript" src="../../assets/js/DatePicker/moment.min.js"></script>
<script type="text/javascript" src="../../assets/js/DatePicker/jquery.ui.datepicker.min.js"></script>
<script type="text/javascript" src="../../assets/js/main_sales.js"></script>
</html>