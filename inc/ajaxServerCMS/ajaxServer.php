<?php
include_once("DataBaseClass.php");
include_once("upload.php");



//echo $DBase->createTable(); // Create new Tables

//*******************************************************************	LOAD TABS INTO <SELECT>

if(isset($_POST['pageLoad'])){
	
				$DBase = new DataBase();			
				echo "default:|".$DBase->getTabListSelected();
				
}

//*******************************************************************	LOAD LIST OF CATEGORIES				
if(isset($_POST['selectValue']))
{
	$DB = new DataBase();
	$tab = $_POST['selectValue'];
	echo "inner:|".CreateCategoryList($tab, $DB);
	unset($DBase);
}

//*******************************************************************	LOAD LIST OF CATEGORIES	CMS
if(isset($_POST['get_categories_cms']))
{
	$DB = new DataBase();
	$tab_Name = $_POST['get_categories_cms'];
	$responseText = '';
	
	$ButtonClassName = "categoryButton";
	$counter = 0; 
	$ListItemsArray = $DB->getListFromTab($tab_Name);
	foreach($ListItemsArray as $item){
		if($item[1] != ''){
			$name = $item[1];
			if($counter == 0)	$ButtonClassName = "categoryButtonSelected";
			else				$ButtonClassName = "categoryButton";
			
			$responseText .="<span class='listItemContainer'>
								<span id='".$item[0]."_container'>
									<input type='button' id='deleteBut_".$item[0]."' class='deleteButt' onClick=\"confirmDeleteCategory('".$item[0]."')\" /><input type='button' name='editBut_".$item[0]."' class='editButt' onClick=\"editCategoryName('".$item[0]."')\" /><input type='button' name='categoryButton' id='category_".$item[0]."' onClick=\"selectCategory('".$item[0]."')\" class='$ButtonClassName' value='".$name."' />
								</span>	
							</span><br/>"; 
		}
		$counter ++;
	}
	
	unset($DBase);
	
	echo "default:|".$responseText;
}

//*******************************************************************	LOAD IMAGES INTO GALLERY

if(isset($_POST['Load_Gallery'])){
	if(isset($_POST['Tab_Name'])){
		$DBase = new DataBase();
		$content = "default:|";
		$categoryID = $_POST['Load_Gallery'];
		$tabName = $_POST['Tab_Name'];
		
		
		$listOfTabs = $DBase->getTabListSelected($tabName);
		$listOfCategories = $DBase->getCategoriesSelected($tabName, $categoryID);
		
		$GalleryTable = "Gallery_".$categoryID;//galleryTableName($categoryName, $tabName);
		$galleryResult = mysql_query("SELECT id, path, buy_counter FROM $GalleryTable");
		if($galleryResult){
			while($row = mysql_fetch_assoc($galleryResult)){
				$path = $row['path'];
				if($row['buy_counter'] == NULL)
					$buy_counter = 0;
						
				$imgID = $row['id'];
				$content .= "<div id='imgContainer_".$imgID."' class='imageContainer'>
								
								<img id='img_".$imgID."' name='template_image' class='image' src='".$path."'/>
								
								<div id='imgInfo_".$imgID."' class='imageInfo'>
									<div id='moveImg_".$imgID."' class='moveImageContainer'>
										
									</div>	
								</div>
								
								<div class='operationsBar'>
									<span id='hidenInfo_".$imgID."' class='Hiden'>
								
										<select id='imgTab_".$imgID."' onchange=\"categoriesSelect('".$imgID."')\" class='inputSelect'>
											$listOfTabs
										</select>
											
										<select id='imgCat_".$imgID."' class='inputSelect'>
											$listOfCategories
										</select>
											
										<input type='button' onclick=\"moveImageTo('".$imgID."')\" value='Переместить' class='borderlessButton'/>
										<input type='button' class='borderlessButton' onclick=\"uncoverMoveImageContainer('".$imgID."')\" value='Отменить' />
									</span>
										
									<input type='button' class='borderlessButton' id='uncoverButt_".$imgID."' onclick=\"uncoverMoveImageContainer('".$imgID."')\" value='Переместить' />
									<input type='button' class='borderlessButton' onclick=\"deleteImage('".$imgID."')\" value='Удалить' />
								</div>
							</div>";
			} 
			echo $content;
		}
		unset($DBase);
	}
}

