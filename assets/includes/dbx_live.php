<?php
    $hostname = 'localhost';
    $username = 'vaishal2_meeting';
    $password = 'f@keuser123';
    $dbname = 'vaishal2_meeting';    
    $con = @mysqli_connect($hostname, $username, $password, $dbname);
    if(mysqli_connect_errno())
    {
        echo 'Error in connecting to DB ' . mysqli_connect_error();
        exit;
    }
?>