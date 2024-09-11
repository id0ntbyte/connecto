<?php

$log_file = __DIR__."/my-errors.log";
ini_set("log_errors", TRUE); 
ini_set('error_log', $log_file);

include('functions.php');
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

// Parse Parameters Correctly From The Frontend
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (isset($_POST['action']) && $_POST['action'] != 'updateProfilePic'){
        $_POST=json_decode(file_get_contents("php://input"),1);
        if (!isset($_POST['action']))$_POST['action'] = '';
    } else if (!isset($_POST['action'])){
        $_POST=json_decode(file_get_contents("php://input"),1);
        if (!isset($_POST['action']))$_POST['action'] = '';
    }
} else {
    $_POST=json_decode(file_get_contents("php://input"),1);
    if (!isset($_POST['action']))$_POST['action'] = '';
}

// Check Authenticated User Token
if (!isset($_POST['token']) || $_POST['token'] == ''){
    errorMessage('logged_out','Please Login');
}

$userInformation = [];
// Get User Data & Check If User Is Active
$sql = "SELECT user,expired FROM tokens WHERE token = ? ORDER BY id DESC LIMIT 1";
$res = getQuery($sql,'s',[$_POST['token']]);
if (count($res) > 0){
    if ($res[0]['expired'] == 1){
        errorMessage('logged_out','Please Login');
    }
    $sql = "SELECT * FROM users WHERE id = ? AND active = 1 LIMIT 1";
    $res2 = getQuery($sql,'i',[$res[0]['user']]);
    if (count($res2)>0){
        $userInformation = $res2[0];
    } else {
        errorMessage('Not_Active','An issue has occured with your account, Please contact support');
    }
} else {
    errorMessage('logged_out','Please Login');
}

// Update User Preferences
if ($_POST['action'] == 'updateUserPageSettings'){
    $bgColor = verifyInput($_POST['bgColor'],'Background Color','hex');
    $linkBG = verifyInput($_POST['linkBG'],'Link Background','hex');
    $linkText = verifyInput($_POST['linkText'],'Text Color','hex');
    $linkBorder = verifyInput($_POST['linkBorder'],'Border Color','hex');
    $headerColor = verifyInput($_POST['headerColor'],'Header Color','hex');
    $hoverBG = verifyInput($_POST['hoverBG'],'Background Color On Hover','hex');
    $hoverText = verifyInput($_POST['hoverText'],'Text Color On Hover','hex');
    $hoverBorder = verifyInput($_POST['hoverBorder'],'Background Color On Hover','hex');
    $headerBG = verifyInput($_POST['headerBG'],'Header Background','hex');
    $data = ["linkBorder"=>$linkBorder,"linkBG"=>$linkBG,"linkText"=>$linkText,"linkBorderHover"=>$hoverBorder,"linkBGHover"=>$hoverBG,"linkTextHover"=>$hoverText,"bg"=>$bgColor,"userTitleColor"=>$headerColor,"userTitleBG"=>$headerBG];
    $sql = "UPDATE users SET page_settings = ? WHERE id = ? LIMIT 1";
    $res = setQuery($sql,'si',[json_encode($data),$userInformation['id']]);
    if ($res > 0){
        echo json_encode(['msg'=>'ok']);
        exit;
    } else {
        errorMessage('Not_Updated','Page Not Updated, Please Try Again Later');
    }
}

// Fetch All User Links
if ($_POST['action'] == 'getLinkInformation'){
    $sql = "SELECT page_settings FROM users WHERE id = ? LIMIT 1";
    $user = $userInformation['id'];
    $res = getQuery($sql,'i',[$user]);
    if (count($res)>0){
        $sql = "SELECT id,link_title,link_url FROM links WHERE user = ? ORDER BY link_order ASC";
        $res2 = getQuery($sql,'i',[$user]);
        echo json_encode(['msg'=>'ok','links'=>$res2,'data'=>$res[0]]);
        exit;
    } else {
        errorMessage('No_Account','An issue has occured, please contact support');
    }
}

// Remove Link From User Page
if ($_POST['action'] == 'removeTheLink'){
    $id = verifyInput($_POST['id'],'Link','i');
    $sql = "SELECT id FROM links WHERE id = ? AND user = ? LIMIT 1";
    $res = getQuery($sql,'ii',[$id,$userInformation['id']]);
    if (count($res)>0){
        $sql = "DELETE FROM links WHERE id = ? LIMIT 1";
        $res2 = setQuery($sql,'i',[$id]);
        if ($res2 > 0){
            echo json_encode(['msg'=>'ok']);
            exit;
        } else {
            errorMessage('Not_Removed','Link Not Removed, Try Again Later');
        }
    } else {
        errorMessage('Not_Found','Link Not Found');
    }
}