//******************************************************************	MOVE IMAGE TO
if(isset($_POST['Move_to_GalleryID'])){
	if(isset($_POST['Old_GalleryID'])){
		if(isset($_POST['imageID'])){
			$DBase = new DataBase();
			$newGallery = "Gallery_".$_POST['Move_to_GalleryID'];
			$oldGallery = "Gallery_".$_POST['Old_GalleryID'];
			$imageID = $_POST['imageID'];
			$output = $DBase->moveBetweenTables($oldGallery, $newGallery, $imageID);
			if($output == true)
				echo "clear:|";
			else
				echo "msg:|".$output;
		}
	}
}

//******************************************************************	DELETE IMAGE
if(isset($_POST['Delete_Image'])){
	if(isset($_POST['imageID'])){
		$DBase = new DataBase();
		$table = "Gallery_".$_POST['Delete_Image'];
		$imageID = $_POST['imageID'];
		$output = $DBase->removeFile($table, $imageID);
		if($output == "ok"){
			echo "clear:|";	
		}
		echo "msg:|".$output;
	}
}

//******************************************************************	RETURN CATEGORIES as <option> INTO <select>
if(isset($_POST['Load_Categories'])){
	$DBase = new DataBase();
	$tab = $_POST['Load_Categories'];
	echo "default:|".$DBase->getCategoriesSelected($tab);
	unset($DBase);
	
}
//*******************************************************************	LOAD GALLERY
//																		<< PUBLIC >>
if(isset($_POST['Templates_Gallery'])){
	if($_POST['Templates_Gallery'] !== "|:!**±none"){
		
		if(isset($_POST['Tab_Name'])){
			$DBase = new DataBase();
			$content = "default:|";//"default:|<div class='gallery_item'><img class='templateImage' src='layoutimg2/ui/photo_upload_img.gif' name='photo_upload' id='photo_upload' /></div>";
			$categoryID = $_POST['Templates_Gallery'];
			$tabName = $_POST['Tab_Name'];
			$GalleryTable = "Gallery_".$categoryID;//galleryTableName($categoryName, $tabName);
			$galleryResult = mysql_query("SELECT id, path, buy_counter FROM $GalleryTable");
			if($galleryResult){
				while($row = mysql_fetch_assoc($galleryResult)){
					$path = $row['path'];
					if($row['buy_counter'] == NULL)
						$buy_counter = 0;
							
					$imgID = $row['id'];
					$content .= "<div class='gallery_item'><img class='templateImage' src='$path' name='template_image' id='img_".$imgID."' /></div>";
				} 
				echo $content;
			}
			unset($DBase);
		}
		
	} else {
		
		echo "default:|<div class='gallery_item'><img class='templateImage' src='layoutimg2/ui/photo_upload_img.gif' name='photo_upload' id='photo_upload' /></div>";	
	}
}
//*******************************************************************	edit.php LOAD TEMPLATE FROM DB
if(isset($_POST['Get_Template'])){
	if(isset($_POST['template'])){
		if(isset($_POST['category'])){
			$template = $_POST['template'];
			$category = $_POST['category'];
			
			if($template !== "*%*^Photo_upload" && $category !== "*%*^Photo_upload"){
				$DBase = new DataBase();
				$template_path = $DBase->getTemplatePath($template, $category);
				
				if($template_path){
					echo "value:|".$template_path;
				} else {
					echo "value:|layoutimg2/ui/blank_canvas.png";
				}
				
				unset($DBase);
			} else {
				echo "value:|layoutimg2/ui/blank_canvas.png";	
			}
		}
	}
}

