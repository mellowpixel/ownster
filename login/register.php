<?php include_once("../inc/SessionClass.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<meta name="description" content="Design your own travel card wallet online in few minutes with Ownster.co.uk! Upload your favourite photos and add your own text to get your unique travel card holder printed and posted in 48 hours.">
<meta name="keywords" content="Personalised Oyster Card Wallet, Personalised Travel Card Wallet, Personalised Travel Card Holder Customized Travel Card Wallet, Design Travel Card Holder, Create Travel Card Wallet, Self Design Travel Card Wallet, Self Design Travel Card Holder, Unique Gift Idea, customisation, customization, businesscard, business card, oyster, oyster wallet, oyster holder">
<meta name="author" content="Dmitry Ulyanov, dimi@inbox.com, contacts@mellowpixels.com, http://www.mellowpixels.com" />

<link href="css2/layout.css" type="text/css" rel="stylesheet" />
<link href="css2/registration_form.css" type="text/css" rel="stylesheet" />
<link rel="icon" 
      type="image/png"
      href="favicon.png">
<script type="text/javascript" src="inc/js/Utilities.js"></script>

<title>Ownster</title>
</head>

<body onload="init();">

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<!--*************************************************************************************************-->
<?php include_once("inc/DataBaseClass.php"); ?>
<div id="header">
        <a id="logo" href="index.php"></a>			<!-- LOGO -->
		

        <div id="header_border">
        
        <span id="tabs">				<!-- TABS -->
        
           <?php
				$DBase = new DataBase();
				$result = $DBase->getTabList();
				$total_rows	= mysql_num_rows($result);
				$tabs='';
				$activeTabCounter = 0;
				
				while($row = mysql_fetch_assoc($result)){
					
					if($activeTabCounter === 1){
							$tabs .= "<a class='inactivetab' onclick=\"goToPhotoUpload();\">
										<span class='leftimg'></span>
										<span class='rightimg'></span>
										<span class='middle' id='inactivetab'>Photo Upload</span>
									</a>";	
					}
					
					if($row['name'] !== "_-_-_-_-_-"){
						$tabs .= tabHTML("inactivetab", $row['name']);
					}
					if($total_rows <2){
							$tabs .= "<a class='inactivetab' onclick=\"goToPhotoUpload();\">
										<span class='leftimg'></span>
										<span class='rightimg'></span>
										<span class='middle' id='inactivetab'>Photo Upload</span>
									</a>";
						}
					$activeTabCounter++;
				}
		
				echo $tabs;
			
				
			//------------------------------------------------------------------------------------// tabHTML Function	
				function tabHTML($class_name, $tab_text){
					return "<a class='$class_name' onclick=\"LoadTabContent('".$tab_text."');\">
								<span class='leftimg'></span>
								<span class='rightimg'></span>
								<span class='middle' id='$class_name'>".$tab_text."</span>
							</a>";	
				}
			?>		
          
                                    
        </span>
        
       <div id="authentication_wrap">
            <div id="authentication">
                <?php $u_email=$session->getSessionValue("user_login"); if($u_email) echo "<a id='my_account_entrance' href='my_account.php'>".$session->getSessionValue("user_name")."'s Account</a><a class='spliter'>|</a><a id='signout'>Sign Out </a><script type='text/javascript'>is_loggedin = true</script>";  else echo "<a id='register' href='register.php'>Login / Register</a>"; ?><a class='spliter'>|</a><a id="home" href="help.php">Help </a><a id="a_basket" href="cart.php"></a>
    
            </div>
            
             <div id="socnet_panel">
            	<a id="follow_sign">Follow us on</a>
            	<a id="facebook_logo" target="_blank" href="http://www.facebook.com/ownster.co.uk"></a>
                <a id="twitter_logo" target="_blank" href="http://twitter.com/ownster_uk"></a>
                <a id="pinterest_logo" target="_blank" href="http://pinterest.com/ownster/"></a>
           </div>
        
        <div id="inf" style="position:absolute; left:10px">
        </div>
        
        </div>
    </div>

<!-- ************************************************************************************************* -->
<script type="text/javascript" src="inc/js/Utilities.js"></script>
<script type="text/javascript" src="inc/js/RegExpTest.js"></script>
<script type="text/javascript" src="inc/js/validateForm.js"></script>
<script type="text/javascript">

function init(){
	var Util 	 = new Utilities(),
		submit_butt,
		form_wrap,
		form_container;
	
	Util.ajax_server_path = "inc/userAccount.php";
	
	form_wrap 		= document.getElementById("form_wrapper")	//	{	margin-top:0px; margin-left:120px; }
	form_container	= document.getElementById("form_container");	//	{	min-height:400px;	}
	submit_butt		= document.getElementById("form_submit_butt");
	form_fields		= document.getElementsByName("form_field");
	register_message_area	= document.getElementById("register_message_area");
	
	login_wrapper 	= document.getElementById("login_wrapper")	//	{	margin-top:0px; margin-left:120px; }
	login_butt		= document.getElementById("login_butt");
	login_fields	= document.getElementsByName("login_field");
	login_table		= document.getElementById("login_table");
	
	forgot_password_table	= document.getElementById("forgot_password_table");
	forgot_password			= document.getElementById("forgot_password");
	forgot_password_instruction = document.getElementById("forgot_password_instruction");
	forgot_pass_butt		= document.getElementById("forgot_pass_butt");
	
	//	login_wrapper.style.position = "absolute";
	login_wrapper.style.marginTop	= "25px"; 
	login_wrapper.style.marginLeft	= "198px";
	login_wrapper.style.minHeight	= "40px";
	
//	form_wrap.style.position	= "absolute";
	form_wrap.style.marginTop	= "20px"; 
	form_wrap.style.marginLeft	= "210px";
	
	
	sign_out_butt 	= document.getElementById("signout");
	a_basket		= document.getElementById("a_basket");					
		
	Util.ajax_server_path = "inc/ShoppingCartServer.php";
	Util.sendReceiveToID(null, "get_total_in_basket=1", 
							function(total){ 
								if(total >0){
									remainder = total%10;
									if(remainder === 1){
										a_basket.innerHTML = total +" item";
									}else{
										a_basket.innerHTML = total +" items";	
									}
								} else {
									a_basket.innerHTML = "0 items";
							}
	});
	
	if(sign_out_butt !== null){
		sign_out_butt.onclick = function(){
			Util.ajax_server_path = "inc/userAccount.php";
			Util.sendReceiveToID(null, "user_logout=1", function(l){ window.location = "index.php";});
		}
	}
	
	
	//--------------	FORM FIELD HANDLER	------------------//
	
	
	formFieldEffect(form_fields);
	formFieldEffect(login_fields);
	
	login_butt.onclick = function(){
//		var login_data;
		
//		login_data = validateForm(login_fields);
		
//		if(!login_data.error){
			
			Util.ajax_server_path = "inc/userAccount.php";
			Util.sendReceiveToID(null, "user=login&email="+document.getElementById("email_login").value+"&password="+document.getElementById("password_input").value,
					function(a){  
							if(typeof a === "object"){
								if(a[0] === "success"){
									login_wrapper.style.display	= "none";
									
									document.getElementById("form_wrapper").style.display = "none";
                        			document.getElementById("login_wrapper").style.display = "none";
									document.getElementById("title_container1").style.display = "none";
									document.getElementById("title_container2").style.display = "none";
									
									document.getElementById("login_message").innerHTML = "<a id='success_message'>Hello "+a[1]+" "+a[2]+"!</a></br><a id='loggedin_message'>You are now logged in. Feel free to access your account if you wish to change your details, check status of your order or reorder saved designs.</a><br/><input type='image' src='layoutimg2/ui/go_to_account_butt.png' id='go_to_account_butt' title='Go to yor account.'/>";
									
									document.getElementById("go_to_account_butt").onclick = function(){
										window.location = "my_account.php";	
									}
								} else {
									if(a[0] === "fail"){
										document.getElementById("login_message").innerHTML = a[1];
									}	
								}
							}
						}
			);
//		}
		
	} // end of onClick
	
	//--------------------------------------------------------//
	
	forgot_password.onclick = function(){
		login_table.style.display			= "none";
		forgot_password_instruction.style.display = "block";
		forgot_password_table.style.display = "block";
		
		login_reveal_butt	= document.getElementById("login_reveal_butt");
		forgot_form_field	= document.getElementsByName("forgot_form_field");
		formFieldEffect(forgot_form_field);
		
		forgot_pass_butt.onclick = function(){
			forgot_form_field		= document.getElementsByName("forgot_form_field");
			forgotten_pass_respond	= document.getElementById("forgotten_pass_respond");
			form_data = validateForm(forgot_form_field);
			
			if(!form_data.error){
				Util.ajax_server_path = "inc/userAccount.php";
				Util.sendReceiveToID(null, "forgotten_pass=1"+form_data.post_data,
									function(respond){
										if(respond[0] === "success"){
											forgotten_pass_respond.style.color = "#5dbb6b";
											forgotten_pass_respond.innerHTML = respond[1];	
										} else {
											if(respond[0] === "error"){
												forgotten_pass_respond.style.color = "#f00";
												forgotten_pass_respond.innerHTML = respond[1];
											}
										}
									}
				);
				
			}
			
		}
		
		login_reveal_butt.onclick = function(){
			login_table.style.display			= "block";
			forgot_password_instruction.style.display = "none";
			forgot_password_table.style.display = "none";
		}
	}
	
	//--------------------------------------------------------//
	
//	formFieldEffect(form_fields);
	
	submit_butt.onclick = function(){
		var form_data;
		Util.ajax_server_path = "inc/userAccount.php";
		form_data = validateForm(form_fields);
		
		if(!form_data.error){
			Util.sendReceiveToID("form_wrapper", "new_user=register"+form_data.post_data,
					function(a){
						var form_wrapper,
							address_array,
							address_string = "";
							
						form_wrapper = document.getElementById("form_wrapper");
						form_wrapper.style.display = "none";
											
						if(typeof a !== "undefined"){
												
							/*
								a[0] - Name
								a[1] - Last Name
								a[2] - e-mail
								a[3] - joined address string. glue is {§} 
							*/
							address_array = a[3].split("{§}");
							for(var i = 0, tot = address_array.length; i < tot-1; i += 1){
								address_string += address_array[i]+"</br>";
							}
							
							document.getElementById("form_wrapper").style.display = "none";
                        	document.getElementById("login_wrapper").style.display = "none";
							document.getElementById("title_container1").style.display = "none";
							document.getElementById("title_container2").style.display = "none";
								
							register_message_area.innerHTML = "<a id='registered_message'>You have successfuly created a new account "+a[0]+"!</a></br><a id='info_message'>You have entered the following information about your self:</a><p id='address'>"+a[0]+" "+a[1]+"</br>"+address_string+"</p><a id='loggedin_message'>You are now logged in as <b id='email'>"+a[2]+"</b> Feel free to access your account to change your details, check status of your order or reorder saved designs.</a>";	
							
							form_wrap.style.display				= "none";
								
						}
					}
			);
		}
		
	} // end of onClick
	
	//--------------------------------------------------------//
	getFooterLinks();
	
} // END OF init();


function getFooterLinks(){
	var data_pair;
	
	utils = new Utilities();
	utils.ajax_server_path = "inc/ajaxServer.php";
	utils.sendReceiveToID(null, "get_footer_links=1",
		function(d){
	
			footer_items = document.getElementById("information");
			footer_items.innerHTML = "";
						
			for(var i = 0, tot = d.length; i < tot; i +=1){						
				data_pair		= d[i].split("§");
				
				footer_link		= document.createElement("a");
				footer_link.href	= "information.php?page_id="+data_pair[0];;				
				footer_link.innerHTML	= data_pair[1];
				footer_items.appendChild(footer_link);	
			}
		}
	);
}
function LoadTabContent(something){
	window.location = "index.php?at="+something;
	
}

function goToPhotoUpload(){
	document.getElementById("category_post_data").value = "*%*^Photo_upload";
	document.getElementById("template_post_data").value = "*%*^Photo_upload";
	document.getElementById("load_page_form").submit();	
}

</script>
<div id="inf" style="position:absolute; left:10px"></div>
<div id="contentWrapper">
        
    <div id="Sides">	<!--	SPLITTING LINE AND LIST
    					-->
                        
		<div id="leftTopList">
        	
		</div>
            
        <div id="horisontal_split">
        	<div id="Frame_left_Middle_Corner"></div>
            <div id="Frame_right_Middle_Corner"></div>
            <div id="Frame_split_cover"></div>	<!-- Covers horisontal lines that go behind central frame. Visible in some browsers -->
        </div>
             
    </div>
    
    
	<div id="center">
        <div id="frame_top_border">
        	<span id="frame_top_left"></span><span id="frame_top_right"></span>
            <div id="frame_left_border">
                <div id="frame_right_border">
                        
                    <div id="design_gallery">
                    	
                        <div class="title_container" id="title_container1">
                        	<h4 class="title_text">Existing Users - Login</h4>
                        </div>
                        
                        <div id="login_message">
                        
            			</div>
                        
                        <div id="login_wrapper">
                        	
                            <a id="forgot_password_instruction" style="display:none;">Please enter your registered e-mail address end press Send.<br/>We will send an email with your details to that account.</a>
                            <table id="forgot_password_table" style="display:none;">
                            	<tr>
                                	<td><a class="invisible_text" id="forgot_pass_email_label">Your e-mail address</a></td><td><input type="text" name="forgot_form_field" id="forgot_pass_email" value="e-mail address"/></td><td class="message" id="forgot_pass_email_msg"></td>
                                </tr>
                                	<td>&nbsp;</td><td style="text-align:center"><input type="image" src="layoutimg2/ui/send_butt.png" id="forgot_pass_butt" value="Send" /></td><td></td>
                                </tr>
                                <tr>
                                	<td>&nbsp;</td><td id="login_reveal_butt_container"><a id="login_reveal_butt">Login</a></td><td>&nbsp;</td>
                                </tr>
                            </table>
                            
                            <a id="forgotten_pass_respond"></a>
                            	                        
                            <table id="login_table">
                            	<tr>
                                	<td><a class="invisible_text" id="email_login_label">Enter e-mail address</a></td><td><input type="text" name="login_field" id="email_login" value="e-mail address"/></td><td class="message" id="email_login_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="password_input_label">Enter Password</a></td><td><input type="text" name="login_field" id="password_input" value="Create Password" /></td><td class="message" id="paswd_msg"></td>
                                </tr>
                               
                                <tr>
                                	<td>&nbsp;</td><td style="text-align:center"><input type="image" src="layoutimg2/ui/login_butt.png" id="login_butt" value="Login" /></td><td></td>
                                </tr>
                                <tr>
                                	<td>&nbsp;</td><td id="forgot_password_container"><a id="forgot_password">Forgot your password?</a></td><td>&nbsp;</td>
                                </tr>
                            </table>
                       </div>  
                        
                        <div class="title_container" id="title_container2">
                        	<h4 class="title_text">New Users - Register</h4>
                        </div>
                        
                        <div id="register_message_area">
        				
                        </div>
                        
                        <div id="form_wrapper">                        
                            <table>
                            	<tr>
                                	<td><a class="invisible_text" id="name_input_label">Name</a> </td><td> <input type="text" name="form_field" id="name_input" value="Name" /></td><td class="message" id="name_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="lname_input_label">Last Name</a></td><td><input type="text" name="form_field" id="lname_input" value="Last Name" /></td><td class="message" id="lname_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="email_input_label">e-mail address</a></td><td><input type="text" name="form_field" id="email_input" value="e-mail address"/></td><td class="message" id="email_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="confemail_input_label">Confirm e-mail</a></td><td><input type="text" name="form_field" id="confemail_input" value="Confirm e-mail"/></td><td class="message" id="confemail_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="paswd_input_label">Create Password</a></td><td><input type="text" name="form_field" id="paswd_input" value="Create Password" /></td><td class="message" id="paswd_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="confpaswd_input_label">Confirm Password</a></td><td><input type="text" name="form_field" id="confpaswd_input" value="Confirm Password" /></td><td class="message" id="confpaswd_msg"></td>
                                </tr>
                                <tr><td><a class="invisible_text" id="addr_input_label">Address</a></td><td><input type="text" name="form_field" id="addr_input" value="Address" /></td><td class="message" id="addr_msg"></td></tr>
                                <tr><td><a class="invisible_text" id="addr2_input_label">Address 2</a></td><td><input type="text" name="form_field" id="addr2_input" value="Address 2" /></td><td class="message" id="addr2_msg"></td></tr>
                              
                                <tr>
                                	<td><a class="invisible_text" id="city_input_label">City</a></td><td><input type="text" name="form_field" id="city_input" value="City" /></td><td class="message" id="city_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="postcode_input_label">Postal Code</a></td><td><input type="text" name="form_field" id="postcode_input" value="Postal Code" /></td><td class="message" id="postcode_msg"></td>
                                </tr>
                                <tr>
                                	<td><a class="invisible_text" id="country_input_label">Country</a></td><td><select id="country_input" name="form_field">
                                                                                                                <option selected="selected">United Kingdom</option>
                                                                                                                <option>Ireland</option>
                                                                                                            </select></td><td class="message" id="country_msg"></td>
                                </tr>
                                <tr>
                                	<td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                	<td></td><td style="text-align:center"><input type="image" src="layoutimg2/ui/register_butt.png" id="form_submit_butt" value="Register" /></td>
                                </tr>
                            </table>
                       </div>                                	
                    </div> <!-- END Design Gallery -->
                    
                    <div id="frame_bottom_border">
                        <span id="frame_bottom_left"></span><span id="frame_bottom_right"></span>
                    </div> 
                       
                </div> <!-- END frame_right_border -->
            </div> <!-- END frame_left_border -->
          
            <div id="information">
				
			</div>
            
        </div> <!-- END frame_top_border -->
    </div> <!-- END FooterWrapper -->        
</div>
<form action="edit.php" method="post" id="load_page_form">
	<input type="hidden" name="category" id="category_post_data" />
    <input type="hidden" name="template" id="template_post_data"/>
</form>

</body>
</html>
