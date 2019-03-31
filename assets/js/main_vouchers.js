
//--------------------------------------------	M A I N	------------------------------------//

$(document).ready( function(){
	var radio_buttons;
	
	utils	= new Utilities();
	utils.ajax_server_path	= "../../inc/ShoppingCartServer.php";
	utils.sendReceiveToID( null, "get_vouchers=1", function(vouch_array){ outputVouchers(vouch_array) });
	
	$( "[name='radio_butt']" ).bind( 'change', switchActiveInput);
	$( "#exp_date_checker" ).bind( 'change', toggleExpirationInput);
	$( "#generate_butt" ).bind( 'click', getNewCodes);
	$( "#voucher-name-checker" ).bind('change', toggleVouchNameInp);
	$( "#voucher-search" ).submit(voucherSearch);
	$( ".popup-window button" ).bind('click', function(){ $(this).closest(".popup-window").css("display", "none"); });
	
});

//------------------------------------------------------------------------------------------//
//								F U N C T I O N S											//
//------------------------------------------------------------------------------------------//

//----------------------	Voucher Code Search Handler ---------------//
function voucherSearch(){
	var voucher = $("#search-input").val();
	$.post("/inc/ShoppingCartServer.php", { search_vaucher: voucher }, function(data){

		if(!data.error){
			console.log(data.output);
			$(".popup-window").css("display","block");

			if(data.output.discount_price != null){
				discount_val = "£"+data.output.discount_price;
			} else if(data.output.discount_percent){
				discount_val = discount_percent+"%";	
			}

			if(data.output.expires_date != null){
				exp_date = data.output.expires_date;
			} else {
				exp_date = 'Вечный';
			}
			
			tr_class = '';
			switch(data.output.issued){
				case '0':	issued		= ''; break;
				
				case '1':	issued		= "checked='checked'";
							tr_class	= "voucher_sent";
							break;	
			}
			
			switch(data.output.redeemed){
				case '0':	redeemed = 'Не использован'; break;
				case '1':	redeemed = 'Использован';
							tr_class = 'voucher_redeemed'; break;	
			}

			$(".output-wrapper",".popup-window").empty()
				.html("<table>"+
						"<tr class='"+tr_class+"' id='"+data.output.id+"'>"+
							"<td><a class='remove_butt'></a></td>"+
							"<td class='datecreated'>"+data.output.date_created+"</td>"+
							"<td class='vouch_code'>"+data.output.voucher_code+"</td>"+
							"<td>"+discount_val+"</td>"+
							"<td>Цена в-ра: £"+data.output.v_selling_price+"</td>"+
							"<td>"+data.output.num_of_discounts+"</td>"+
							"<td>"+exp_date+"</td>"+
							"<td>"+redeemed+"</td>"+
							"<td><input type='text' class='vouch_owner_inp' maxlength=30 value='"+data.output.voucher_owner+"'></td>"+
							"<td>Отдан<input type='checkbox' class='issued_check' "+issued+"/></td>"+
						"</tr></table>"
					);

			$( ".vouch_owner_inp" )	.bind( 'change', saveOwnerName);
			$( ".issued_check" )	.bind( 'change', markAsSent);
			$( ".remove_butt:not(#delete_butt)" ).bind( 'click', removeThisVouch );

		} else {
			alert(data.error_msg);
		}
	}, "json");

	return false;
}

//----------------------	SWITCH ACTIVE INPUT	-----------------------//

function switchActiveInput(){
	
	switch( $(this).attr("id") ){
		case "price_radio":		$( ".discount_input" ).attr("disabled", "disabled");
								$( "#price_input" ).removeAttr("disabled");
								break;
								
		case "percents_radio":	$( ".discount_input" ).attr("disabled", "disabled");
								$( "#percent_input" ).removeAttr("disabled"); 
								break;	
	}
}

//----------------------	TOGGLE EXPIRATION DATE INPUT ON/OFF	-----------------------//

