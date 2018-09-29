<?php
    require_once("initialize2.php");    
    
    $jsonarray = array();
    
    $name = ($_POST["name"]);
    $email_addr = ($_POST["email"]);
    $phone = ($_POST["phone"]);
    /*$subject = ($_POST["subject"]);*/
    $message = ($_POST["message"]);
    
//    exit;
    
    if($name == "" || $phone == "")
    {
        $error = 1;
        $error_msg = "Please Fill All Fields.";
        $jsonarray["code"] = $error;
        $jsonarray["msg"] = $error_msg;
        echo json_encode($jsonarray);
        exit;
    }
    
    if($email_addr != '')
    {
        if(!filter_var($email_addr, FILTER_VALIDATE_EMAIL))
        {
            $error = 1;
            $error_msg = "Please provide valid email address.";
            $jsonarray["code"] = $error;
            $jsonarray["msg"] = $error_msg;
            echo json_encode($jsonarray);
            exit;
        }
    }

    if($phone != '')
    {
        if(!is_numeric($phone))    
        {
           $error = 1;
           $error_msg = "Please provide valid Phone Number.";
           $jsonarray["code"] = $error;
           $jsonarray["msg"] = $error_msg;
           echo json_encode($jsonarray);
           exit;
        }
        
        if(strlen($phone) < 10)
        {
           $error = 1;
           $error_msg = "Mobile number should be minimum 10 digits ";
           $jsonarray["code"] = $error;
           $jsonarray["msg"] = $error_msg;
           echo json_encode($jsonarray);
           exit;
        }
    }
    
    require_once("class.phpmailer.php");
    $email_subject = "".SITE_NAME."";

    $mailbody = "Hi Admin, you have a new enquery. details are given below :<br/><br/>
                        Name - ".$name."<br/>  
                        Email - ".$email_addr."<br/>
                        Phone - ".$phone."<br/>
                        Message - ".$message."<br/>";
    
    
    
    $mailbody .= "  <br/><br/>
                    Thanks ,<br/>
                    Regards <br/>                 
                   <strong>Team " . SITE_NAME . "</strong>";
    $reply_address = CONTACTUS_REPLY_ADD;
    $reply_person_name = CONTACTUS_REPLY_NAME;
    $from_address = CONTACTUS_FROM_ADD;
    $from_name = CONTACTUS_FROM_NAME;
    $alt_body = "To view the message, please use an HTML compatible email viewer!";

    $mail = new PHPMailer(); // defaults to using php "mail()"

    if(USE_SMTP_SERVER==1)
    {
        $mail->IsSMTP(); // telling the class to use SMTP
        // 1 = errors and messages
        // 2 = messages only
        $mail->SMTPDebug  = SMTP_DEBUGGING;                     // enables SMTP debug information (for testing)
        $mail->SMTPAuth   = true;                  // enable SMTP authentication
        $mail->Host       = SMTP_HOST; // sets the SMTP server
        $mail->Port       = SMTP_HOST_PORT;                    // set the SMTP port for the GMAIL server
        $mail->Username   = SMTP_HOST_USERNAME; // SMTP account agent_username
        $mail->Password   = SMTP_HOST_PASSWORD;        // SMTP account password                
    }                

    $body = $mailbody;
    $mail->SetFrom($from_address, $from_name);
    $mail->AddReplyTo($reply_address,$reply_person_name);

    $mail->AddAddress(ADMIN_EMAIL_ADDRESS);

    $mail->Subject = $email_subject;
    $mail->AltBody = $alt_body; // optional, comment out and test
    $mail->MsgHTML($body);
    if(!$mail->Send())
    {       
        $error = 1;
        $error_msg = "Something Went Wrong While Sending a Enquiry, Please Try again later !!!";
        $jsonarray["code"] = $error;
        $jsonarray["msg"] = $error_msg;
        echo json_encode($jsonarray);
        exit;
    }
    
    
    $error = 0;
    $error_msg = "Your Enquiry Successfully Sent";
    $jsonarray["code"] = $error;
    $jsonarray["msg"] = $error_msg;
    echo json_encode($jsonarray);
    exit;  
    
?>