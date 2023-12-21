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
        $sql = "SELECT * FROM location JOIN typerisk USING(typeriskID) Where void = 0 ";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[4]) && is_numeric($path[4])) {
            $sql .= " and id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[4]);
            $stmt->execute();
            $response = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $sql .= " ORDER by created_at and updated_at DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($response);
        break;

    case 1: //Insert data
        $sql = "SELECT MAX(id) FROM location";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $maxIdResult = $stmt->fetchColumn();

        if ($maxIdResult !== false) {
            $locationID = $maxIdResult + 1;
        }
        $sql2 = "SELECT MAX(equipPlaceID) FROM location";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute();
        $maxIdResult2 = $stmt2->fetchColumn();

        if ($maxIdResult2 !== false) {
            $equipPlaceID = $maxIdResult2 + 1;
        }
        $sql3 = "SELECT MAX(howtoUseID) FROM location";
        $stmt3 = $conn->prepare($sql3);
        $stmt3->execute();
        $maxIdResult3 = $stmt3->fetchColumn();

        if ($maxIdResult3 !== false) {
            $howtoUseID = $maxIdResult3 + 1;
        }
        $target_dir = "img/";
        // img1
        $target_file1 = $target_dir . uniqid() . basename($_FILES["img1"]["name"]);
        move_uploaded_file($_FILES["img1"]["tmp_name"], $target_file1);
        // // img2
        // $target_file2 = $target_dir . uniqid() . basename($_FILES["img2"]["name"]);
        // move_uploaded_file($_FILES["img2"]["tmp_name"], $target_file2);
        // img3
        // $target_file3 = $target_dir . uniqid() . basename($_FILES["img3"]["name"]);
        // move_uploaded_file($_FILES["img3"]["tmp_name"], $target_file3);
        $sql = "INSERT INTO location(id,img, namelocation, locationLat, locationLng, typeriskID, equipPlaceID, equipLat, equipLng, practiceArea, preventArea, howtoUseID, void, created_at) VALUES('$locationID',:img1, :namelocation, :locationLat, :locationLng, :typeriskID, :equipPlaceID, :equipLat, :equipLng, :practiceArea, :preventArea, :howtoUseID, 0, DATE_ADD(NOW(), INTERVAL 7 HOUR))";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':img1', $target_file1);
        $stmt->bindParam(':namelocation', $_POST["namelocation"]);
        $stmt->bindParam(':locationLat', $_POST["locationLat"]);
        $stmt->bindParam(':locationLng', $_POST["locationLng"]);
        $stmt->bindParam(':typeriskID', $_POST["typeriskID"]);
        $stmt->bindParam(':equipPlaceID', $equipPlaceID);
        $stmt->bindParam(':equipLat', $_POST["equipLat"]);
        $stmt->bindParam(':equipLng', $_POST["equipLng"]);
        $stmt->bindParam(':practiceArea', $_POST["practiceArea"]);
        $stmt->bindParam(':preventArea', $_POST["preventArea"]);
        $stmt->bindParam(':howtoUseID', $howtoUseID);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }

        // img2
        if (!empty($_FILES['img2']['name'])) {
            $uploadedImages = $_FILES['img2'];
            $imageResponses = array();

            $sqlimg = "SELECT MAX(id) FROM location_equipplace";
            $stmtimg = $conn->prepare($sqlimg);
            $stmtimg->execute();
            $maxIdResultimg = $stmtimg->fetchColumn();

            if ($maxIdResultimg !== false) {
                $id = $maxIdResultimg + 1;
            }
            // Loop through each uploaded image
            for ($i = 0; $i < count($uploadedImages['name']); $i++) {
                $target_file = $target_dir . uniqid() . basename($uploadedImages['name'][$i]);
                if (move_uploaded_file($uploadedImages['tmp_name'][$i], $target_file)) {
                    $sql = "INSERT INTO location_equipplace(id,equipPlaceID, equipPlaceName) VALUES('$id', :equipPlaceID, :equipPlaceName)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':equipPlaceID', $equipPlaceID);
                    $stmt->bindParam(':equipPlaceName', $target_file);
                    if ($stmt->execute()) {
                        $imageResponses[] = ['status' => 1, 'message' => 'Image uploaded successfully.'];
                    } else {
                        $imageResponses[] = ['status' => 0, 'message' => 'Failed to upload image.'];
                    }
                } else {
                    $imageResponses[] = ['status' => 0, 'message' => 'Failed to move image to the destination folder.'];
                }
            }
        }
        // img3
        if (!empty($_FILES['img3']['name'])) {
            $uploadedImages = $_FILES['img3'];
            $imageResponses = array();

            $sqlimg = "SELECT MAX(id) FROM location_howtouse";
            $stmtimg = $conn->prepare($sqlimg);
            $stmtimg->execute();
            $maxIdResultimg = $stmtimg->fetchColumn();

            if ($maxIdResultimg !== false) {
                $id = $maxIdResultimg + 1;
            }
            // Loop through each uploaded image
            for ($i = 0; $i < count($uploadedImages['name']); $i++) {
                $target_file = $target_dir . uniqid() . basename($uploadedImages['name'][$i]);
                if (move_uploaded_file($uploadedImages['tmp_name'][$i], $target_file)) {
                    $sql = "INSERT INTO location_howtouse(id,howtoUseID, howtoUseName) VALUES('$id', :howtoUseID, :howtoUseName)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':howtoUseID', $howtoUseID);
                    $stmt->bindParam(':howtoUseName', $target_file);
                    if ($stmt->execute()) {
                        $imageResponses[] = ['status' => 1, 'message' => 'Image uploaded successfully.'];
                    } else {
                        $imageResponses[] = ['status' => 0, 'message' => 'Failed to upload image.'];
                    }
                } else {
                    $imageResponses[] = ['status' => 0, 'message' => 'Failed to move image to the destination folder.'];
                }
            }
        }
        echo json_encode($response);
        break;

    case 2: //Update data 
        $user = json_decode(file_get_contents('php://input'));
        $path = explode('/', $_SERVER['REQUEST_URI']);
        // Delete file img
        $statement = $conn->prepare("SELECT img FROM location WHERE id = :id");
        $statement->bindParam(':id', $_POST["id"]);
        $statement->execute();
        $result = $statement->fetchall(PDO::FETCH_ASSOC);
        // Delete file img2
        $statement2 = $conn->prepare("SELECT equipPlaceName FROM location_equipplace WHERE equipPlaceID = :equipPlaceID");
        $statement2->bindParam(':equipPlaceID', $_POST["equipPlaceID"]);
        $statement2->execute();
        $result2 = $statement2->fetchall(PDO::FETCH_ASSOC);
        // Delete file img3
        $statement3 = $conn->prepare("SELECT howtoUseName FROM location_howtouse WHERE howtoUseID = :howtoUseID");
        $statement3->bindParam(':howtoUseID', $_POST["howtoUseID"]);
        $statement3->execute();
        $result3 = $statement3->fetchall(PDO::FETCH_ASSOC);

        $target_dir = "img/";
        $sql = "UPDATE location SET namelocation = :namelocation, locationLat = :locationLat, locationLng = :locationLng, typeriskID = :typeriskID, equipLat = :equipLat, equipLng = :equipLng, practiceArea = :practiceArea, preventArea = :preventArea, updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR)";
        // img1

        // img1
        if ($_FILES["img1"] != null) {
            foreach ($result as $row) {
                if ($result != '') {
                    unlink($row["img"]);
                }
            }
            $sql .= ", img = :img1";
            $target_file1 = $target_dir . uniqid() . basename($_FILES["img1"]["name"]);
            move_uploaded_file($_FILES["img1"]["tmp_name"], $target_file1);
        }

        // img2
        if ($_FILES["img2"] != null) {
            // ลบรูปภาพเก่า
            foreach ($result2 as $row) {
                if ($result2 != '') {
                    unlink($row["equipPlaceName"]);
                }
            }
            $sql .= ", equipPlaceID = :equipPlaceID";
            // Delete database
            $delete = "DELETE FROM `location_equipplace` WHERE equipPlaceID = :equipPlaceID";
            $deletecomp = $conn->prepare($delete);
            $deletecomp->bindParam(':equipPlaceID', $_POST["equipPlaceID"]);
            $deletecomp->execute();
            // $target_file2 = $target_dir . uniqid() . basename($_FILES["img2"]["name"]);
            // move_uploaded_file($_FILES["img2"]["tmp_name"], $target_file2);
            // img2
            if (!empty($_FILES['img2']['name'])) {
                $uploadedImages = $_FILES['img2'];
                $imageResponses = array();

                $sqlimg = "SELECT MAX(id) FROM location_equipplace";
                $stmtimg = $conn->prepare($sqlimg);
                $stmtimg->execute();
                $maxIdResultimg = $stmtimg->fetchColumn();

                if ($maxIdResultimg !== false) {
                    $id = $maxIdResultimg + 1;
                }
                // Loop through each uploaded image
                for ($i = 0; $i < count($uploadedImages['name']); $i++) {
                    $target_file2 = $target_dir . uniqid() . basename($uploadedImages['name'][$i]);
                    if (move_uploaded_file($uploadedImages['tmp_name'][$i], $target_file2)) {
                        $sql2 = "INSERT INTO location_equipplace(id,equipPlaceID, equipPlaceName) VALUES('$id', :equipPlaceID, :equipPlaceName)";
                        $stmt2 = $conn->prepare($sql2);
                        $stmt2->bindParam(':equipPlaceID', $_POST["equipPlaceID"]);
                        $stmt2->bindParam(':equipPlaceName', $target_file2);
                        if ($stmt2->execute()) {
                            $imageResponses[] = ['status' => 1, 'message' => 'Image uploaded successfully.'];
                        } else {
                            $imageResponses[] = ['status' => 0, 'message' => 'Failed to upload image.'];
                        }
                    } else {
                        $imageResponses[] = ['status' => 0, 'message' => 'Failed to move image to the destination folder.'];
                    }
                    $id += 1;
                }
            }
        }

        // img3
        if ($_FILES["img3"] != null) {
            // ลบรูปภาพเก่า
            foreach ($result3 as $row) {
                if ($result3 != '') {
                    unlink($row["howtoUseName"]);
                }
            }
            $sql .= ", howtoUseID = :howtoUseID";

            // Delete database
            $delete = "DELETE FROM `location_howtouse` WHERE howtoUseID = :howtoUseID";
            $deletecomp = $conn->prepare($delete);
            $deletecomp->bindParam(':howtoUseID', $_POST["howtoUseID"]);
            $deletecomp->execute();

            // $target_file3 = $target_dir . uniqid() . basename($_FILES["img3"]["name"]);
            // move_uploaded_file($_FILES["img3"]["tmp_name"], $target_file3);
            // img3
            if (!empty($_FILES['img3']['name'])) {
                $uploadedImages = $_FILES['img3'];
                $imageResponses = array();

                $sqlimg = "SELECT MAX(id) FROM location_howtouse";
                $stmtimg = $conn->prepare($sqlimg);
                $stmtimg->execute();
                $maxIdResultimg = $stmtimg->fetchColumn();

                if ($maxIdResultimg !== false) {
                    $id = $maxIdResultimg + 1;
                }
                // Loop through each uploaded image
                for ($i = 0; $i < count($uploadedImages['name']); $i++) {
                    $target_file3 = $target_dir . uniqid() . basename($uploadedImages['name'][$i]);
                    if (move_uploaded_file($uploadedImages['tmp_name'][$i], $target_file3)) {
                        $sql2 = "INSERT INTO location_howtouse(id,howtoUseID, howtoUseName) VALUES('$id', :howtoUseID, :howtoUseName)";
                        $stmt2 = $conn->prepare($sql2);
                        $stmt2->bindParam(':howtoUseID', $_POST["howtoUseID"]);
                        $stmt2->bindParam(':howtoUseName', $target_file3);
                        if ($stmt2->execute()) {
                            $imageResponses[] = ['status' => 1, 'message' => 'Image uploaded successfully.'];
                        } else {
                            $imageResponses[] = ['status' => 0, 'message' => 'Failed to upload image.'];
                        }
                    } else {
                        $imageResponses[] = ['status' => 0, 'message' => 'Failed to move image to the destination folder.'];
                    }
                    $id += 1;
                }
            }
        }

        // where id 
        $sql .= " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $_POST["id"]);
        // if check img
        if ($_FILES["img1"] != null) {
            $stmt->bindParam(':img1', $target_file1);
        }
        $stmt->bindParam(':namelocation', $_POST["namelocation"]);
        $stmt->bindParam(':locationLat', $_POST["locationLat"]);
        $stmt->bindParam(':locationLng', $_POST["locationLng"]);
        $stmt->bindParam(':typeriskID', $_POST["typeriskID"]);
        if ($_FILES["img2"] != null) {
            $stmt->bindParam(':equipPlaceID', $_POST["equipPlaceID"]);
        }
        $stmt->bindParam(':equipLat', $_POST["equipLat"]);
        $stmt->bindParam(':equipLng', $_POST["equipLng"]);
        $stmt->bindParam(':practiceArea', $_POST["practiceArea"]);
        $stmt->bindParam(':preventArea', $_POST["preventArea"]);
        if ($_FILES["img3"] != null) {
            $stmt->bindParam(':howtoUseID', $_POST["howtoUseID"]);
        }
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;


    case 3: //Delete data 
        // Delete file img
        $statement = $conn->prepare("SELECT img FROM location WHERE id = :id");
        $statement->bindParam(':id', $_POST["id"]);
        $statement->execute();
        $result = $statement->fetchall(PDO::FETCH_ASSOC);
        // Delete file img2
        $statement2 = $conn->prepare("SELECT equipPlaceName FROM location_equipplace WHERE equipPlaceID = :equipPlaceID");
        $statement2->bindParam(':equipPlaceID', $_POST["equipPlaceID"]);
        $statement2->execute();
        $result2 = $statement2->fetchall(PDO::FETCH_ASSOC);
        // Delete file img3
        $statement3 = $conn->prepare("SELECT howtoUseName FROM location_howtouse WHERE howtoUseID = :howtoUseID");
        $statement3->bindParam(':howtoUseID', $_POST["howtoUseID"]);
        $statement3->execute();
        $result3 = $statement3->fetchall(PDO::FETCH_ASSOC);

        // img1
        if ($_FILES["img1"] != null) {
            foreach ($result as $row) {
                if ($result != '') {
                    unlink($row["img"]);
                }
            }
        }
        // img2
        if ($_FILES["img2"] != null) {
            // ลบรูปภาพเก่า
            foreach ($result2 as $row) {
                if ($result2 != '') {
                    unlink($row["equipPlaceName"]);
                }
            }
        }
        // img3
        if ($_FILES["img3"] != null) {
            // ลบรูปภาพเก่า
            foreach ($result3 as $row) {
                if ($result3 != '') {
                    unlink($row["howtoUseName"]);
                }
            }
        }
        // Delete database
        $sql = "UPDATE location SET void = '1' Where id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $_POST["id"]);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => $stmt];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
    case 4: // GetRisk
        $sql = "SELECT * FROM typerisk";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $location = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($location);
        break;
    case 5: // Getdata
        $sql = "SELECT * FROM location JOIN typerisk USING(typeriskID) Where typeriskID = :typeriskID and void = 0";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':typeriskID', $path[4]);
        $stmt->execute();
        $location = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($location);
        break;
    case 6: // GetequipPlaceID
        $sql = "SELECT * FROM `location_equipplace` JOIN location USING(equipPlaceID) WHERE equipPlaceID = :equipPlaceID";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':equipPlaceID', $path[4]);
        $stmt->execute();
        $location = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($location);
        break;
    case 7: // GetequipPlaceID
        $sql = "SELECT * FROM `location_howtouse` JOIN location USING(howtoUseID) WHERE howtoUseID = :howtoUseID";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':howtoUseID', $path[4]);
        $stmt->execute();
        $location = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($location);
        break;
}
