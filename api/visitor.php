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
        $sql = "SELECT *,SUBSTRING(visittime,6,2) as month FROM visitor";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchall(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;
    case 1: // update
        $sql = "INSERT INTO `visitor` (`visittime`) VALUES (DATE_ADD(NOW(), INTERVAL 7 HOUR))";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
    case 2: // Getdata In month
        $sql = "SELECT COUNT(visittime) AS count FROM visitor WHERE MONTH(visittime) = MONTH(NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;
    case 3: // update
        $sql = "SELECT SUBSTRING(visittime, 6, 2) AS month, COUNT(*) AS visit_count FROM visitor GROUP BY month ORDER BY month;";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchall(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;
    case 4: // update
        $sql = "SELECT YEAR(visittime) AS year, COUNT(*) AS visit_count FROM visitor GROUP BY year HAVING year = YEAR(NOW()) ";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result);
        break;
}