function toggleExpirationInput(){

	if( $( this ).prop('checked') ){
		$( ".exp_date_inp" ).removeAttr("disabled");
	} else {
		$( ".exp_date_inp" ).attr("disabled", "disabled");
		$( "#exp_mm" ).val("MM");
		$( "#exp_dd" ).val("DD");
		$( "#exp_yyyy" ).val("YYYY");
	}
	
}

function toggleVouchNameInp(){
	if( $( this ).prop('checked') ){
		$( "#voucher-name" ).removeAttr("disabled");
	} else {
		$( "#voucher-name" ).val("").attr("disabled", "disabled");
	}
}

//----------------------	GET NEW CODES	-----------------------//

function getNewCodes(){
	var voucher_val_post = "discount_",
		voucher_qty_post,
		price_input,
		exp_date_inp,
		expiration_date = '',
		voucher_name = '',
		num_of_discount	= $('#num_of_disc').val(),
	
	price_input		= $( '.discount_input' ).not("[disabled='disabled']");
	exp_date_inp	= $( '#expiration_date' );
	vouch_sell_price = "&v_sell_price="+$( '#vouch_sell_price' ).val();
	
	//--------------------------------// Check if voucher value is in pounds or percents. Change voucher_val_post accordingly
	switch( price_input.attr("id") ){
		case "price_input":		voucher_val_post += "price="+ price_input.val(); 
								break;
								
		case "percent_input":	voucher_val_post += "percent="+ price_input.val();
								break;
	}
	
	//--------------------------------// Check if expiration date is set.
	
	if( $( "#exp_date_checker" ).prop('checked')){
		expiration_date = "&exp_date="+ $( "#exp_yyyy" ).val() +"-"+ $( "#exp_mm" ).val() +"-"+ $( "#exp_dd" ).val();
	}

	if($("#voucher-name-checker").prop("checked")){
		voucher_name = "&voucher_name="+ $("#voucher-name").val();
	}
	
	voucher_qty_post = $( '#quantity' ).val();
	
	utils.sendReceiveToID( null, "new_voucher="+voucher_qty_post+"&"+voucher_val_post + vouch_sell_price + expiration_date + voucher_name + "&num_of_disc="+num_of_discount, function(vouch_array){ outputVouchers(vouch_array) });
	
}

//----------------------	OUTPUT VOUCHERS	-----------------------//

function outputVouchers(vouch_array){
	var discount_val	= '',
		exp_date		= 'Вечный',
		tr_class,
		redeemed,
		owner,
		issued,
		num_of_disc;
	
	if(typeof vouch_array == 'string'){
		$( "#voucher_codes_wrap" ).html("<tr><td>"+ vouch_array +"</td></tr>");
	
	} else if(typeof vouch_array == 'object'){
		$( "#voucher_codes_wrap" ).html('');
		for(var i = 0, tot = vouch_array.length; i < tot; i += 1){
			
			if(vouch_array[i][2] != "NA" && vouch_array[i][3] == "NA"){
				discount_val = "£"+vouch_array[i][2];
			} else if(vouch_array[i][3] != "NA" && vouch_array[i][2] == "NA"){
				discount_val = vouch_array[i][3]+"%";	
			}
			
			if(vouch_array[i][4] != "NA"){
				exp_date = vouch_array[i][4];
			} else {
				exp_date = 'Вечный';
			}
			
			tr_class = '';
			switch(vouch_array[i][7]){
				case '0':	issued		= ''; break;
				
				case '1':	issued		= "checked='checked'";
							tr_class	= "voucher_sent";
							break;	
			}
			
			if(vouch_array[i][8] == "1"){
				tr_class = "expired";
			}
			
			switch(vouch_array[i][5]){
				case '0':	redeemed = 'Не использован'; break;
				case '1':	redeemed = 'Использован';
							tr_class = 'voucher_redeemed'; break;	
			}
			
			num_of_disc	= vouch_array[i][9];
			
			$( "#voucher_codes_wrap" ).prepend("<tr class='"+tr_class+"' id='"+vouch_array[i][0]+"'>"+
													"<td><input type='checkbox' class='delete_check' /><a class='remove_butt'></a></td>"+
													"<td class='datecreated'>"+vouch_array[i][11]+"</td>"+
													"<td class='vouch_code'>"+vouch_array[i][1]+"</td>"+
													"<td>"+discount_val+"</td>"+
													"<td>Цена в-ра: £"+vouch_array[i][10]+"</td>"+
													"<td>"+num_of_disc+"</td>"+
													"<td>"+exp_date+"</td>"+
													"<td>"+redeemed+"</td>"+
													"<td><input type='text' class='vouch_owner_inp' maxlength=30 value='"+vouch_array[i][6]+"'></td>"+
													"<td>Отдан<input type='checkbox' class='issued_check' "+issued+"/></td>"
												);
													
		}
		
		$( "#voucher_codes_wrap" ).prepend( "<tr><td><input type='checkbox' id='delete_select' /><a id='delete_butt' class='remove_butt'></a></td><td colspan='3'><a id='delete_used'>Удалить использованые и истёкшие.</a></td></tr>"+
											"<tr><td colspan='7'>&nbsp;</td></tr>" );
		$( ".vouch_owner_inp" )	.bind( 'change', saveOwnerName);
		$( ".issued_check" )	.bind( 'change', markAsSent);
		$( ".remove_butt:not(#delete_butt)" ).bind( 'click', removeThisVouch );
		$( "#delete_select" )	.bind( 'change', checkUncheckToDelete );
		$( "#delete_butt" )		.bind( 'click', deleteSelected );
		$( "#delete_used" )		.bind( 'click', deleteUsedVouchers );
	}
}

