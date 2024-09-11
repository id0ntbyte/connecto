<?php

require_once __DIR__.'/router.php';

get('/','views/adminPage.php');
get('/admin','views/adminPage.php');
post('/auth','auth.php');
post('/api','helper.php');
get('/$chosenUser','views/userpage.php');
any('/404','views/404.php');
