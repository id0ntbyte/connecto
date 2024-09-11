<?php
include('functions.php');


$sql = "SELECT id,page_settings,user_image,name FROM users WHERE username = ? LIMIT 1";
$user = getQuery($sql,'s',[$chosenUser]);
if (count($user) == 0){
    header("Location: /404");
}
$user = $user[0];
$pageSettings = json_decode($user['page_settings'],true);
$sql = "SELECT id,link_title,link_url,link_img FROM links WHERE user = ? AND link_hide = 0 ORDER BY link_order ASC;";
$links = getQuery($sql,'i',[$user['id']]);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ConnecTo | <?=$user['name']?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js" integrity="sha512-pumBsjNRGGqkPzKHndZMaAG+bir374sORyzM3uulLV14lN5LyykqNk8eEeUlUkB3U0M4FApyaHraT65ihJhDpQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> -->
    <!-- <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script> -->
    <!-- <script src="https://unpkg.com/vue@next"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.8/vue.global.min.js"></script>
    <script src="https://unpkg.com/vuex@4"></script>
    <script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
    <style>
        body{
            background-color: <?=$pageSettings['bg']?>;
        }
        .img-thumbnail{
            width:120px;
            height:120px;
            border-radius:50%;
        }
        .span-thumbnail{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            font-size: 3rem;
            padding: 1rem;
            border: 2px solid black;
            background-color: <?=(($pageSettings['userTitleBG'] != '' && $pageSettings['userTitleBG'] != null)? $pageSettings['userTitleBG']:'white')?>;
        }
        .user-urls img{
            width:46px;
            height:46px;
            border-radius:50%;
        }
        .user-urls span{
            font-size:16px;
        }
        .user-urls{
            border-radius:25%;
            cursor:pointer;
            border: 2px solid <?=$pageSettings['linkBorder']?>;
            background-color: <?=$pageSettings['linkBG']?>;
            color: <?=$pageSettings['linkText']?>;
        }
        .user-urls:hover{
            border: 2px solid <?=$pageSettings['linkBorderHover']?>;
            background-color: <?=$pageSettings['linkBGHover']?>;
            color: <?=$pageSettings['linkTextHover']?>;
        }
        .h--46{
            height:46px;
        }
        #user-username{
            color: <?=$pageSettings['userTitleColor']?>
        }
        @media (max-width: 768px){
            .user-urls span{
                font-size:14px;
            }
        }
    </style>
</head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-10 offset-md-1 col-xl-8 offset-xl-2" id="app">
                    <div>
                        <div class="row my-5">
                            <div class="col-12 text-center">
                                <p class="h4" id="user-username">@<?=$chosenUser?></p>
                            </div>
                            <div class="col-12 text-center my-5">
                                <?=(($user['user_image'] == '' || $user['user_image'] == 'null')? '<div class="mx-auto span-thumbnail d-flex align-items-center justify-content-center">@'.strtoupper(substr($user['name'],0,1)).'</div>':'<img class="img-thumbnail" src="'.$user['user_image'].'">')?>
                            </div>
                            <?php foreach($links as $link){ ?>
                            <div class="col-md-12 offset-md-0 col-10 offset-1 user-urls py-2 rounded-5 mb-3" onclick="window.open('<?=$link['link_url']?>','_blank')">
                                <div class="row">
                                    <div class="col-2 col-md-2 col-lg-1 text-center d-flex align-items-center">
                                        <?=(($link['link_img'] == '' || $link['link_img'] == 'null') ? '':'<img src="'.$link['link_img'].'">') //<img src="https://placehold.co/32">?> 
                                    </div>
                                    <div class="h--46 col-10 col-md-10 col-lg-11 text-start d-flex align-items-center justify-content-center pe-5">
                                        <span class="text-center"><?=$link['link_title']?></span>        
                                    </div>
                                </div>
                            </div>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>