//*******************************************************************	CHANGE CATEGORY NAME
if(isset($_POST['Change_Category']))
{
	$DBase = new DataBase();
	$categoryID = $_POST['Change_Category'];
	
	if(isset($_POST['New_Name'])){
		if(isset($_POST['Tab'])){
			$new_name = cleanString($_POST['New_Name']);
			$tabName = $_POST['Tab'];
			
				if(mysql_query("UPDATE template_categories SET category_name = '$new_name' WHERE id = '$categoryID'"))
					echo "default:|".CreateCategoryList($tabName,$DBase);
				else	
					echo "msg:|Error! Can not update category name.<br/>".mysql_error();
		}
	}
		
	unset($DBase);
}
		
//*******************************************************************	CREATE NEW CATEGORY

if(isset($_POST['CreateNewCategory'])){
	$DBase = new DataBase();
	$newCategoryName = cleanString($_POST['CreateNewCategory']);
	$tabName = $_POST['Tab'];
	if(!mysql_num_rows(mysql_query("SELECT category_name FROM template_categories WHERE category_name = '$newCategoryName' AND tab_name = '$tabName'", DataBase::$connection))){
		if(mysql_query("INSERT INTO template_categories (category_name, tab_name) VALUES('$newCategoryName', '$tabName')", DataBase::$connection)){
			$IDResult = mysql_query("SELECT id FROM template_categories WHERE category_name ='$newCategoryName' AND tab_name = '$tabName'", DataBase::$connection);
			if($IDResult){
				$NewGalleryTableName = "Gallery_".mysql_result($IDResult,0);
				if(mysql_query("CREATE TABLE $NewGalleryTableName (id INT UNIQUE AUTO_INCREMENT, path VARCHAR(120), description TEXT, buy_counter	INT)", DataBase::$connection))
				{
					echo "inner:|".CreateCategoryList($tabName, $DBase);
				}else echo "msg:|Не могу создать новую галлерею!";
			}
		}else echo "msg:|Error! Can not create new category!";
	}else echo "msg:|Раздел с именем \"$newCategoryName\" уже существует.";
	unset($DBase);
}

//*******************************************************************	DELETE CATEGORY

if(isset($_POST['Delete_Category'])){
	$DBase = new DataBase();
	$CategoryIDToDelete = $_POST['Delete_Category'];
	$tabName = $_POST['Tab'];
	$GalleryTable = "Gallery_".$CategoryIDToDelete;//galleryTableName($CategoryIDToDelete, $tabName);
	if(mysql_query("DELETE FROM template_categories WHERE id = '$CategoryIDToDelete'", DataBase::$connection)){
		if($GalleryTable){
			$dropResult = mysql_query("DROP TABLE $GalleryTable", DataBase::$connection);
			if($dropResult){
				rrmdir("../gallery/$GalleryTable/");
				echo "default:|".CreateCategoryList($tabName, $DBase);
			} else echo "msg:|".mysql_error();
		} else echo "msg:|Не удаётся удалить таблицу.<br/> ajaxServer -> DELETE CATEGORY<br/>";
	} else echo "msg:|Error! Can not delete category!<br/> ajaxServer -> DELETE CATEGORY<br/>";
	unset($DBase);
}

//*******************************************************************	CREATE NEW TAB

if(isset($_POST['New_Tab'])){
	$DBase = new DataBase();
	$newTabName = cleanString($_POST['New_Tab']);
	if(!mysql_num_rows(mysql_query("SELECT name FROM tabs WHERE name = '$newTabName'", DataBase::$connection))){
		if(mysql_query("INSERT INTO tabs SET name = '$newTabName'", DataBase::$connection)){
			$result = $DBase->getTabList();
			$selectOptions='';
			while($row = mysql_fetch_assoc($result)){
				if($row['name'] == $newTabName)
					$selectOptions.="<option selected>".$row['name']."</option>";
				else
					$selectOptions.="<option>".$row['name']."</option>";
			}		
			echo "inner:|<select id='tab_list' onchange='SelectTab();'>".$selectOptions."</select>";
		}
	} else echo "msg:|Закладка с именем \"$newTabName\" уже существует.";
	unset($DBase);
}

