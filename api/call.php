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
        $sql = "SELECT * FROM calls JOIN typerisk USING(typeriskID) ORDER by typeriskID DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($response);
        break;

    case 1: //Insert data
    $sql = "SELECT MAX(callID) FROM calls";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $maxIdResult = $stmt->fetchColumn();

        if ($maxIdResult !== false) {
            $callID = $maxIdResult + 1;
        }
        $sql = "INSERT INTO calls(callID, callPhone, callName, typeriskID) VALUES('$callID', :callPhone, :callName, :typeriskID)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':callPhone', $_POST["callPhone"]);
        $stmt->bindParam(':callName', $_POST["callName"]);
        $stmt->bindParam(':typeriskID', $_POST["typeriskID"]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    // case 2: //Update data 
    //     $target_dir = "img/";
    //     $sql = "UPDATE prevent SET";
    //     // img1
    //     if ($_FILES["img1"] != null) {
    //         $sql .= " prevent_img = :img1";
    //         $target_file1 = $target_dir . uniqid() . basename($_FILES["img1"]["name"]);
    //         move_uploaded_file($_FILES["img1"]["tmp_name"], $target_file1);
    //     } else {
    //     }
    //     // where id 
    //     $sql .= " WHERE id = :id";
    //     $stmt = $conn->prepare($sql);
    //     $stmt->bindParam(':id', $_POST["id"]);
    //     // if check img
    //     if ($_FILES["img1"] != null) {
    //         $stmt->bindParam(':img1', $target_file1);
    //     } else {
    //     }

    //     if ($stmt->execute()) {
    //         $response = ['status' => 1, 'message' => 'Record created successfully.'];
    //     } else {
    //         $response = ['status' => 0, 'message' => 'Failed to create record.'];
    //     }
    //     echo json_encode($response);
    //     break;

    case 3: //Delete data 
        $user = json_decode(file_get_contents('php://input'));
        $path = explode('/', $_SERVER['REQUEST_URI']);
        // Delete database
        $sql = "DELETE FROM calls Where callID = :callID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':callID', $path[2]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;

}
