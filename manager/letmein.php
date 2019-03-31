<?php
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");

$session	= new Session();
$db			= new DataBase();

$_SESSION["user_login"] = "ownsteradmin";
$_SESSION["user_password"] = "9e3023bb56b1e8ea91ee5de1ff164812";
?>