//------------------------------------------------------------------------------------------//	GET LIST OF TABS FROM DATABASE
if(isset($_POST["Get_tabs"])){
	$DBase = new DataBase();
	$result = $DBase->getTabList();
	$tabs	= "array:|";
	while($row = mysql_fetch_assoc($result)){
		$tabs .= $row['name'] ."~";	
	}
	echo $tabs;
}

//*******************************************************************	CMS CREATE NEW TAB

if(isset($_POST['New_Tab_cms'])){
	$DBase = new DataBase();
	$newTabName = cleanString($_POST['New_Tab_cms']);
	if(!mysql_num_rows(mysql_query("SELECT name FROM tabs WHERE name = '$newTabName'", DataBase::$connection))){
		if(mysql_query("INSERT INTO tabs SET name = '$newTabName'", DataBase::$connection)){
			$result = $DBase->getTabList();
			$selectOptions='';
			while($row = mysql_fetch_assoc($result)){
				if($row['name'] == $newTabName)
					$selectOptions.= $row['name'] ."§selected~";
				else
					$selectOptions.= $row['name'] ."§not~";
			}		
			echo "array:|".$selectOptions;
		}
	} else echo "alert:|Закладка с именем \"$newTabName\" уже существует.";
	unset($DBase);
}

//*******************************************************************	EDIT TAB NAME

if(isset($_POST['Edit_Tab_Name'])){
	$DBase = new DataBase();
	$oldTabName = $_POST['Edit_Tab_Name'];
	if(isset($_POST['New_Tab_Name'])){
		$newTabName = cleanString($_POST['New_Tab_Name']);
		if(!mysql_num_rows(mysql_query("SELECT name FROM tabs WHERE name = '$newTabName'", DataBase::$connection))){
			if(mysql_query("UPDATE tabs SET name = '$newTabName' WHERE name = '$oldTabName'", DataBase::$connection)){
				if(mysql_query("UPDATE template_categories SET tab_name = '$newTabName' WHERE tab_name = '$oldTabName'", DataBase::$connection)){			
					$result = $DBase->getTabList();
					$selectOptions='';
					while($row = mysql_fetch_assoc($result)){
						if($row['name'] == $newTabName)
							$selectOptions.="<option selected>".$row['name']."</option>";
						else
							$selectOptions.="<option>".$row['name']."</option>";
					}		
					echo "inner:|<select id='tab_list' onchange='SelectTab();'>".$selectOptions."</select>";
				}else echo "msg:|Ошибка! Не могу сменить имя!";
				
			} else echo "msg:|Ошибка! Не могу сменить имя!";
			
		}else echo "msg:|Закладка с именем \"$newTabName\" уже существует.";
		
	}
	
}

//*******************************************************************	DELETE TAB

if(isset($_POST['Delete_Tab'])){
	
	
		$DBase = new DataBase();
		$tabToDelete = $_POST['Delete_Tab'];
		$result = $DBase->getTabList();
		$selectOptions="<div id='message_window'><select id='moveToCategory'>";
		while($row = mysql_fetch_assoc($result)){
			if($row['name'] != $tabToDelete)
				$selectOptions.="<option>".$row['name']."</option>";
		}		
		echo "inner:|".$selectOptions."</select><br/><input type=button class='borderlessButt' onClick='moveAndDelete();' value='Переместить и удалить' /><br/><input type=button class='borderlessButt' onClick='justDelete();' value='Удалить с содержимым.' /><br/><input type=button class='borderlessButt' onClick='removeConfirmationWindow();' value='Отменить' /></div>";
		unset($DBase);	
}

//******************************************************************************* CREATE <Select>

