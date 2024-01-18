import { siteUrl } from "./consts.js";
import { formatCurrency } from "./utils.js";

export function newOrderClientEmailTemplate(order){
    let paymentMethod = '';

    if(order.paymentMethod === 'stripe') {
        paymentMethod = 'Tarjeta de credito';
    } else if(order.paymentMethod === 'paypal') {
        paymentMethod = 'PayPal';
    }

    return `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und">

    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Pedido recibido</title><!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {
                max-height: 0px !important;
                display: none !important;
            }

            .rollover:hover .rollover-second {
                max-height: none !important;
                display: block !important;
            }

            .rollover span {
                font-size: 0px;
            }

            u+.body img~div div {
                display: none;
            }

            #outlook a {
                padding: 0;
            }

            span.MsoHyperlink,
            span.MsoHyperlinkFollowed {
                color: inherit;
                mso-style-priority: 99;
            }

            a.es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }

            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }

            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }

            .es-button-border:hover>a.es-button {
                color: #ffffff !important;
            }

            @media only screen and (max-width:600px) {
                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0l {
                    padding-left: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0l {
                    padding-left: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                .es-m-p20b {
                    padding-bottom: 20px !important
                }

                .es-m-p0r {
                    padding-right: 0px !important
                }

                *[class="gmail-fix"] {
                    display: none !important
                }

                p,
                a {
                    line-height: 150% !important
                }

                h1,
                h1 a {
                    line-height: 120% !important
                }

                h2,
                h2 a {
                    line-height: 120% !important
                }

                h3,
                h3 a {
                    line-height: 120% !important
                }

                h4,
                h4 a {
                    line-height: 120% !important
                }

                h5,
                h5 a {
                    line-height: 120% !important
                }

                h6,
                h6 a {
                    line-height: 120% !important
                }

                h1 {
                    font-size: 36px !important;
                    text-align: left
                }

                h2 {
                    font-size: 26px !important;
                    text-align: left
                }

                h3 {
                    font-size: 20px !important;
                    text-align: left
                }

                h4 {
                    font-size: 24px !important;
                    text-align: left
                }

                h5 {
                    font-size: 20px !important;
                    text-align: left
                }

                h6 {
                    font-size: 16px !important;
                    text-align: left
                }

                .es-header-body h1 a,
                .es-content-body h1 a,
                .es-footer-body h1 a {
                    font-size: 36px !important
                }

                .es-header-body h2 a,
                .es-content-body h2 a,
                .es-footer-body h2 a {
                    font-size: 26px !important
                }

                .es-header-body h3 a,
                .es-content-body h3 a,
                .es-footer-body h3 a {
                    font-size: 20px !important
                }

                .es-header-body h4 a,
                .es-content-body h4 a,
                .es-footer-body h4 a {
                    font-size: 24px !important
                }

                .es-header-body h5 a,
                .es-content-body h5 a,
                .es-footer-body h5 a {
                    font-size: 20px !important
                }

                .es-header-body h6 a,
                .es-content-body h6 a,
                .es-footer-body h6 a {
                    font-size: 16px !important
                }

                .es-menu td a {
                    font-size: 12px !important
                }

                .es-header-body p,
                .es-header-body a {
                    font-size: 14px !important
                }

                .es-content-body p,
                .es-content-body a {
                    font-size: 14px !important
                }

                .es-footer-body p,
                .es-footer-body a {
                    font-size: 14px !important
                }

                .es-infoblock p,
                .es-infoblock a {
                    font-size: 12px !important
                }

                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3,
                .es-m-txt-c h4,
                .es-m-txt-c h5,
                .es-m-txt-c h6 {
                    text-align: center !important
                }

                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3,
                .es-m-txt-r h4,
                .es-m-txt-r h5,
                .es-m-txt-r h6 {
                    text-align: right !important
                }

                .es-m-txt-j,
                .es-m-txt-j h1,
                .es-m-txt-j h2,
                .es-m-txt-j h3,
                .es-m-txt-j h4,
                .es-m-txt-j h5,
                .es-m-txt-j h6 {
                    text-align: justify !important
                }

                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3,
                .es-m-txt-l h4,
                .es-m-txt-l h5,
                .es-m-txt-l h6 {
                    text-align: left !important
                }

                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important
                }

                .es-m-txt-r .rollover:hover .rollover-second,
                .es-m-txt-c .rollover:hover .rollover-second,
                .es-m-txt-l .rollover:hover .rollover-second {
                    display: inline !important
                }

                .es-m-txt-r .rollover span,
                .es-m-txt-c .rollover span,
                .es-m-txt-l .rollover span {
                    line-height: 0 !important;
                    font-size: 0 !important
                }

                .es-spacer {
                    display: inline-table
                }

                a.es-button,
                button.es-button {
                    font-size: 20px !important;
                    line-height: 120% !important
                }

                a.es-button,
                button.es-button,
                .es-button-border {
                    display: inline-block !important
                }

                .es-m-fw,
                .es-m-fw.es-fw,
                .es-m-fw .es-button {
                    display: block !important
                }

                .es-m-il,
                .es-m-il .es-button,
                .es-social,
                .es-social td,
                .es-menu {
                    display: inline-block !important
                }

                .es-adaptive table,
                .es-left,
                .es-right {
                    width: 100% !important
                }

                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important
                }

                .adapt-img {
                    width: 100% !important;
                    height: auto !important
                }

                .es-mobile-hidden,
                .es-hidden {
                    display: none !important
                }

                .es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important
                }

                tr.es-desk-hidden {
                    display: table-row !important
                }

                table.es-desk-hidden {
                    display: table !important
                }

                td.es-desk-menu-hidden {
                    display: table-cell !important
                }

                .es-menu td {
                    width: 1% !important
                }

                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important
                }

                .es-social td {
                    padding-bottom: 10px
                }

                .h-auto {
                    height: auto !important
                }
            }

            @media screen and (max-width:384px) {
                .mail-message-content {
                    width: 414px !important
                }
            }
        </style>
    </head>

    <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
        <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#fafafa"></v:fill>
                </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
                <tr>
                    <td valign="top" style="padding:0;Margin:0">
                        <table cellpadding="0" cellspacing="0" class="es-header" align="center"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0"
                                        cellspacing="0"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                        <tr>
                                            <td align="left" style="padding:20px;Margin:0">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td class="es-m-p0r" valign="top" align="center"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-bottom:10px;font-size:0px">
                                                                        <img src="https://ecjfghm.stripocdn.email/content/guids/CABINET_d2d6fbf4860abd92513d24381cdbdfef27bce0823669917fe7ac77ae9a3eb38e/images/image_iTQ.png"
                                                                            alt="Logo"
                                                                            style="display:block;font-size:12px;border:0;outline:none;text-decoration:none"
                                                                            width="200" title="Logo"></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0"
                                        cellspacing="0"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                        <tr>
                                            <td align="left"
                                                style="padding:0;Margin:0;padding-top:15px;padding-right:20px;padding-left:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-bottom:10px;padding-top:10px;font-size:0px">
                                                                        <img src="https://ecjfghm.stripocdn.email/content/guids/CABINET_d2d6fbf4860abd92513d24381cdbdfef27bce0823669917fe7ac77ae9a3eb38e/images/image_HcS.png"
                                                                            alt=""
                                                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                                                            width="100"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" class="es-m-txt-c"
                                                                        style="padding:0;Margin:0;padding-bottom:10px">
                                                                        <h1
                                                                            style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:46px;color:#333333">
                                                                            Compra realizada</h1>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0"
                                        cellspacing="0"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                        <tr>
                                            <td align="left" style="padding:20px;Margin:0">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center" class="es-m-txt-c"
                                                                        style="padding:0;Margin:0">
                                                                        <h2
                                                                            style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:26px;font-style:normal;font-weight:bold;line-height:31px;color:#333333">
                                                                            Número de pedido:
                                                                            <a target="_blank" href="${siteUrl+'/mi-cuenta/pedidos/'+ order.orderNumber}"
                                                                                style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:26px">
                                                                                ${order.orderNumber || '#999999'}
                                                                            </a>
                                                                        </h2>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" class="es-m-p0r es-m-p0l"
                                                                        style="Margin:0;padding-top:5px;padding-right:40px;padding-bottom:5px;padding-left:40px">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            ${order.createdAt}
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" class="es-m-p0r es-m-p0l"
                                                                        style="Margin:0;padding-top:5px;padding-right:40px;padding-left:40px;padding-bottom:15px">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Tu compra se ha realizado correctamente y tu
                                                                            pedido está en proceso.
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Compra realizada con <strong>
                                                                                ${paymentMethod}</strong></strong>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="padding:0;Margin:0"><span
                                                                            class="es-button-border"
                                                                            style="border-style:solid;border-color:transparent;background:#6aa84f;border-width:2px;display:inline-block;border-radius:6px;width:auto"><a
                                                                                href="" class="es-button" target="_blank"
                                                                                style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#6aa84f;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #6aa84f;border-left-width:30px;border-right-width:30px">Procesando
                                                                                tu pedido</a></span></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        ${generateItemsHtml(order.items)}

                                        <tr>
                                            <td align="left"
                                                style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:10px">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td class="es-m-p0r" align="center"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top:2px solid #efefef;border-bottom:2px solid #efefef">
                                                                <tr>
                                                                    <td align="right" class="es-m-txt-r"
                                                                        style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Subtotal:
                                                                            <strong>${formatCurrency(order.subtotal)}</strong><br>
                                                                            Envío:
                                                                            <strong>${formatCurrency(order.shippingCost)}</strong><br>
                                                                            IVA: <strong>Incluido</strong><br>
                                                                            Total:
                                                                            <strong>${formatCurrency(order.total)}</strong>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left"
                                                style="Margin:0;padding-bottom:10px;padding-right:20px;padding-left:20px;padding-top:20px">
                                                <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:280px" valign="top"><![endif]-->
                                                <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                    <tr>
                                                        <td class="es-m-p0r es-m-p20b" align="center"
                                                            style="padding:0;Margin:0;width:280px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="left" style="padding:0;Margin:0">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Cliente: <strong>${order.email}</strong>
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Número de pedido:
                                                                            <strong>#${order.orderNumber}</strong>
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Fecha: Diciembre<strong> 6, 2023</strong>
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Método de pago:
                                                                            <strong>${paymentMethod}</strong>
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Divisa: EUR
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]></td><td style="width:0px"></td><td style="width:280px" valign="top"><![endif]-->
                                                <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                                    <tr>
                                                        <td class="es-m-p0r" align="center"
                                                            style="padding:0;Margin:0;width:280px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="left" class="es-m-txt-l"
                                                                        style="padding:0;Margin:0">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Tipo de envío:
                                                                            <strong>${order.shippingType}</strong></p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            Dirección de envío:</p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            <strong>
                                                                                ${order.customerName},<br>
                                                                                ${order.shippingAddress.line1},<br>
                                                                                ${order.shippingAddress.city},
                                                                                ${order.shippingAddress.state}
                                                                                ${order.shippingAddress.postal_code}
                                                                            </strong>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table><!--[if mso]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left"
                                                style="Margin:0;padding-bottom:10px;padding-top:15px;padding-right:20px;padding-left:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="left" style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-bottom:10px;padding-top:10px">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                                            ¿Tienes alguna pregunta? Envíanos un correo
                                                                            electrónico a contacto@elmundodelsaquito.es
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-footer" align="center"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px">
                                        <tr>
                                            <td align="left"
                                                style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:20px;padding-top:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="left" style="padding:0;Margin:0;width:600px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                                                                        <table cellpadding="0" cellspacing="0"
                                                                            class="es-table-not-adapt es-social"
                                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                            <tr>
                                                                                <td align="center" valign="top"
                                                                                    style="padding:0;Margin:0;padding-right:40px">
                                                                                    <img title="Facebook"
                                                                                        src="https://ecjfghm.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png"
                                                                                        alt="Fb" width="32"
                                                                                        style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                                                                                </td>
                                                                                <td align="center" valign="top"
                                                                                    style="padding:0;Margin:0;padding-right:40px">
                                                                                    <img title="X.com"
                                                                                        src="https://ecjfghm.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png"
                                                                                        alt="X" width="32"
                                                                                        style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                                                                                </td>
                                                                                <td align="center" valign="top"
                                                                                    style="padding:0;Margin:0;padding-right:40px">
                                                                                    <img title="Instagram"
                                                                                        src="https://ecjfghm.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png"
                                                                                        alt="Inst" width="32"
                                                                                        style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                                                                                </td>
                                                                                <td align="center" valign="top"
                                                                                    style="padding:0;Margin:0"><img
                                                                                        title="Youtube"
                                                                                        src="https://ecjfghm.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png"
                                                                                        alt="Yt" width="32"
                                                                                        style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"
                                                                        style="padding:0;Margin:0;padding-bottom:35px">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">
                                                                            El mundo del saquito © 2023 All Rights Reserved.
                                                                        </p>
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">
                                                                            Puigmarí 716, Caldes de Malavella, Girona, ES,
                                                                            17455</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:0;Margin:0">
                                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                                            class="es-menu"
                                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                            <tr class="links">
                                                                                <td align="center" valign="top"
                                                                                    width="33.33%"
                                                                                    style="Margin:0;border:0;padding-bottom:5px;padding-top:5px;padding-right:5px;padding-left:5px">
                                                                                    <a target="_blank" href="${siteUrl + '/politica-de-privacidad'}"
                                                                                        style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">Ir
                                                                                        a elmundodelsaquito.es</a></td>
                                                                                <td align="center" valign="top"
                                                                                    width="33.33%"
                                                                                    style="Margin:0;border:0;padding-bottom:5px;padding-top:5px;padding-right:5px;padding-left:5px;border-left:1px solid #cccccc">
                                                                                    <a target="_blank" href=""
                                                                                        style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">Política
                                                                                        de privacidad</a></td>
                                                                                <td align="center" valign="top"
                                                                                    width="33.33%"
                                                                                    style="Margin:0;border:0;padding-bottom:5px;padding-top:5px;padding-right:5px;padding-left:5px;border-left:1px solid #cccccc">
                                                                                    <a target="_blank" href="${siteUrl + '/aviso-legal'}" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">
                                                                                        Avíso legal
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td class="es-info-area" align="center" style="padding:0;Margin:0">
                                    <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                        bgcolor="#FFFFFF">
                                        <tr>
                                            <td align="left" style="padding:20px;Margin:0">
                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center" class="es-infoblock"
                                                                        style="padding:0;Margin:0">
                                                                        <p
                                                                            style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px">
                                                                            No respondas a este correo electrónico.</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>

    </html>
    `
}

