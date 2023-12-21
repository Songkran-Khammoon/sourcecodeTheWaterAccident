<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$case = $_GET['xCase'];
switch ($case) {
    case 0: // Getdata
        $sql = "SELECT name,email,password FROM admin Where email = :email AND password = :password AND void = 0";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $_POST["email"]);
        $stmt->bindParam(':password', $_POST["password"]);
        $stmt->execute();
        $results = $stmt->fetch(PDO::FETCH_ASSOC);

        if($results) {
            $results['status'] = 1;
            $results['message'] = 'successfully.';
        } else {
            $results['status'] = 0;
            $results['message'] = 'Failed.';
        }
        echo json_encode($results);
        break;
}