if(isset($_POST['return_Select'])){
	$tabName = $_POST['return_Select'];
	$DBase = new DataBase();
	$result = $DBase->getTabList();
	$selectOptions='';
	if($tabName == '0'){
		while($row = mysql_fetch_assoc($result)){
			if($row['name'] != '')
				$selectOptions.="<option>".$row['name']."</option>";
			}
	}else {
		while($row = mysql_fetch_assoc($result)){
			if($row['name'] != ''){
				
				if($row['name'] == $tabName)	$selectOptions.="<option selected>".$row['name']."</option>";
				else 							$selectOptions.="<option>".$row['name']."</option>";
			}
		}
	}
	echo "inner:|<select id='tab_list' onchange='SelectTab();'>".$selectOptions."</select>";
	unset($DBase);
}

//**********************************************************************************************

if(isset($_POST['Move_Delete_Tab'])){
	$DBase = new DataBase();
	$tabToDelete = $_POST['Move_Delete_Tab'];
	$moveToTab = $_POST['Move_to'];
	if(mysql_query("UPDATE template_categories SET tab_name = '$moveToTab' WHERE tab_name = '$tabToDelete'", DataBase::$connection)){
		if(mysql_query("DELETE FROM tabs WHERE name = '$tabToDelete'", DataBase::$connection)){
			$result = $DBase->getTabList();
			$selectOptions='';
			while($row = mysql_fetch_assoc($result)){
				$selectOptions.="<option>".$row['name']."</option>";
			}		
			echo "inner:|".$selectOptions;
		}
	}
	unset($DBase);
}

if(isset($_POST['Just_Delete_Tab'])){
	$DBase = new DataBase();
	$tabToDelete = $_POST['Just_Delete_Tab'];
	if(mysql_query("DELETE FROM tabs WHERE name = '$tabToDelete'", DataBase::$connection)){
		if(mysql_query("DELETE FROM template_categories WHERE tab_name = '$tabToDelete'", DataBase::$connection)){
			$result = $DBase->getTabList();
			$selectOptions='';
			while($row = mysql_fetch_assoc($result)){
				$selectOptions.="<option>".$row['name']."</option>";
			}		
			echo "inner:|".$selectOptions;
		}
	}
	unset($DBase);
}
//********************************************************************************************	UPLOAD FILE		
if(isset($_FILES['fileinput'])){
	
	$filesStatus = upload_files($_FILES['fileinput'], "../gallery/", "jpg, jpeg, png, gif");
	foreach($filesStatus as $status)
		echo "<div name='upload_status'>$status</div>";
	
}

//********************************************************************************************	SAVE IMAGE INTO DATABASE
if(isset($_POST['Path'])){
	if(isset($_POST['Category_Name'])){
		if(isset($_POST['Tab_Name'])){
			
			$DBase = new DataBase();
			$categoryID = $_POST['Category_Name'];
			$tabName = $_POST['Tab_Name'];
			$Path = $_POST['Path'];
			$table_name = "Gallery_".$categoryID;//galleryTableName($categoryName, $tabName);
			
			$fileName = basename($Path);
			$moveToFolder = substr($Path, 0, stripos($Path, $fileName))."$table_name/";
			$newPath = $moveToFolder.$fileName;
			echo"msg:|$newDirrectory";
			
			if(!file_exists($moveToFolder)){
				if(mkdir($moveToFolder)){
					
					if(copy($Path, $newPath)){
						$fileReady = true;
					}
					else {
						$fileReady = false;
						echo "msg:|Не удаётся переместить файл.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
					}
					
				}
				else {
					$fileReady = false;
					echo "msg:|Не удаётся создать новую деректорию.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
				}
			}
			else {	
				if(copy($Path, $newPath)){
						$fileReady = true;
					} else {
						$fileReady = false;
						echo "msg:|Не удаётся переместить файл.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
					}
			}
			
			if($fileReady){
				
				$newPath = substr($newPath,3);
				unlink($Path);
				if(!mysql_num_rows(mysql_query("SELECT path FROM $table_name WHERE path = '$newPath'"))){
					if(mysql_query("INSERT INTO $table_name SET path='$newPath'", DataBase::$connection)){
							
						$result = mysql_query("SELECT id FROM $table_name WHERE path = '$newPath'", DataBase::$connection);	
						if($result){
							$imgID = mysql_result($result, 0);
							echo "append:|<div id='imgContainer_".$imgID."'><img id='img_".$imgID."' class='image' src='".$newPath."'/><div id='imgInfo_".$imgID."' class='imageInfo'></div></div>";
						} else echo "msg:|Ошибка Базы данных.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
							
					} else echo "msg:|Не удаётся сохранить файл \"".basename($newPath)."\" в базе данных.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
				} else echo "msg:|Файл \"".basename($newPath)."\" уже существует.<br/>ajaxServer -> SAVE IMAGE INTO DATABASE";
			}
			unset($DBase);
		}
	}
}

