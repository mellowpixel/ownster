<?php

function emailHTML($identity, $order, $addr){
    if(property_exists($order, "voucher")){
        $voucher_row = "<tr>
                            <td style='padding: 5px;'>Voucher</td>
                            <td style='padding: 5px;'>".$order->voucher."</td>
                        </tr>";
    } else {
        $voucher_row = "";
    }

return "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
    <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <title>A Simple Responsive HTML Email</title>
        <style type='text/css'>
            body {margin: 0; padding: 0; min-width: 100%!important;font-family:Arial, Helvetica, sans-serif; font-size:14px;}
            .content {width: 100%; max-width: 600px;}
            @media only screen and (min-device-width: 701px) {
                .content {max-width: 650px !important;}
                header {padding: 20px 10px 0px 30px;}
            }
            @media screen and (max-width: 500px) {
                .left-column,
                .right-column{width:100% !important;}
            }
            .left-column,
            .right-column{width:49%;float:left;}
            .right-aligned-col{width:50%; float: right;}
            .column-header{ background-color:#71ee1f; color:#000}
            .column-header h2 {font-size: 100%; padding: 6px; margin:0px;}
            a {color: #333; font-weight: bold;}
            table{border-collapse: collapse;}
            td{padding: 5px;}
        </style>
    </head>
    <body yahoo bgcolor='#ffffff' style='margin: 0;padding: 0;font-family: Arial, Helvetica, sans-serif;font-size: 14px;min-width: 100%!important;'>
        <table width='100%' bgcolor='#ffffff' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse;'>
            <tr>
                <td style='padding: 5px;'>
        <!--[if (gte mso 9)|(IE)]>
        <table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>
            <tr>
                <td>
                    <![endif]-->
                    <table class='content' align='center' cellpadding='0' cellspacing='0' border='0' style='border-collapse: collapse;width: 100%;max-width: 600px;'>
                        <tr>
                            <td class='header' bgcolor='#ffffff' style='padding: 5px;'> <!-- #18f616' -->
                                <h1>Hello".$identity->name."!</h1>
                                <p>Thank you for your order from Ownster. Your order will be sent by us within the next 24 hours, as long as payment has been received. If you have any questions about your order please contact us at <a href='mailto:support@ownster.co.uk?Subject=Question%20About%20The%20Order.' style='color: #333;font-weight: bold;'>support@ownster.co.uk</a></p>
                                
                                <p>Your order confirmation is below.</p>
                                <p style='font-size:14px'>Your Order <b>#".$order->order_number."</b> (placed on ".$order->order_placed_date.")</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#ffffff' style='padding: 5px;'>
                                <table class='left-column' style='border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Shipping Information:</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>".$addr->address_name."<br>".
                                                $addr->address_street."<br>".
                                                $addr->address_city."<br>".
                                                $addr->address_zip."<br>".
                                                $addr->address_country.
                                            "</p>
                                        </td>
                                    </tr>
                                </table>
                                <table class='right-column' style='margin-left: 3px;border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Payment Method:</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>PayPal Website Payments Standard</p><strong style='font-size:14'>Payer Email: ".$identity->payer_email."</strong>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#ffffff' style='padding: 5px;'>
                                <!-- ************************************************* -->
                                <table class='left-column' style='border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Estimated delivery date:</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>".$order->delivery_date."</p>
                                        </td>
                                    </tr>
                                </table>
                                <table class='right-column' style='margin-left: 3px;border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Shipping Method:</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>".$order->shipping_method."</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#ffffff' style='padding: 5px;'>
                                <!-- ************************************************************ -->
                                <table class='left-column' style='border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Item</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>".$order->item_names."</p>
                                        </td>
                                    </tr>
                                </table>
                                <table class='right-column' style='border-collapse: collapse;width: 49%;float: left;'>
                                    <tr>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Qty.</h2>
                                        </td>
                                        <td class='column-header' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                            <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Item Number</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>
                                            <p>".$order->item_qtys."</p>
                                        </td>
                                        <td style='padding: 5px;'>
                                            <p>".$order->item_nums."</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#ffffff' style='padding: 5px;'>
                                <table class='right-aligned-col' style='border-collapse: collapse;width: 50%;float: right;'>
                                    $voucher_row
                                    <tr>
                                        <td style='padding: 5px;'>Subtotal</td>
                                        <td style='padding: 5px;'>&pound;".$order->subtotal."</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>Shipping & Handling</td>
                                        <td style='padding: 5px;'>&pound;".$order->shipping_handling."</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 5px;'>Grand Total</td>
                                        <td style='padding: 5px;'>&pound;".$order->grand_total."</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class='column-header' align='center' style='padding: 5px;background-color: #71ee1f;color: #000;'>
                                <h2 style='font-size: 100%;padding: 6px;margin: 0px;'>Thank you again! <a href='http://ownster.co.uk' style='color: #333;font-weight: bold;'>Ownster.co.uk</a></h2>
                            </td>
                        </tr>
                   </table>
                  <!--[if (gte mso 9)|(IE)]>
                </td>
            </tr>
        </table>
        <![endif]-->
                </td>
            </tr>
        </table>
    </body>
</html>";

}

?>