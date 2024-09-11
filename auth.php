<?php
    $log_file = __DIR__."/my-errors.log";
    ini_set("log_errors", TRUE); 
    ini_set('error_log', $log_file);

    include('functions.php');
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $_POST=json_decode(file_get_contents("php://input"),1);
    if (!isset($_POST['action']))$_POST['action'] = '';

    // Sign In Function
    if ($_POST['action'] == 'signin'){
        $phone = verifyInput($_POST['phone'],'Phone'); //Get Phone Number From User
        if (strlen($phone) != 11){
            errorMessage('Invalid_Num','Invalid Phone Number, Please Try Again Later');
        }
        // Check If User Exists
        $sql = "SELECT id,active FROM users WHERE phone = ? LIMIT 1";
        $res = getQuery($sql,'s',[$phone]);
        if (count($res)>0){
            if ($res[0]['active'] != 1){
                errorMessage('Not_Active','An issue has occured with your account, please contact support');
            }
            // Create Authentication Token & Code
            $code = bin2hex(random_bytes(16));
            $verify = random_int(100000,999999);
            // Add Login Data To Log
            $sql = "INSERT INTO signin_log (user,code,verify,add_date,phone) VALUES (?,?,?,?,?)";
            $res2 = setQuery($sql,'isiss',[$res[0]['id'],$code,$verify,todaysDate(),$phone]);
            if ($res2 > 0){
                // Send Authentication Code To User
                $results = sendSMS($phone,$verify);
                if ($results['StrRetStatus'] == 'Ok'){
                    echo json_encode(['msg'=>'ok','code'=>$code,'auth'=>$verify]); // For Testing Purposes, Send The Authentication Code So User Can Login Without SMS
                    // echo json_encode(['msg'=>'ok','code'=>$code]); // Use This Line For Production
                    exit;
                } else {
                    errorMessage('Issue_Sending_Text','An issue has occured, Please try signing in again later');
                }
            } else {
                errorMessage('Issue_Reset','Please try again later');
            }
        } else {
            errorMessage('No_Account','No Account Found');
        }
    }

    // Verify User Sign In
    if ($_POST['action'] == 'verifySignIn'){
        $code = verifyInput($_POST['code'],'Code');
        $verify = verifyInput($_POST['verify'],'Verification Code');
        $phone = verifyInput($_POST['phone'],'Phone Number');
        // Get User Login Data
        $sql = "SELECT user,code,verify FROM signin_log WHERE phone = ? ORDER BY id DESC LIMIT 1";
        $res = getQuery($sql,'i',[$phone]);
        if (count($res) > 0){
            // Check if 2FA Code Is Valid
            if ($code == $res[0]['code']){
                // Check Authentication Token
                if ($verify != $res[0]['verify']){
                    errorMessage('Invalid_code','Code is invalid, Check the code and try again');
                }
                // Get All User Data
                $sql = "SELECT `name`,username,user_image FROM users WHERE id = ? LIMIT 1";
                $res2 = getQuery($sql,'i',[$res[0]['user']]);
                if (count($res2) > 0){
                    $token = bin2hex(random_bytes(16));
                    // Add Authenticated User Token
                    $sql = "INSERT INTO tokens (user,token,add_date) VALUES (?,?,?)";
                    $res3 = setQuery($sql,'iss',[$res[0]['user'],$token,todaysDate()]);
                    echo json_encode(['msg'=>'ok','phone'=>$phone,'token'=>$token,'name'=>$res2[0]['name'],'username'=>$res2[0]['username'],'pp'=>$res2[0]['user_image']]);
                    exit;
                } else {
                    errorMessage('Not_Found','An issue has occued with your account, please contact support');
                }
            } else {
                errorMessage('Invalid_Request','Invalid Request, Pleae Try Signing In Again');
            }
        } else {
            errorMessage('No_Request','A Request Has Not Been Found, Please Try Signing In Again');
        }
    }