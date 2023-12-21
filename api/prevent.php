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
        $sql = "SELECT * FROM prevent ";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && is_numeric($path[2])) {
            $sql .= " and id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[2]);
            $stmt->execute();
            $response = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $sql .= " ORDER by created_at DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($response);
        break;

    case 1: //Insert data
        $target_dir = "img/";
        // img1
        if (!empty($_FILES['img1']['name'])) {
            $uploadedImages = $_FILES['img1'];
            $imageResponses = array();

            $sqlimg = "SELECT MAX(id) FROM prevent";
            $stmtimg = $conn->prepare($sqlimg);
            $stmtimg->execute();
            $maxIdResult = $stmtimg->fetchColumn();

            if ($maxIdResult !== false) {
                $preventID = $maxIdResult + 1;
            }
            
            // Loop through each uploaded image
            for ($i = 0; $i < count($uploadedImages['name']); $i++) {
                $target_file = $target_dir . uniqid() . basename($uploadedImages['name'][$i]);
                if (move_uploaded_file($uploadedImages['tmp_name'][$i], $target_file)) {
                    $sql2 = "INSERT INTO prevent(id, prevent_img, created_at) VALUES('$preventID', :img1, DATE_ADD(NOW(), INTERVAL 7 HOUR))";
                    $stmt2 = $conn->prepare($sql2);
                    $stmt2->bindParam(':img1', $target_file);
                    if ($stmt2->execute()) {
                        $imageResponses[] = ['status' => 1, 'message' => 'Image uploaded successfully.'];
                    } else {
                        $imageResponses[] = ['status' => 0, 'message' => 'Failed to upload image.'];
                    }
                } else {
                    $imageResponses[] = ['status' => 0, 'message' => 'Failed to move image to the destination folder.'];
                }
                $preventID += 1;
            }
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
        // Delete file 
        $statement = $conn->prepare("SELECT prevent_img FROM prevent WHERE id = :id");
        $statement->bindParam(':id', $path[4]);
        $statement->execute();
        $result = $statement->fetchall(PDO::FETCH_ASSOC);
        foreach ($result as $row) {
            if ($result != '') {
                unlink($row["prevent_img"]);
            }
        }
        // Delete database
        $sql = "DELETE FROM prevent Where id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[4]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;

}