//----------------------------	SAVE THE NAME OF A VOUCHER'S OWNER	-----------------------------//
function saveOwnerName(){
	$this	= $( this );
	utils.sendReceiveToID(null, "change_owner="+$this.val()+"&id="+$this.closest('tr').attr('id'), function(){ $this.blur(); });
}

//----------------------------	MARK VOUCHER AS SENT	-----------------------------//
function markAsSent(){
	var $this		= $( this ),
		switch_post	= '';
	
	if($( this ).is( ':checked' )){
		switch_post = 1;
		$this.closest('tr').addClass('voucher_sent');
	} else {
		switch_post = 0;
		$this.closest('tr').removeClass('voucher_sent');
	}
	
	utils.sendReceiveToID(null, "mark_voucher="+switch_post+"&id="+$this.closest('tr').attr('id')); 
}

//----------------------------	REMOVE VOUCHER	--------------------------------------//
function removeThisVouch(){
	var $this = $( this );
	
	if( $this.closest( 'tr' ).hasClass( 'voucher_sent' ) ){
		if(confirm('Удалить? Ваучер отдан, но ещё не использован.')){
			utils.sendReceiveToID(null, "delete_vaucher="+$this.closest('tr').attr('id'), function(){ $this.closest('tr').remove() });	
		}
	} else {
		utils.sendReceiveToID(null, "delete_vaucher="+$this.closest('tr').attr('id'), function(){ $this.closest('tr').remove() });
	}
}

//---------------------------
function checkUncheckToDelete(){
	if( $( this ).is(":checked") ){
		$( ".delete_check" ).attr("checked", "checked");	
	} else {
		$( ".delete_check" ).removeAttr("checked");	
	}
}

//---------------------------
function deleteSelected(){
	var post = 'delete_vouchers=1&IDs=',
		$this = $( this );
	if(confirm("Delete? Selected Vouchers?")){
		$( ".delete_check:checked" ).closest( 'tr' ).each( function(){ post += $( this ).attr("id") +"ID" } );
		
		utils.sendReceiveToID(null, post, function(deleted){
												for(var i = 0, tot = deleted.length; i < tot-1; i +=1){
													$( "#"+deleted[i] ).remove();
												}
												
												$( "#delete_select" ).removeAttr( 'checked' );
										  });
	}
}

function deleteUsedVouchers(){
	utils.sendReceiveToID(null, "delete_expired=1", function(vouch_array){	outputVouchers(vouch_array)	});
}
