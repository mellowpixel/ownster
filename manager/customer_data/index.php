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
<title>Customer Session History</title>
    <link href="../../assets/js/jHtmlArea/style/jHtmlArea.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/sales-style.css" rel="stylesheet" type="text/css" />

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
    		$per_page = isset($_GET["perpage"]) ? $_GET["perpage"] : 20;
    		if(isset($_GET["time"])){
    			$timeframe = $_GET["time"];
    			switch($timeframe){
    				case "today" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 DAY)"; break;
    				case "month" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)"; break;
    				case "year" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)"; break;
    				default : $where_time = "";
    			}
    			
    		} else {
    			$timeframe = "all";
    			$where_time = "";
    		}

    		$a = ($current_page * $per_page)-$per_page;
		    		
    		$numres = mysql_query("SELECT id FROM user_history $where_time");

    		$tot_pages = ceil(mysql_num_rows($numres) / $per_page);

    		$result = mysql_query("SELECT * FROM user_history $where_time ORDER BY payment_date DESC LIMIT $a, $per_page");
    		

    		if($result){
    			$output = "<table>
								<tr>
									<td><input type='text' class='per-page-inp' value='$per_page'/> На страницу </td>
									<td><button class='gray-butt prev-page-butt' title='Предыдущая страница' data-page='$current_page'><-</button></td>
									<td><input type='text' class='go-to-page-inp' value='$current_page'/> of $tot_pages</td>
									<td><button class='gray-butt next-page-butt' title='Следущая страница' data-page='$current_page' data-tot_pages='$tot_pages'>-></button></td>
									<td><button class='gray-butt' id='today-butt' title='Показать историю за сегодняшний день'>Все за сегодня</button></td>
									<td><button class='gray-butt' id='month-butt' title='Показать историю за последний месяц'>Все за месяц</button></td>
									<td><button class='gray-butt' id='year-butt' title='Показать историю за последний год'>Все за год</button></td>
									<td><button class='gray-butt' id='allrecords-butt' title='Показать всю историю'>Вся история</button></td>
								</tr>
							</table><input type='hidden' id='timeframe' value='$timeframe'/>";

    			$output.= "<table id='data-table' class='user-history-table'><tr><th>Дата и время заказа</th><th>email</th><th>Имя</th><th>Данные о заказе</th><th>Адрес клиента</th><th>ОС</th><th>Тип Агента</th><th>Браузер</th><th>Движок</th><th>Моб. устр-тво</th><th>Моб. Браузер</th><th>Моб. ОС</th><th>Путь по Сайту</th><th>PHP память</th></tr>";
    			while($row = mysql_fetch_assoc($result)){
    				//---------------------------------------------------------------------------------
    				$output.= "<tr>";
                    
                    $output.= "<td>". $row["payment_date"]   ."</td>";
                    $output.= "<td>". $row["email"]          ."</td>";
                    $output.= "<td>". $row["name"]           ."</td>";

                    $order_details = json_decode($row["order_data"]);
                    // echo"<script>console.log(".json_encode($order_details).")</script>";
                    $cycledout = "";
                    if (is_array($order_details)) {
                        foreach ($order_details as $value) {
                            $cycledout.= $value->order_id.
                                    "<br/>£".$value->item_price." x ".$value->order_qty ." = £".$value->order_total_price ."<br/>";
                        }
                    }
                    $output.= "<td>". $cycledout             ."</td>";
                    $output.= "<td>". $row["address"]        ."</td>";
                    $output.= "<td>". $row["os"]             ."</td>";
                    $output.= "<td>". $row["ua_type"]        ."</td>";
                    $output.= "<td>". $row["browser"]        ."</td>";
                    $output.= "<td>". $row["engine"]         ."</td>";
                    $output.= "<td>". $row["mobile_divice"]  ."</td>";
                    $output.= "<td>". $row["mobile_browser"] ."</td>";
                    $output.= "<td>". $row["mobile_os"]      ."</td>";
                    // $output.= "<td>". $row["user_path"]      ."</td>";
                    $output.= "<td class='popup-cell' data-output='".$row["user_path"]."'>Показать</td>";

                    $php_memory = json_decode($row["php_memory"]);
                    if(is_object($php_memory)){
                        $memory_data_out = "";
                        foreach ($php_memory as $key => $value) {
                            $memory_data_out .= "<h3>$key</h3>";
                            $memory_data_out .= "<ol>";
                            foreach ($value as $val) {
                                $time = "";
                                if(isset($val->time)){
                                    $time = $val->time;
                                }
                                $memory_data_out .= "<li>".$time." ".$val->function." ".$val->memory_used."</li>";
                            }
                            $memory_data_out .= "</ol>";
                        }
                    }
                    $output.= "<td class='popup-cell' data-output='$memory_data_out'>Показать</td>";
                    $output.= "</tr>";

                    // echo"<script>console.log(".json_encode($php_memory).")</script>";
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
    			echo $output;
    		}
		?>
    <div id="popupwindow">
        <button class='close-butt'>X</button>
        <div class="window-content">
        </div>
    </div>
	</main>

	<footer>
	</footer>
</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.storageapi.min.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/main_sales.js"></script>
</html>