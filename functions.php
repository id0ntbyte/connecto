<?php


    if (!function_exists('errorMessage')){
        function errorMessage($code,$message){
            echo json_encode(['code'=>$code,'err'=>$message]);
            exit;
        }
    }

    // Get Query Helper Function 
	if (!function_exists('getQuery')) {
		function getQuery($sql,$sanatizer='',$inputs=[],$prepared=true) {
			include('config.php'); //Add Configuration file with host name username password and database name
                if ($sanatizer == '')$prepared = false;
                mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
                $resultSet = [];
                try{
                    $mysqli = new mysqli($host1515, $username1515, $password1515, $db_name1515);
                    $mysqli -> set_charset("utf8mb4");
                    //For Prepared Statements
                    if ($prepared){
                        $stmt = $mysqli->prepare($sql);
                        $stmt->bind_param($sanatizer, ...$inputs);
                        $stmt->execute();
                        $result = $stmt->get_result();
                    } else {
                        $result = $mysqli->query($sql);
                    }
                    while ($row = $result->fetch_assoc()) {
                        $resultSet[] = $row;
                    }
                } catch (mysqli_sql_exception $e){
                    errorMessage('SQL_Error_Occured','An issue has occured while processing your request please try again later');
                }
                $mysqli->close();
                return $resultSet;
		}
	}

	if (!function_exists('setQuery')) {
        // Helper Function For Updating Queries In DB
		function setQuery($sql,$sanatizer='',$inputs=[],$sendLastID=false,$prepared=true) {
            include('config.php'); //Add Configuration file with host name username password and database name
                if ($sanatizer == '')$prepared = false;
                mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
                try{
                    $mysqli = new mysqli($host1515, $username1515, $password1515, $db_name1515);
                    $mysqli -> set_charset("utf8mb4");
                    // User for prepared statements
                    if ($prepared){
                        $stmt = $mysqli->prepare($sql);
                        $stmt->bind_param($sanatizer,...$inputs);
                        $result = $stmt->execute();
                    } else {
                        $mysqli->query($sql);
                    }
                    $affected = $mysqli->affected_rows;
                    $lastID = '';
                    if ($sendLastID){
                        $lastID = $mysqli->insert_id;
                    }
                } catch (mysqli_sql_exception $e){
                    errorMessage('SQL_Error_Occured','An issue has occured while processing your request please try again later');
                }
                $mysqli->close();
                if ($sendLastID){
                    return [$affected,$lastID];
                }
                return $affected;
        }
    }

    if (!function_exists('verifyInput')){
        // Function To Verifying API Inputs
        function verifyInput($input,$name,$type=''){
            $input = stripslashes(trim($input));
            if (empty($input)){
                errorMessage($name.' Cannot Be Empty');
            }
            if ($type != ''){
                switch($type){
                    case 'i':
                        if (preg_match('/\D/', $input)){
                            $input = '';
                        }
                        break;
                    case 'e':
                        if (!filter_var($input,FILTER_VALIDATE_EMAIL)){$input = '';}
                        break;
                    case 'p':
                        $uppercase = preg_match('@[A-Z]@', $input);
                        $lowercase = preg_match('@[a-z]@', $input);
                        $number    = preg_match('@[0-9]@', $input);
                        if(!$uppercase || !$lowercase || !$number || strlen($input) < 8) { //!$specialChars ||
                            errorMessage('Invalid_Password','Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.');
                        }
                        break;
                    case 'ph':
                        $input = preg_replace('/\D/','',$input);
                        if (strlen($input) != 10){
                            $input = '';
                        }
                        break;
                    case 'tf':
                        if ($input != 'true' && $input != 'false'){
                            $input = '';
                        }
                        break;
                    case 'hex':
                        $tmp = ltrim($input, '#');
                        if (preg_match('/^(?:[0-9a-fA-F]{3}){1,2}$/', $tmp) !== 1){
                            $input = '';
                        }
                        break;
                }
                if (empty($input)){
                    errorMessage($name.' Is Not The Correct Format');
                }
            }
            return $input;
        }
    }

    // Helper Function For Getting Universal Date / Prevent Time Mismatch
    if (!function_exists('todaysDate')){
        function todaysDate($noTime=false){
            if ($noTime){
                return date("Y-m-d");
            }
            return date("Y-m-d H:i:s");
        }
    }
    
    if (!function_exists('getRandomString')){
        function getRandomString(){
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $randomString = '';
            for ($i = 0; $i < 20; $i++) {
                $index = rand(0, strlen($characters) - 1);
                $randomString .= $characters[$index];
            }
            return $randomString;
        }
    }

    // SMS Helper Function
    if (!function_exists('sendSMS')){
        function sendSMS($phone,$message){
            //Currently Disabled For Testing
            include('config.php');
            return ['StrRetStatus'=>'Ok'];
            
            $url = $SMSUrl;

            $data = [
                'username' => $SMSUsername,
                'password' => $SMSPassword,
                'text' => $message,
                'to' => $phone,
                'bodyId' => '170709'
            ];
            $jsonData = json_encode($data);

            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonData);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($jsonData)
            ));
            $response = curl_exec($curl);

            $error = '';
            if ($response === false) {
                $error = curl_error($curl);
            }

            curl_close($curl);

            return ['response'=>$response,'error'=>$error];

        }
    }

?>