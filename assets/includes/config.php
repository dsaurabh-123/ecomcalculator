<?php require('dbx.php');?>
<?php
    // Report all errors except E_NOTICE
    error_reporting(E_ALL & ~E_NOTICE);

    defined("HOST") ? null : define("HOST", $_SERVER['HTTP_HOST']);
    
    defined("SITE_URL") ? null : define("SITE_URL", "http://".HOST);
    
    defined("MEMBERS_PAGE_URL") ? null : define("MEMBERS_PAGE_URL", SITE_URL."/members/");
    
    defined("SITE_NAME") ? null : define("SITE_NAME", "VJEG");
    
    $sql_db = "SELECT email_addr FROM admin_email";
    $result_db = mysqli_query($con, $sql_db);
    if($result_db && $myrow_db = mysqli_fetch_array($result_db))
    {
        $email_addr = $myrow_db["email_addr"];
    }
    else
    {
        $email_addr = "vaibhavmore.20feb@gmail.com";
    }
    defined('ADMIN_EMAIL_ADDRESS') ? null : define("ADMIN_EMAIL_ADDRESS", $email_addr);

    $scriptname = $_SERVER['SCRIPT_FILENAME'];
    $pagetitle = strtolower(trim(substr($_SERVER['PHP_SELF'],strrpos($_SERVER['PHP_SELF'], "/")+1))); 
    
    defined('CONTACTUS_REPLY_ADD') ? null : define("CONTACTUS_REPLY_ADD", "no-reply@ssjcet.com");
    defined('CONTACTUS_REPLY_NAME') ? null : define("CONTACTUS_REPLY_NAME", "Team ".SITE_NAME);
    defined('CONTACTUS_FROM_ADD') ? null : define("CONTACTUS_FROM_ADD", "no-reply@ssjcet.com");
    defined('CONTACTUS_FROM_NAME') ? null : define("CONTACTUS_FROM_NAME", "Team ".SITE_NAME);    
    
    // Other configuration related to email
    // 1 : Use; 0: Use default php mail function settings
    defined('USE_SMTP_SERVER') ? null : define("USE_SMTP_SERVER", "0");
    defined('SMTP_HOST') ? null : define("SMTP_HOST", "");
    defined('SMTP_HOST_PORT') ? null : define("SMTP_HOST_PORT", "");
    defined('SMTP_HOST_USERNAME') ? null : define("SMTP_HOST_USERNAME", "");
    defined('SMTP_HOST_PASSWORD') ? null : define("SMTP_HOST_PASSWORD", "");
    // 1 = errors and messages; 2 = messages only
    defined('SMTP_DEBUGGING') ? null : define("SMTP_DEBUGGING", "2");
    defined('RECEIPT_LOGO') ? null : define("RECEIPT_LOGO", SITE_URL."/img/receipt_logo.jpg");
    defined('RECEIPT_PDF_FOLDER_ROOT') ? null : define("RECEIPT_PDF_FOLDER_ROOT", "/receipt_pdf");
    define("RECEIPT_PDF_FOLDER_DIR_LINK", SITE_URL.RECEIPT_PDF_FOLDER_ROOT);
    
    define("MOBILE_APP_URL", 'index.php');
    defined('STUDENT_EXCEL_BASE_URL') ? null : define("STUDENT_EXCEL_BASE_URL", "/student_excel");
    defined('PAYMENT_DAYS') ? null : define("PAYMENT_DAYS", 15);
    defined('FINANCIAL_YEAR_MONTHS') ? null : define("FINANCIAL_YEAR_MONTHS", 'April-March');
    
    
//    for profile picture
    define("PROFILE_IMAGE_FOLDER_ROOT", "vaishalitaijondhaleeducationalgroup.com/images/profile_images");
    /*define("PROFILE_IMG_GALLERY", SITE_URL."/".PROFILE_IMAGE_FOLDER_ROOT);*/
    define("PROFILE_IMG_GALLERY", PROFILE_IMAGE_FOLDER_ROOT);
    
    define("PROFILE_THUMB_IMAGE_FOLDER_ROOT", "vaishalitaijondhaleeducationalgroup.com/images/profile_images/thumbnails");
    /*define("PROFILE_THUMB_IMAGE_GALLERY", SITE_URL."/".PROFILE_THUMB_IMAGE_FOLDER_ROOT);*/
    define("PROFILE_THUMB_IMAGE_GALLERY", PROFILE_THUMB_IMAGE_FOLDER_ROOT);
    define("PROFILE_THUMB_IMAGE_WIDTH", 350);
    define("PROFILE_THUMB_IMAGE_HEIGHT", 320);
    define("PROFILE_THUMB_IMAGE_QUALITY", 70); 

    define("ADVERTISEMENT_IMAGE_FOLDER_ROOT", "vaishalitaijondhaleeducationalgroup.com/images/advertisement");
    define("ADVERTISEMENT_THUMB_IMAGE_FOLDER_ROOT", "vaishalitaijondhaleeducationalgroup.com/images/advertisement/thumb");
    /*define("ADVERTISEMENT_THUMB_IMAGE_GALLERY", SITE_URL."/".ADVERTISEMENT_THUMB_IMAGE_FOLDER_ROOT);*/
    define("ADVERTISEMENT_THUMB_IMAGE_GALLERY", ADVERTISEMENT_THUMB_IMAGE_FOLDER_ROOT);
    define("ADVERTISEMENT_THUMB_IMAGE_WIDTH", 350);
    define("ADVERTISEMENT_THUMB_IMAGE_HEIGHT", 320);
    define("ADVERTISEMENT_THUMB_IMAGE_QUALITY", 70);  


    
    define("ALBUM_THUMB_IMAGE_FOLDER_ROOT", "vaishalitaijondhaleeducationalgroup.com/members/owner/processreq/uploads");
    define("ALBUM_THUMB_IMAGE_FOLDER", SITE_URL."/".ALBUM_THUMB_IMAGE_FOLDER_ROOT);

?>