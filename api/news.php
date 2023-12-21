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
        $sql = "SELECT * FROM news LEFT JOIN typenews ON news.typeNewsID = typenews.typeNewsID WHERE news.void = 0";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && is_numeric($path[2])) {
            $sql .= " and newsID = :newsID ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':newsID', $path[2]);
            $stmt->execute();
            $response = $stmt->fetch(PDO::FETCH_ASSOC);
        } 
        else {
            $sql .= " OR news.typeNewsID IS NULL and news.void = 0 ORDER BY GREATEST(created_at, updated_at) DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($response);
        break;

    case 1: //Insert data
        $sql = "SELECT MAX(newsID) FROM news";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $maxIdResult = $stmt->fetchColumn();

        if ($maxIdResult !== false) {
            $newID = $maxIdResult + 1;
        }
        $target_dir = "img/";
        // img1
        $target_file1 = $target_dir . uniqid() . basename($_FILES["img1"]["name"]);
        move_uploaded_file($_FILES["img1"]["tmp_name"], $target_file1);
        $sql = "INSERT INTO news(newsID, titleName, typeNewsID, newsimg, description, void, created_at) 
        VALUES($newID, :titleName, :typeNewsID, :img1, :description, 0, DATE_ADD(NOW(), INTERVAL 7 HOUR))";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':titleName', $_POST["titleName"]);
        $stmt->bindParam(':typeNewsID', $_POST["typeNewsID"]);
        $stmt->bindParam(':img1', $target_file1);
        $stmt->bindParam(':description', $_POST["description"]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    case 2: //Update data 
        $target_dir = "img/";
        $sql = "UPDATE news SET titleName = :titleName, typeNewsID = :typeNewsID, description = :description, updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR)";
        // img1
        if ($_FILES["img1"] != null) {
            $sql .= ", newsimg = :img1";
            $target_file1 = $target_dir . uniqid() . basename($_FILES["img1"]["name"]);
            move_uploaded_file($_FILES["img1"]["tmp_name"], $target_file1);
        } else {
        }
        // where id 
        $sql .= " WHERE newsID = :newsID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':newsID', $_POST["newsID"]);
        // if check img
        if ($_FILES["img1"] != null) {
            $stmt->bindParam(':img1', $target_file1);
        } else {
        }
        $stmt->bindParam(':titleName', $_POST["titleName"]);
        $stmt->bindParam(':typeNewsID', $_POST["typeNewsID"]);
        $stmt->bindParam(':description', $_POST["description"]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    case 3: //Delete data 
        $user = json_decode(file_get_contents('php://input'));
        $path = explode('/', $_SERVER['REQUEST_URI']);
        // Delete file 
        $statement = $conn->prepare("SELECT newsimg FROM news WHERE newsID = :newsID");
        $statement->bindParam(':newsID', $path[2]);
        $statement->execute();
        $result = $statement->fetchall(PDO::FETCH_ASSOC);
        foreach ($result as $row) {
            if ($result != '') {
                unlink($row["newsimg"]);
            }
        }
        // Delete database
        $sql = "UPDATE news SET void = '1' Where newsID = :newsID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':newsID', $path[2]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;

    case 4: // GetTypeNews
        $sql = "SELECT * FROM typenews";
                $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && is_numeric($path[2])) {
            $sql .= " Where typeNewsID = :typeNewsID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':typeNewsID', $path[2]);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($result);
        break;
        
    case 5: // Getdata news where typeNews 
        $sql = "SELECT * FROM news JOIN typenews USING(typeNewsID) Where void = 0";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && is_numeric($path[2])) {
            $sql .= " and typeNewsID = :typeNewsID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':typeNewsID', $path[2]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($result);
        break;
        
    case 6: //Insert data
        $sql = "SELECT MAX(typeNewsID) FROM typenews";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $maxIdResult = $stmt->fetchColumn();

        if ($maxIdResult !== false) {
            $typenewID = $maxIdResult + 1;
        }
        $sql = "INSERT INTO typenews(typeNewsID, typeNewsName) VALUES('$typenewID', :typeNewsName)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':typeNewsName', $_POST["typeNewsName"]);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }

        echo json_encode($response);
        break;
        
    case 7: //Delete data 
        $user = json_decode(file_get_contents('php://input'));
        $path = explode('/', $_SERVER['REQUEST_URI']);
        // Delete database
        $sql = "DELETE FROM typenews Where typeNewsID = :typeNewsID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':typeNewsID', $path[2]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        $sql2 = "UPDATE news SET typeNewsID = NULL WHERE typeNewsID = :typeNewsID";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bindParam(':typeNewsID', $path[2]);
        $stmt2->execute();
        echo json_encode($response);
        break;
    
    case 8: //update data
    $path = explode('/', $_SERVER['REQUEST_URI']);
        $sql = "UPDATE `typenews` SET `typeNewsName`= :typeNewsName WHERE `typeNewsID`= :typeNewsID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':typeNewsID', $path[2]);
        $stmt->bindParam(':typeNewsName', $_POST["typeNewsName"]);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => $stmt];
        }

        echo json_encode($response);
        break;
}
