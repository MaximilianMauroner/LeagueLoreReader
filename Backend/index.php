<?php
$ajax = new index();
if (isset($_GET['url'])) {
    $ajax->run($_GET['url']);
} else {
    echo json_encode(array(
        "message" => "No action provided.",
        "error" => "#876",
    ));
}

class index
{

    public function __construct()
    {
        session_start();

    }

    public function run($url)
    {


        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }
        $sting = "python3 main.py " . $url;

        $ret = shell_exec($sting);
        echo json_encode(["filePath" => trim($ret)]);
    }
}