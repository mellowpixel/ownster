<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>

<script language="javascript" type="text/javascript">

//----------------------------------------------------------------	NEW AJAX REQUEST
function newAjax(){
	try{
		// All Normal Browsers
	var	ajaxRequest = new XMLHttpRequest();
	}catch(e){
		// Silly IE
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e){
				alert("Can not create AJAX request. Update your browser!!!");
			}
		}
	}
	
	
}

//----------------------------------------------------------------	on Ready State Handler
function getTabsList()
{
	if(ajaxRequest.readyState == 4){	// Ready state is 4
		document.getElementById('q').innerHTML = ajaxRequest.responseText;
	}
}	
	
//----------------------------------------------------------------	Main

ajaxRequest = new XMLHttpRequest();
ajaxRequest.open("POST","inc/ajaxServer.php",true);
ajaxRequest.send(null);
ajaxRequest.onreadystatechange = getTabsList();


</script>
<div id="q">
</div>
</body>
</html>