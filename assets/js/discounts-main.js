$(document).ready(function(){
	$("input[name='qty-values']").ForceNumericOnly();
	$("input[name='price-value']").ForceNumericOnly();

	$("#create-scheme-butt").click( createDiscountScheme );
	$("input[name='discount-type']").change(function(){
		switch($("input[name='discount-type']:checked").val()){
			case "price" : $(".value-sign").text("£"); break;
			case "percent" : $(".value-sign").text("%"); break;
		}
	})

	$.post("/inc/ShoppingCartServer.php", { getDiscountSchemes: true }, loadSchemes, "json")
});

//---------------------------------------------------------------------------------
// 

function createDiscountScheme(){
	scheme = { qty_val_arr: [],
				discount_type: "",
				affected_products: [] };

	$("input[name='qty-values']").each(function(){
		if($(this).val().length >0){
			scheme.qty_val_arr.push({ qty:$(this).val(), val: null });
		}
	});

	$("input[name='price-value']").each(function(i){
		if($(this).val().length >0 && i < scheme.qty_val_arr.length){
			scheme.qty_val_arr[i].val = $(this).val();
		}
	});
	
	scheme.affected_products = $("select[name='selected-products']").val();
	scheme.discount_type = $("input[name='discount-type']:checked").val();	
	$.post("/inc/ShoppingCartServer.php", { new_discount_scheme: scheme }, loadSchemes, "json");

}

//---------------------------------------------------------------------------------
// 

function loadSchemes(data){
	var price_sign;
	if(!data.error){
		$(".schemes-page-wrapper").empty();
		for(s in data.schemes){
			wrapper = $("<div class='scheme-wrapper'>").data("schemeid", data.schemes[s].id);
			$("<span class='scheme-id'>").html("<h3>"+data.schemes[s].id+"</h3>").appendTo(wrapper);
			$("<span class='discount-type'>").html("<h3>"+data.schemes[s].discount_script.discount_type+"</h3>").appendTo(wrapper);
			switch(data.schemes[s].discount_script.discount_type){
				case "percent" :  price_sign = "- %"; break;
				case "price" :  price_sign = "£"; break;
			}

			script = $("<ul class='discount-script'>");
			for(qv in data.schemes[s].discount_script.qty_val_arr){
				script.append("<li>"+data.schemes[s].discount_script.qty_val_arr[qv].qty+" = "+price_sign+data.schemes[s].discount_script.qty_val_arr[qv].val+"</li>")
			}

			$("<span class='d-script'>").append(script).appendTo(wrapper);

			product_list = $("<ul class='included-products'>");
			for(p in data.schemes[s].discount_script.affected_products){
				p_id = data.schemes[s].discount_script.affected_products[p];
				p_name = $("option[value='"+p_id+"']", ".product-select").text();
				
				$("<li>").html(p_name).appendTo(product_list);
			}

			$("<span class='products-list-wrap'>").append(product_list).appendTo(wrapper);
			
			active_switch = $("<input type='checkbox' class='scheme-active-switch'>")
				.prop("checked", data.schemes[s].active > 0 ? true : false)
				.change(switchActiveState);
			$("<span class='active-switch-wrapper'>").append(active_switch).append("<label>Активная</label>").appendTo(wrapper);
			delete_scheme_butt = $("<button class='delete-scheme-butt'>").text("Удалить").click(deleteScheme);
			$("<span class='delete-wrap'>").append(delete_scheme_butt).appendTo(wrapper);
			wrapper.appendTo(".schemes-page-wrapper");
		}

	} else {
		alert(data.error_msg);
	}
}

//---------------------------------------------------------------------------------
// 

function switchActiveState(){
	var state = $(this).prop("checked") ? 1 : 0;
	$.post("/inc/ShoppingCartServer.php",
			{ scheme_state_change: $(this).closest(".scheme-wrapper").data("schemeid"), state: state },
			function(data){
				if(data.error){
					alert(data.error_msg);
				}
			}
			,"json");
}

//---------------------------------------------------------------------------------
// 

function deleteScheme(){
	var self = this;
	if(confirm("Удалить схему скидок?")){
		$.post("/inc/ShoppingCartServer.php",
			{ delete_scheme: $(this).closest(".scheme-wrapper").data("schemeid")},
			function(data){
				if(!data.error){
					$(self).closest(".scheme-wrapper").remove();
				} else {
					alert(data.error_msg);
				}
			}
		,"json");
	}
}

//--------------------------------------------------------------------------------- 
// Numeric only control handler

$.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

