<?php
    $hostname = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'meeting';    
    $con = @mysqli_connect($hostname, $username, $password, $dbname);
    if(mysqli_connect_errno())
    {
        echo 'Error in connecting to DB ' . mysqli_connect_error();
        exit;
    }
?>