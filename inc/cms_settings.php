<?php include_once("inc/SessionClass.php");
	$session = new Session();
	$session->closeSession();
	header( 'Location: user_login.php' );
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link href="css2/admin.css" type="text/css" rel="stylesheet"/>
<link href="css2/cms_settings_layout.css" type="text/css" rel="stylesheet"/>
<script type="text/javascript" src="inc/js/Utilities.js"></script>
<script type="text/javascript" src="inc/js/textFunctions.js"></script>
<script type="text/javascript" src="inc/js/PageSwitch.js"></script>

<title>Untitled Document</title>
</head>

<?php
include_once("inc/DataBaseClass.php");

?>
<body id="body" onload="init();">
<div id="header">
	<div id="header_border">
	
    <span id="tabs">				<!-- TABS -->
    	
    	<a class="inactivetab" href="authentication.php?page=cat_manager">	<!-- Write php or java script to insert dynamic tabs here -->
        	<span class="leftimg"></span>
            <span class="rightimg"></span>
            <span class="middle">Менеджер разделов</span>
        </a>
        
        <a class="activetab">	<!-- Write php or java script to insert dynamic tabs here -->
        	<span class="leftimg"></span>
            <span class="rightimg"></span>
            <span class="middle">Настройки</span>
        </a>
        
        <a class="inactivetab" href="authentication.php?page=vouchers">	
        	<span class="leftimg"></span>
            <span class="rightimg"></span>
            <span class="middle">Ваучеры</span>
        </a>		
        
        <a class="inactivetab" href="cms_users.php">	<!-- Write php or java script to insert dynamic tabs here -->
        	<span class="leftimg"></span>
            <span class="rightimg"></span>
            <span class="middle">Юзеры</span>
        </a>						
    </span>
    </div>
    <a id="logmeout">Logout</a>
</div>

<div id="wrapper">
    <table id="input_fields">
    	<tr>
        	<td class="labels"><a id="price_label">Цена за продукт</a></td><td><input type="text" id="price_field" maxlength="6" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="delivery_price_label">Цена за доставку</a></td><td><input type="text" id="delivery_price_field" maxlength="6" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="templates_per_page_label">Количество дизайнов на страницу</a></td><td><input type="text" id="templates_per_page" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="paypal_label">PayPal Token</a></td><td><input type="text" id="paypal" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="contact_email_label">Контактный email</a></td><td><input type="text" id="contact_email" /></td>
        </td>
        <tr id="spliter_cell">
        	<td></td>
        </tr>
        <tr>
        	<td class="labels"><a id="old_login_label">Старый логин</a></td><td><input type="text" id="old_login" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="email_input_label">Новый логин</a></td><td><input type="text" name="form_field" id="email_input" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="old_password_label">Старый пароль</a></td><td><input type="text" id="old_password" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="paswd_input_label">Новый пароль</a></td><td><input type="text" name="form_field" id="paswd_input" /></td>
        </td>
        <tr>
        	<td class="labels"><a id="confpaswd_input_label">Подтвердить пароль</a></td><td><input type="text" name="form_field" id="confpaswd_input" /></td>
        </td>    
		
    </table>
</div>
<script type="text/javascript" src="inc/js/validateForm.js"></script>
<script type="text/javascript">

function init(){
	var price_store,
		delivery_price_store,
		templates_per_page_store,
		paypal_store;
		
	utils = new Utilities();
	
	price_field				= document.getElementById("price_field");
	delivery_price_field	= document.getElementById("delivery_price_field");
	templates_per_page		= document.getElementById("templates_per_page");
	paypal					= document.getElementById("paypal");
	contact_email			= document.getElementById("contact_email");
	
	utils.ajax_server_path = "inc/Settings.php";
	utils.sendReceiveToID(null, "get_settings=1", 
			function(values){
				price_store				 = price_field.value			= values[1];
				delivery_price_store	 = delivery_price_field.value	= values[2];
				templates_per_page_store = templates_per_page.value		= values[0];
				paypal_token			 = paypal.value					= values[3];
				contact_email_store		 = contact_email.value			= values[4];
			}
	);
	
	price_field.onchange = function(){
		var self = this;
		c = confirm("Изменить цену за продукт?");
		
		if(c){
			utils.sendReceiveToID(null, "change_price_for_item="+this.value, function(){	price_field = self.value;	});
		} else {
			self.value = price_field;
		}
	}
	
	delivery_price_field.onchange = function(){
		var self = this;
		c = confirm("Изменить цену за доставку?");
		
		if(c){
			utils.sendReceiveToID(null, "change_price_for_delivery="+this.value, function(){	delivery_price_store = self.value;	});
		} else {
			self.value = delivery_price_store;
		}
	}
	
	templates_per_page.onchange = function(){
		var self = this;
		c = confirm("Изменить количество шаблонов на страницу?");
		
		if(c){
			utils.sendReceiveToID(null, "change_templates_per_page="+this.value, function(){	templates_per_page_store = self.value;	});
		} else {
			self.value = templates_per_page_store;
		}
	}
	
	paypal.onchange = function(){
		var self = this;
		c = confirm("Изменить токен?");
		
		if(c){
			utils.sendReceiveToID(null, "change_token="+this.value, function(){	paypal_token = self.value;	});
		} else {
			self.value = paypal_token;
		}
	}
	
	contact_email.onchange = function(){
		var self = this;
		c = confirm("Изменить email?");
		
		if(c){
			utils.sendReceiveToID(null, "change_contact_email="+this.value, function(){	contact_email_store = self.value;	});
		} else {
			self.value = contact_email_store;
		}
	}
	
}

</script>
</body>
</html>








