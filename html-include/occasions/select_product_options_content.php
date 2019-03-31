
<div class='page-title-description-wrapper'>
    <span class='title-and-description'>
        <?= "<a href='{$conf->occasion_url}'>"; ?>
            <h2><?= $conf->page->page_title ?></h2>
            <h4><?= $conf->page->page_description ?></h4>
        </a>
    </span>
    <span class='top-links-menu-wrapper'>
        <?php

            if(isset($conf->page->top_menu_links)){
                echo "<ul>";
                foreach ($conf->links as $link) {
                    $active_class = ($_SERVER["REQUEST_URI"] == $link["url"]) ? "active-link" : "";
                    echo "<li><a class='$active_class' href='{$link['url']}'>&bull;&nbsp;{$link['name']}&nbsp;&bull;</a></li>";
                }
                echo "</ul>";
            }
        ?>
    </span>
</div>

<div id="list-of-products">
    
    <?php
        // print_r($conf->page->group_blocks);
        if(is_array($conf->page->group_blocks)){
            foreach ($conf->page->group_blocks as $value) {
                foreach ($value as $templ) {

                // ---- If this product has other variations then when the product thumbnail is clicked, 
                //      then show popup menue
                    if(isset($templ->product_variations)){
                        // If product with variations
                        /*print "<pre>";
                        print_r($templ->product_variations);
                        print "</pre>";*/
                        // echo "<script>console.log(".json_encode($templ->product_variations).")</script>";
                        echo "
                            <div class='product-group-wrapper num_columns{$conf->page->num_columns}'>
                                <a onclick='showVariations(".json_encode($templ->product_variations).");'>
                                    <div class='img-wrapper'>
                                        <img class='group-img' src='{$templ->group_img}' >
                                    </div>
                                    <div class='description'>
                                        {$templ->group_description}
                                    </div>
                                    <div class='button-wrapper'>
                                        {$conf->page->thumb_buttons}
                                    </div>
                                </a>
                            </div>
                        ";
                    } else {
                        echo "
                            <div class='product-group-wrapper num_columns{$conf->page->num_columns}'>
                                <a href='{$templ->group_link_to}'>
                                    <div class='img-wrapper'>
                                        <img class='group-img' src='{$templ->group_img}' >
                                    </div>
                                    <div class='description'>
                                        {$templ->group_description}
                                    </div>
                                    <div class='button-wrapper'>
                                        {$conf->page->thumb_buttons}
                                    </div>
                                </a>
                            </div>
                        ";
                    }
                }                
            }
        }
    ?>
</div>
<section class='popup-window product_variations'>
    <div class="transparrent_back"></div>
    
    <div class="opaque_window product_variations">
        <button class='close-butt' >X</button>
        <div class="message_area">
            <h2>Select the size and pages pattern please.</h2>
        </div>
        <div class='generated-content-wrapper'></div>
        
    </div>
</section>
</div>
