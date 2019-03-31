<?php
include_once("../../inc/SessionClass.php");
include_once("../../inc/DataBaseClass.php");

$session	= new Session();
$db			= new DataBase();
$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");

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
<html class="no-js" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Добавить новый продукт</title>
    <link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/add-product-layout.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/jquery-ui.css" rel="stylesheet">
    <link href="../../assets/js/spectrum/spectrum.css" rel="stylesheet">

    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="../../assets/css/ie8-FontsFormat.css" />
        <script src="../../assets/js/html5shiv.min.js"></script>
    <![endif]-->
    <script type="text/javascript" src="../../assets/js/modernizr.ownster.js"></script>
</head>

<body>
	<header>
		<nav></nav>
	</header>

	<main>
		<aside class="control-panel">

			<div class="setting-block">
				<h4 class="setting-title">Название Продукта</h4>
				<input type="text" id="product-name"/>
				<p>
					<input type='file' accept='image/*' id="product-img-file-inp" onchange="workdesk.handleCoverImgFile(this.files[0])" />
					<input type="file" accept='image/*' id="files-stack" />
					<label for="product-img-file-inp">Сменить / Добавить фото продукта.</label>
					<input type='file' accept='image/*' id="product-mask-file-inp" onchange="workdesk.handleMaskFile(this.files[0])" />
					<label for="product-mask-file-inp">Добавить Маску к продукту</label>
				</p>
			</div>

			<!--.................... ПОВЕРХНОСТИ ПРОДУКТА ................-->
			
			<div class="setting-block">
				<h4 class="setting-title">Название Поверхности</h4>
				<input type="text" id="surface-name"/>
				<button id="add-surface-butt">Добавить</button>
				<button id="change-surface-name-butt">Сменить название</button>
				<h4 class="setting-title">Выбор поверхности для настройки<h4>
				<select id="select-surface">

				</select>
				<input type="checkbox" id="make-surface-default-check" checked>
				<label for="make-surface-default-check">Главная поверхность</label>


				<h4 class="setting-title">Изображение переключателя сторон</h4>
				<select id="side-icon-select">
				</select>
			</div>			
			<div class="setting-block">
				<div>
					<h4 class="setting-title">Размер Продукта (мм)</h4>
					<span class="inline-elems-wrapper">
						<label>Ширина</label> <input class="spinner" id="product-width">
					</span>
					X
					<span class="inline-elems-wrapper">
						<label>Высота</label> <input class="spinner" id="product-height">
					</span>
				</div>

				<!--.................... РАЗМЕРЫ ПОВЕРХНОСТИ ПРОДУКТА ................-->

				<div>
					<h4 class="setting-title">Размеры Поверхности (мм)</h4>
					<span class="inline-elems-wrapper">
						<label>Ширина</label> <input class="spinner" id="surface-width">
					</span>
					X
					<span class="inline-elems-wrapper">
						<label>Высота</label> <input class="spinner" id="surface-height">
					</span>
				</div>

				<div>
					<h4 class="setting-title">Размеры Сетки (мм)</h4>
					<span class="inline-elems-wrapper">
						<label>Ширина</label> <input class="spinner" id="grid-width"> 
					</span>
					X
					<span class="inline-elems-wrapper">
						<label>Высота</label> <input class="spinner" id="grid-height">
					</span>
					
					<p>
						<br/>
						<label>Центровать с продуктом</label>
						<input type="checkbox" id="center-bounds" >
						<label for="center-bounds">Центровать сетку и поверхность с картинкой продукта</label>
					</p>
					
					<p>
						<br>
					  <label for="scale_value">Масштаб</label>
					  <input type="text" id="scale_value" readonly />
					</p>
					<div id="scale_slider"></div>

				</div>

				<div id="product-surface-lock-wrapper">
					<input type="checkbox" id="product-surface-size-lock" ><label for="product-surface-size-lock">L1</label>
				</div>

				<div id="surface-grid-lock-wrapper">
					<input type="checkbox" id="surface-grid-size-lock" ><label for="surface-grid-size-lock">L2</label>
				</div>
			</div>
			<!--.................... КОЛИЧЕСТВО ЯЧЕЕК ................-->
			<div class="setting-block">
				<h4 class="setting-title">Количество Ячеек</h4>
				<span class="inline-elems-wrapper">
					<label>По Ширине</label><input class="spinner" id="numcells-width">
				</span>
				X
				<span class="inline-elems-wrapper">
					<label>По Высоте</label><input class="spinner" id="numcells-height">
				</span>
			</div>

			<!--.................... ФОРМА / ПРОПОРЦИИ ХОЛСТА: ................-->

			<div class="setting-block">
				<h4 class="setting-title">Форма / пропорции сетки:</h4>
				<p><input type="radio" checked name="grid-proportions-radio" value="custom"/><label>Ручная настройка</label></p>
				<p><input type="radio" name="grid-proportions-radio" value="square"/><label>Квадратный</label></p>
				<p><input type="radio" name="grid-proportions-radio" value="proportional"/><label>Пропорционально печат. поверхности</label></p>
			</div>

		</aside>

		<div class="working-area">
			<ul id="workdesk-info"></ul>
			<div id="main-toolbar">
				<div class="main-toolbar-butt" data-menu="product">Продукт
					<ul class="popupmenu product">
						<li id="save-product-butt">Сохранить Продукт</li>
						<li id="reset-button">Сбросить Всё</li>
					</ul>
				</div>
				<div class="main-toolbar-butt" data-menu="options">Добавить
					<ul class="popupmenu options">
						<li id="surface-option-view">Альтернативный Вид Поверхности</li>
						<li id="add-graphic-layer">Графический Слой</li>
					</ul>
				</div>
				<div class="main-toolbar-butt" data-menu="template">Шаблон
					<ul class="popupmenu template">
						<li id="new-template-butt">Новый Шаблон</li>
						<li id="save-template-butt">Сохранить Шаблон Разкладки</li>
						<li id="save-graphic-template-butt">Сохранить Графический Шаблон</li>
					</ul>
				</div>
				<span id="celltoolbar">
					<button id="uploadable">Выделенные клетки активны для загрузки фотографий</button>
					<!-- <button id="merge-cells">Объеденить выделенные клетки (Объедениться прямоугольная зона от левой верхней клетки до правий нижней)</button> -->
					
					<label>H: </label><input class="spinner" id="split-numcells-v">&nbsp;
					<label>V: </label><input class="spinner" id="split-numcells-h">&nbsp;
					<button id="split-cells">Разбить клетки по ветикали и горизонтали</button>
					<input type="checkbox" id="draw-cells"/><label for="draw-cells"></label>&nbsp;
					<label>Поворот ячейки a˚ </label><input class="spinner" id="rotate-cell-input" value='0'>
					<!-- <button id="cell-mask">Добавиь Маску</button> -->
				</span>
			</div>

			<aside class="popup-panel" id="add-optional-images-window" >
					<button class='delete-template-butt'></button>
					<input type='file' accept='image/*' id="optional-product-img-file-inp" onchange="workdesk.handleOptioanlImge(this.files[0])" />
					<input type='file' accept='image/*' id="demo-layer-img-file-inp" onchange="workdesk.handleDemoLayerImge(this.files[0])" />
					<input type='file' accept='image/*' id="graph-template-preview-img-file-inp" onchange="workdesk.handlePreviewGraphTemplateImge(this.files[0])" />
					<input type='file' accept='image/*' id="product-preview-img-file-inp" onchange="workdesk.handleProductPreviewImge(this.files[0])" />
					<label for="optional-product-img-file-inp">Фото продукта</label>
					<label for="demo-layer-img-file-inp">Дэмо слой</label>
					<label for="graph-template-preview-img-file-inp">Превью графич. шабл.</label>
					<label for="product-preview-img-file-inp">Превью Продукта</label>
					<!-- <input type='file' accept='image/*' id="optional-product-mask-file-inp" onchange="workdesk.handleOptionalMask(this.files[0])" />
					<label for="optional-product-mask-file-inp">Маска продукта</label> -->
			</aside>

			<aside id="preview-pannels-wrapper">
				<aside class="expandable-panel closed" id="layouts-preview-window">
					<div class="expandable-panel-header"><button class="expand-pannel-butt">►</button>Layouts</div>
					<div class="inner-window"></div>
				</aside>
				<aside class="expandable-panel  closed" id="optional-surf-preview-window">
					<div class="expandable-panel-header"><button class="expand-pannel-butt">►</button>Поверхности</div>
					<div class="inner-window"></div>
				</aside>
				<aside class="expandable-panel  closed" id="graphic-templates-preview-window">
					<div class="expandable-panel-header"><button class="expand-pannel-butt">►</button>Графические шаблоны</div>
					<div class="inner-window"></div>
				</aside>
				<aside class="expandable-panel  closed" id="texts-preview-window">
					<div class="expandable-panel-header"><button class="expand-pannel-butt">►</button>Добавить текст</div>
					<div class="inner-window">
						<div id="font-atributes-wrapper">
							<select id="font-family-select">
								<option>Select a Font</option>
								<option selected value="Arial">Arial</option>
								<option value="'Abel', sans-serif">Abel</option>
								<option value="'Lobster', cursive">Lobster</option>
								<option value="'Pacifico', cursive">Pacifico</option>
								<option value="'Comfortaa', cursive">Comfortaa</option>
								<option value="'Cookie', cursive">Cookie</option>
								<option value="'Kaushan Script', cursive">Kaushan</option>
								<option value="Baskerville,'Baskerville Old Face'">Baskerville</option>
								<option value="'Comic Sans', 'Comic Sans MS'">Comic Sans</option>
								<option value="'Courier New',Courier,'Lucida Sans Typewriter','Lucida Typewriter',monospace">Courier New</option>
								<option value="Impact,Haettenschweiler,'Franklin Gothic Bold',Charcoal,'Helvetica Inserat','Bitstream Vera Sans Bold','Arial Black','sans serif'">Impact</option>
								<option value="TimesNewRoman,'Times New Roman',Times">Times New Roman</option>
								<option value="'Astloch', cursive">Astloch</option>
								<option value="'IM Fell English SC', serif">IM Fell English SC</option>
								<option value="'Nosifer', cursive">Nosifer</option>
								<option value="'Alfa Slab One', cursive">Alfa Slab One</option>
								<option value="'Ubuntu Mono'">Ubuntu Mono</option>
								<option value="'Trade Winds', cursive">Trade Winds</option>
								<option value="'Codystar', cursive">Codystar</option>
								<option value="'Stalemate', cursive">Stalemate</option>
								<option value="'Poiret One', cursive">Poiret One</option>
								<option value="'Henny Penny', cursive">Henny Penny</option>
								<option value="'Quicksand', sans-serif">Quicksand</option>
								<option value="'Petit Formal Script', cursive">Petit Formal Script</option>
								<option value="'Fugaz One', cursive">Fugaz One</option>
								<option value="'Shadows Into Light', cursive">Shadows Into Light</option>
								<option value="'Josefin Slab', serif">Josefin Slab</option>
								<option value="'Frijole', cursive">Frijole</option>
								<option value="'Fredoka One', cursive">Fredoka One</option>
								<option value="'Gloria Hallelujah', cursive">Gloria Hallelujah</option>
								<option value="'UnifrakturCook', cursive">UnifrakturCook</option>
								<option value="'Tangerine', cursive">Tangerine</option>
								<option value="'Monofett', cursive">Monofett</option>
								<option value="'Monoton', cursive">Monoton</option>
								<option value="'Spirax', cursive">Spirax</option>
								<option value="'UnifrakturMaguntia', cursive">UnifrakturMaguntia</option>
								<option value="'Creepster', cursive">Creepster</option>
								<option value="'Maven Pro', sans-serif">Maven Pro</option>
								<option value="'Amatic SC', cursive">Amatic SC</option>
								<option value="'Dancing Script', cursive">Dancing Script</option>
								<option value="'Pirata One', cursive">Pirata One</option>
								<option value="'Play', sans-serif">Play</option>
								<option value="'Audiowide', cursive">Audiowide</option>
								<option value="'Open Sans Condensed', sans-serif">Open Sans Condensed</option>
								<option value="'Kranky', cursive">Kranky</option>
								<option value="'Black Ops One', cursive">Black Ops One</option>
								<option value="'Indie Flower', cursive">Indie Flower</option>
								<option value="'Sancreek', cursive">Sancreek</option>
								<option value="'Press Start 2P', cursive">Press Start 2P</option>
								<option value="'Abril Fatface', cursive">Abril Fatface</option>
								<option value="'Jacques Francois Shadow', cursive">Jacques Francois Shadow</option>
								<option value="'Ribeye Marrow', cursive">Ribeye Marrow</option>
								<option value="'Playball', cursive">Playball</option>
								<option value="'Roboto Slab', serif">Roboto Slab</option>
								
							</select>
							<select id="font-size-select">
								<option>8</option>
								<option>9</option>
								<option>10</option>
								<option>11</option>
								<option>12</option>
								<option>13</option>
								<option>14</option>
								<option>16</option>
								<option>17</option>
								<option>18</option>
								<option>19</option>
								<option selected>20</option>
								<option>1</option>
								<option>22</option>
								<option>24</option>
								<option>26</option>
								<option>28</option>
								<option>30</option>
								<option>32</option>
								<option>34</option>
								<option>36</option>
								<option>38</option>
								<option>40</option>
								<option>50</option>
								<option>60</option>
								<option>70</option>
								<option>80</option>
								<option>90</option>
								<option>100</option>
								<option>110</option>
								<option>120</option>
							</select>
							<div class="font-color-picker-wrapper">
								<input type="text" id="colorSelector" />
							</div>
						</div>

						<div class="texts-container">
							<div id='text-inputs-wrapper'>
							</div>
						</div>
						<button class="add-new-text-butt inwindow">Add More Text</button>
					</div>
				</aside>
			</aside>

			<div id="work-desk">


			</div>
		</div>
	</main>

	<footer>
	</footer>
</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.iframe-transport.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.fileupload.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.storageapi.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.ddslick.min.js"></script>
<script type="text/javascript" src="../../assets/js/spectrum/spectrum.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/ProductClass.js"></script>
<script type="text/javascript" src="../../assets/js/WorkDeskSetup.js"></script>
<script type="text/javascript" src="../../assets/js/cells-toolbar.js"></script>
<script type="text/javascript" src="../../assets/js/menu-toolbar.js"></script>
<script type="text/javascript" src="../../assets/js/ExpandablePanels.js"></script>
<script type="text/javascript" src="../../assets/js/cms_add_product_main.js"></script>
</html>