// Add New Link To User Page
if ($_POST['action'] == 'addNewLink'){
    $title = verifyInput($_POST['title'],'Title');
    $url = verifyInput($_POST['url'],'Link');
        $sql = "INSERT INTO links (user,link_title,link_url) VALUES (?,?,?)";
        $res = setQuery($sql,'iss',[$userInformation['id'],$title,$url],true);
        if ($res[0] > 0){
            echo json_encode(['msg'=>'ok','id'=>$res[1]]);
            exit;
        } else {
            errorMessage('Not_Added','Link Not Added');
        }
}

// Update User's Profile Picture
if ($_POST['action'] == 'updateProfilePic'){
    if (!isset($_FILES['file'])) { errorMessage('No_File','Image Not Uploaded'); }
    $file = $_FILES['file'];
    $uploadDir = 'assets/uploads/';
    $path_parts = pathinfo($_FILES["file"]["name"]);
    $extension = $path_parts['extension'];
    $name = date('Y-m-d_H-i-s').'_'.uniqid() . '_profile_pic.'. $extension;
    $uploadPath = $uploadDir . $name;
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $sql = "UPDATE users SET user_image= ? WHERE id = ? LIMIT 1";
        $res = setQuery($sql,'si',[$uploadPath,$userInformation['id']]);
        if ($res > 0){
            echo json_encode(['msg'=>'ok','img'=>$uploadPath]);
            exit;
        } else {
            errorMessage('Not_Updated','Profile Picture Not Updated');
        }
    } else {
        errorMessage('Upload_Failed','Upload Has Failed');
    }
}

// Update User Password
if ($_POST['action'] == 'updateUserPassword'){
    $old = verifyInput($_POST['old'],'Old Password');
    $pass = verifyInput($_POST['pass'],'New Password');
    $sql = "SELECT pass FROM users WHERE id = ? AND active = 1 LIMIT 1";
    $res = getQuery($sql,'i',[$userInformation['id']]);
    if (count($res)>0){
        // Authenticate Previous User Password
        if (!password_verify($old,$res[0]['pass'])){
            errorMessage('Bad_Pass','Old password was incorrect, please check and try again');
        }
        $sql = "UPDATE users SET pass = ? WHERE id = ? LIMIT 1";
        $res2 = setQuery($sql,'si',[password_hash($pass,PASSWORD_DEFAULT),$userInformation['id']]);
        if ($res2 > 0){
            echo json_encode(['msg'=>'ok']);
            exit;
        } else {
            errorMessage('Not_Updated','An issue has occured ,please try again later');
        }
    } else {
        errorMessage('Invalid_Request','Invalid Request');
    }
}

//Update User Email Address
if ($_POST['action'] == 'updateUserEmailAddress'){
    $email = verifyInput($_POST['email'],'Email');
    $sql = "UPDATE users SET email = ? WHERE id = ? LIMIT 1";
    $res = setQuery($sql,'si',[$email,$userInformation['id']]);
    if ($res > 0){
        echo json_encode(['msg'=>'ok']);
        exit;
    } else {
        errorMessage('Not_Updated','An issue has occured, Please try updating your email again later');
    }

}

// Update User Page Link Information
if ($_POST['action'] == 'updateLinkInformation'){
    $id = verifyInput($_POST['id'],'Link','i');
    $link = verifyInput($_POST['link'],'URL');
    $title = verifyInput($_POST['title'],'Title');
    $sql = "SELECT id FROM links WHERE id = ? AND user = ? LIMIT 1";
    $res = getQuery($sql,'ii',[$id,$userInformation['id']]);
    if (count($res)>0){
        $sql = "UPDATE links SET link_title = ?, link_url = ? WHERE id = ? LIMIT 1";
        $res2 = setQuery($sql,'ssi',[$title,$link,$id]);
        if ($res2 > 0){
            echo json_encode(['msg'=>'ok']);
            exit;
        } else {
            errorMessage('Not_Updated','Link Not Updated, Please Try Again Later');
        }
    } else {
        errorMessage('Not_Found','Link Not Found');
    }
}

// Update The Order In Which The Links Are Shown
if ($_POST['action'] == 'updateItemOrder'){
    $order = $_POST['order'];
    if (count($order) == 0){
        errorMessage('No_Links','No Links Sent');
    }
    foreach($order as $link){
        $sql = "UPDATE links SET link_order = ? WHERE id = ? AND user = ? LIMIT 1";
        $res = setQuery($sql,'iii',[$link[1],$link[0],$userInformation['id']]);
    }
    echo json_encode(['msg'=>'ok']);
    exit;

}

errorMessage('Invalid_Request','Invalid Request');