function generateItemsHtml(items){
    let resultHtml = '';

    Object.values(items).forEach(item => {
        const { name, imageSrc, price, quantity, selectedAttributes } = item;
        resultHtml += `
        <tr>
            <td class="esdev-adapt-off" align="left"
                style="Margin:0;padding-bottom:10px;padding-right:20px;padding-left:20px;padding-top:10px">
                <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                    <tr>
                        <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left"
                                align="left"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                <tr>
                                    <td class="es-m-p0r" align="center"
                                        style="padding:0;Margin:0;width:70px">
                                        <table cellpadding="0" cellspacing="0" width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center"
                                                    style="padding:0;Margin:0;font-size:0px">
                                                    <img class="adapt-img"
                                                        src="${imageSrc}"
                                                        alt=""
                                                        style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                                        width="70"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="padding:0;Margin:0;width:20px"></td>
                        
                        <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left"
                                align="left"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                <tr>
                                    <td align="center"
                                        style="padding:0;Margin:0;width:265px">
                                        <table cellpadding="0" cellspacing="0" width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="left" style="padding:0;Margin:0">
                                                    <p
                                                        style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                        <strong>${name}</strong></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-top:5px">
                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                        ${generateItemAttributesHtml(item)}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <td style="padding:0;Margin:0;width:20px"></td>

                        <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left"
                                align="left"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;width:80px">
                                        <table cellpadding="0" cellspacing="0" width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center"
                                                    style="padding:0;Margin:0">
                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                        x${quantity}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <td style="padding:0;Margin:0;width:20px"></td>
                        
                        <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right"
                                align="right"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;width:85px">
                                        <table cellpadding="0" cellspacing="0" width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="right"
                                                    style="padding:0;Margin:0">
                                                    <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                        ${formatCurrency(price*quantity)}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>

                    </tr>
                </table>
            </td>
        </tr>
        `
    })

    return resultHtml;

}

function generateItemAttributesHtml(item){
    const { selectedAttributes } = item;

    let resultHtml = '';

    selectedAttributes.forEach((attribute, index) => {
        resultHtml += `${attribute.viewValue}: ${attribute.optionSelected}`;
        if(index < selectedAttributes.length - 1){
            resultHtml += '<br>';
        }
    });

    return resultHtml;
}