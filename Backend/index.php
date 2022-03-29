<?php
$ajax = new index();
if (isset($_GET['url'])) {
    $ajax->run("get_file");
} else {
    $ajax->run("get_all_files");
}

class index
{

    public function __construct()
    {
        session_start();

    }

    public function run($action)
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
        $this->$action();
    }

    public function get_file()
    {
        $url = $_GET['url'];
        $sting = "python3 main.py " . $url;

        $ret = shell_exec($sting);
        echo json_encode(["filePath" => trim($ret)]);
    }

    public function get_all_files()
    {
        $ignored = array('.', '..', '.svn', '.htaccess');
        $dir = "../LoreFiles/";

        $files = array();
        foreach (scandir($dir) as $file) {
            if (in_array($file, $ignored)) continue;
            $files[$file] = filemtime($dir . '/' . $file);
        }

        arsort($files);
        $files = array_keys($files);

        $retArr = [];
        foreach ($files as $file) {
            $retArr["filePaths"][] = $file;
        }
        echo json_encode($retArr);
    }
}