if(isset($_POST['Tabs'])){
	
	echo tabList($_POST['Tabs']);
}

if(isset($_POST['AJAX_test'])){
	$received_val = $_POST['AJAX_test'];
	
	echo "default:|".$received_val." succesfully received. Data Sent.";	
}
  //////////////////////////////////////////////////////////////////////////////////////////
 //										FUNCTIONS										 //
//////////////////////////////////////////////////////////////////////////////////////////

//-------------------------------------------------------------------------------	CREATE LIST OF CATEGORIES
function CreateCategoryList($tab_Name, $DB){
	$responseText = '';
	$ButtonClassName = "categoryButton";
	$counter = 0; 
	$ListItemsArray = $DB->getListFromTab($tab_Name);
	foreach($ListItemsArray as $item){
		if($item[1] != ''){
			$name = $item[1];
			if($counter == 0)	$ButtonClassName = "categoryButtonSelected";
			else				$ButtonClassName = "categoryButton";
			
			$responseText .="<span class='listItemContainer'>
								<span id='".$item[0]."_container'>
									<input type='button' id='deleteBut_".$item[0]."' class='deleteButt' onClick=\"confirmDeleteCategory('".$item[0]."')\" /><input type='button' name='editBut_".$item[0]."' class='editButt' onClick=\"editCategoryName('".$item[0]."')\" /><input type='button' name='categoryButton' id='category_".$item[0]."' onClick=\"selectCategory('".$item[0]."')\" class='$ButtonClassName' value='".$name."' />
								</span>	
							</span><br/>"; 
		}
		$counter ++;
	}
//	$responseText .= "<input type='button' id='make_new_cat_button' value='Создать новый раздел.'> ";
	return $responseText;
}

//-------------------------------------------------------------------------------	LIST OF TABS
function tabList($selectedTab=""){
	
	$DBase1 = new DataBase();
	$result = $DBase1->getTabList();
	$selectOptions='';
	while($row = mysql_fetch_assoc($result)){
		if($row['name'] == $selectedTab && $selectedTab != "")
			$selectOptions.="<option selected>".$row['name']."</option>";
		else
			$selectOptions.="<option>".$row['name']."</option>";
	}
	unset($DBase1);			
	return $selectOptions;		
}

//-------------------------------------------------------------------------------	SEND MESSAGE
function sendMessage($Message){
	
	 echo "msg:|$Message";
}

//-------------------------------------------------------------------------------	

function galleryTableName(&$categoryName, &$tabName){

	$id = mysql_result(mysql_query("SELECT id FROM template_categories WHERE category_name = '$categoryName' AND tab_name = '$tabName'", DataBase::$connection),0);
	if($id){
		 return "Gallery_$id";
	} else {
		return false;
	}
}

function cleanString($string){
	preg_match_all("/[\.\w -]/", $string, $legal_characters, PREG_PATTERN_ORDER);
	return implode($legal_characters[0]);
}

function rrmdir($dir) {
   if (is_dir($dir)) {
     $objects = scandir($dir);
     foreach ($objects as $object) {
       if ($object != "." && $object != "..") {
         if (filetype($dir."/".$object) == "dir")
		 	rrmdir($dir."/".$object); else unlink($dir."/".$object);
       }
     }
     reset($objects);
     rmdir($dir);
   }
 } 

?>
