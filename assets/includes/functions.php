<?php
    function logincheck($role)
    {
        global $con;
        $return = 0;
        if(isset($_COOKIE["USER_FNAME"]) && isset($_COOKIE["USER_ID"]) && isset($_COOKIE["USER_TOKEN"]))
        {
            //sql query
            $sql = 'SELECT lname FROM user WHERE id="'.$_COOKIE["USER_ID"].'" AND token ="'.$_COOKIE["USER_TOKEN"].'" AND role="'.$role.'"';            
            $result = mysqli_query($con, $sql);
            if($myrow = mysqli_fetch_array($result))
            {
                $return = 1;
            }
            else
            {
                $return = 0;
            }
        }
        return $return;
    }
    
    function randomPassword() 
    {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }
    
    //generate random username
    function generate_alphanum_5char() 
    {
        $generate_alphanum_5char = strtoupper(substr(uniqid(), 1, 5));
        return $generate_alphanum_5char;
    }
    
    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
        
    function getIndianCurrency($number)
    {
        $decimal = round($number - ($no = floor($number)), 2) * 100;
        $hundred = null;
        $digits_length = strlen($no);
        $i = 0;
        $str = array();
        $words = array(0 => '', 1 => 'one', 2 => 'two',
            3 => 'three', 4 => 'four', 5 => 'five', 6 => 'six',
            7 => 'seven', 8 => 'eight', 9 => 'nine',
            10 => 'ten', 11 => 'eleven', 12 => 'twelve',
            13 => 'thirteen', 14 => 'fourteen', 15 => 'fifteen',
            16 => 'sixteen', 17 => 'seventeen', 18 => 'eighteen',
            19 => 'nineteen', 20 => 'twenty', 30 => 'thirty',
            40 => 'forty', 50 => 'fifty', 60 => 'sixty',
            70 => 'seventy', 80 => 'eighty', 90 => 'ninety');
        $digits = array('', 'hundred','thousand','lakh', 'crore');
        while( $i < $digits_length ) {
            $divider = ($i == 2) ? 10 : 100;
            $number = floor($no % $divider);
            $no = floor($no / $divider);
            $i += $divider == 10 ? 1 : 2;
            if ($number) {
                $plural = (($counter = count($str)) && $number > 9) ? 's' : null;
                $hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
                $str [] = ($number < 21) ? $words[$number].' '. $digits[$counter]. $plural.' '.$hundred:$words[floor($number / 10) * 10].' '.$words[$number % 10]. ' '.$digits[$counter].$plural.' '.$hundred;
            } else $str[] = null;
        }
        $Rupees = implode('', array_reverse($str));
        $paise = ($decimal) ? "." . ($words[$decimal / 10] . " " . $words[$decimal % 10]) . ' Paise' : '';
        return ($Rupees ? $Rupees . 'Rupees' : '') . $paise ;
    }


    function sanitize_input($data)
    {
        global $con;
        $data = trim($data);  
        $data = mysqli_real_escape_string($con, $data);
        return $data;
    }

    //    require_once $_SERVER["DOCUMENT_ROOT"].'/lib/excel_lib/PHPExcel.php';

    function excelToArray($filePath)
    {
        //Create excel reader after determining the file type
        $inputFileName = $filePath;    
        /**  Identify the type of $inputFileName  **/
        $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
        /**  Create a new Reader of the type that has been identified  **/
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        /** Set read type to read cell data onl **/
        $objReader->setReadDataOnly(true);
        /**  Load $inputFileName to a PHPExcel Object  **/
        $objPHPExcel = $objReader->load($inputFileName);
        //Get worksheet and built array with first row as header
        $objWorksheet = $objPHPExcel->getActiveSheet();

        //excel sheet with no header
        $namedDataArray = $objWorksheet->toArray(null,true,true,false);
        return $namedDataArray;
    }

    function customEmpty($data){
        if($data == "" || $data == null)
        {
            return "-";
        }
        else
        {
            global $con;
            $data = trim($data);  
            $data = mysqli_real_escape_string($con, $data);
            return $data;
        }
    }

    function custoMerger($data)
    {
        for($x = 0; $x < count($data); $x++)
        {
            if($data[$x] != "-")
            {
                $output = $data[$x];    
            }
            
        }
        return $output;
    }    

    function customQuery($data)
    {
        $output = "";
        foreach ($data as $key => $value) 
        {
            if($value == 1)
            {
                $output .=  "`status` = '". $key ."' OR ";       
            }
            
        }

        if($output != "")
        {
            $output = substr_replace( $output, "", -3 );
            $final_output .= " ( " .$output. " ) ";
        }
        return $final_output;
    }

    function customTime($time){
        if($time == "00:00:00")
        {
            return "-";
        }
        else
        {
            return $time;
        }

    }

    function customDate($date){
        if($date == "01 Jan 1970")
        {
            return "-";
        }
        else
        {
            return $date;
        }

    }



?>