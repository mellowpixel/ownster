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
    <link href="../../assets/css/client-reviews-style.css" rel="stylesheet" type="text/css" />

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
        <div class='center'>
        <?php
            
            // include_once("../../inc/DataBaseClass.php");
            ini_set("log_errors", 1);
            $date = date("d-m-y");
            ini_set("error_log", "../../error_log/php-error$date.log");
            
            // $db = new DataBase();
            date_default_timezone_set("Europe/Riga");
            $current_page = isset($_GET["page"]) ? $_GET["page"] : 1;
            $per_page = isset($_GET["perpage"]) ? $_GET["perpage"] : 20;
            if(isset($_GET["time"])){
                $timeframe = $_GET["time"];
                switch($timeframe){
                    case "today" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 DAY) AND user_review IS NOT NULL"; break;
                    case "month" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 MONTH) AND user_review IS NOT NULL"; break;
                    case "year" : $where_time = "WHERE payment_date > DATE_SUB(NOW(), INTERVAL 1 YEAR) AND user_review IS NOT NULL"; break;
                    default : $where_time = "WHERE user_review IS NOT NULL";
                }
                
            } else {
                $timeframe = "all";
                $where_time = "WHERE user_review IS NOT NULL";
            }

            $a = ($current_page * $per_page)-$per_page;
                    
            $numres = mysql_query("SELECT user_review FROM completed_payments $where_time AND active_review IS NOT NULL");

            $tot_pages = ceil(mysql_num_rows($numres) / $per_page);

            $result = mysql_query("SELECT order_number, user_review, active_review, first_name, last_name, payer_email FROM completed_payments $where_time AND active_review IS NOT NULL ORDER BY payment_date DESC LIMIT $a, $per_page");
            

            if($result){
                $output = "<table class='bottom-table'>
                                <tr>
                                    <td><input type='text' class='per-page-inp' value='$per_page'/> На страницу </td>
                                    <td><button class='prev-page-butt' title='Предыдущая страница' data-page='$current_page'><-</button></td>
                                    <td><input type='text' class='go-to-page-inp' value='$current_page'/> of $tot_pages</td>
                                    <td><button class='next-page-butt' title='Следущая страница' data-page='$current_page' data-tot_pages='$tot_pages'>-></button></td>
                                    <td><button class='gray-butt' id='today-butt' title='Показать все заказы за сегодняшний день'>Все за сегодня</button></td>
                                    <td><button class='gray-butt' id='month-butt' title='Показать все заказы за последний месяц'>Все за месяц</button></td>
                                    <td><button class='gray-butt' id='year-butt' title='Показать все заказы за последний год'>Все за год</button></td>
                                    <td><button class='gray-butt' id='allrecords-butt' title='Показать все заказы'>Все отзовы</button></td>
                                </tr>
                            </table><input type='hidden' id='timeframe' value='$timeframe'/>";

                echo $output;
                //---------------------------------------------------------------------------------
                while($row = mysql_fetch_assoc($result)){
                    $data = json_decode($row["user_review"]);

                    // echo"<script>console.log(".json_encode($row["user_review"]).")</script>";

                    if(is_object($data) && property_exists($data, "review")){
                        
                        echo "<div class='review_block'>";

                        echo "<div class='rating'>";
                        for($i = 0; $i < 5; $i++ ){
                            if($i < $data->rating){
                                /*  &#9733; full
                                    &#9734; empty   */
                                echo "<a class='star'>&#9733;</a>";
                            } else {
                                echo "<a class='star'>&#9734;</a>";
                            }
                        }
                        $checked = ($row["active_review"] == 1) ? "checked" : ""; 
                        echo "</div>";
                        echo "<div class='review-text'>".html_entity_decode($data->review)."</div>";
                        echo "<div class='details-wrapper'>
                                <table>
                                    <tr>
                                        <td>".$row["first_name"]."</td>
                                        <td>".$row["last_name"].",</td>
                                        <td>".$row["payer_email"].",</td>
                                        <td>".$data->date."</td>
                                        <td><input type='checkbox' id='review".$row["order_number"]."' data-orderid = '".$row["order_number"]."' $checked /><label for='review".$row["order_number"]."'>Виден</label></td>
                                    </tr>
                                </table>
                            </div>";   
                        echo "</div>";
                    }
                }
            }
        ?>
        </div>
    </main>

    <footer>
    </footer>
</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.storageapi.min.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/main_client_reviews.js"></script>
</html>