<?php
require_once("initialize2.php");    

/*
*====================================================================
* Reason : Purpose of code block is to take backup of database 
* but not working due to permissions 
* Date of Comment : 13/01/2018 6:00 AM
* Developer Name : Vaibhav
*====================================================================
*/

$backup_file = 'Database/'. $dbname .'_'. date("Y-m-d-H-i-s") . '.sql';
$command 	 = 'mysqldump --user='.$username.' --password='.$password.' --host='.$hostname.' '.$dbname.' > '.$backup_file.'';
echo $command;
exec($command);

//closing connections
mysqli_close($con);
exit;
/*
*====================================================================
* code block end here
*====================================================================
*/

?>