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
    case 0: // insert IMAGE TO SERVER
        $sql = "SELECT MAX(esp32_ID) FROM `esp32cam`";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $maxIdResult = $stmt->fetchColumn();

        if ($maxIdResult !== false) {
            $esp32_ID = $maxIdResult + 1;
        }

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST["message"]) && isset($_POST["image"])) {
                // รับข้อมูลข้อความ
                $message = $_POST["message"];

                // รับข้อมูลรูปภาพ
                $imageData = base64_decode($_POST["image"]);

                if ($imageData !== false) {
                    $imageFileName = "./img/esp32_" . $esp32_ID . ".jpg"; // เลือกโฟลเดอร์และกำหนดชื่อไฟล์

                    // บันทึกรูปภาพลงในโฟลเดอร์
                    if (file_put_contents($imageFileName, $imageData) !== false) {
                        // สามารถทำอะไรก็ได้ที่คุณต้องการที่นี่
                        $sql = "INSERT INTO esp32cam(esp32_ID, esp32_imageName, created_at) VALUES(:esp32_ID, :esp32_imageName, DATE_ADD(NOW(), INTERVAL 7 HOUR))";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':esp32_ID', $esp32_ID);
                        $stmt->bindParam(':esp32_imageName', $imageFileName);

                        if ($stmt->execute()) {
                            $response = ['status' => 1, 'message' => 'File uploaded and data inserted successfully.'];
                        } else {
                            $response = ['status' => 0, 'message' => 'Failed to insert data into the database.'];
                        }
                        // ส่งคำตอบกลับไปยัง Arduino
                        echo "Image received and saved as: $imageFileName";
                    } else {
                        echo "Failed to save image.";
                    }
                } else {
                    echo "Invalid image data.";
                }
            } else {
                echo "Invalid data received.";
            }
        } else {
            echo "Invalid request method. This script should be accessed via POST.";
        }
        echo json_encode($response);
        break;

    case 1: //update and select IOT status ESP32CAM
        if (isset($_GET['esp32ID'])) {
            if (isset($_GET['status'])) {
                $status = $_GET['status'];
                // ทำการอัปเดต status ตามค่าที่ส่งมา
                // ตัวอย่างเช่นอัปเดตไฟล์หรือฐานข้อมูล
                // ตอบกลับสถานะให้ ESP32
                $sql = "UPDATE esp32camstatus SET `esp32status`=:esp32status, esp32time = NOW() WHERE esp32ID=:esp32ID";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':esp32ID', $_GET['esp32ID']);
                $stmt->bindParam(':esp32status', $status);
                $stmt->execute();
            }

            $sql1 = "SELECT esp32status,esp32time FROM `esp32camstatus` WHERE esp32ID=:esp32ID";
            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(':esp32ID', $_GET['esp32ID']);
            $stmt1->execute();
            $lastCommunicationTime = $stmt1->fetch(PDO::FETCH_ASSOC); // timestamp
            $currentTime = time(); // เวลาปัจจุบัน
            // ตรวจสอบว่าผ่านไปกี่วินาทีตั้งแต่ครั้งสุดท้ายที่ ESP32 ตอบสนอง
            $elapsedTime = $currentTime - strtotime($lastCommunicationTime['esp32time']);
            // ถ้าผ่านไปมากกว่า 30 วินาที ให้เปลี่ยนแปลงสถานะเป็น 0
            if ($lastCommunicationTime['esp32status'] != 0 && $elapsedTime > 30) {
                $status = 0;
                $lastCommunicationTime['esp32status'] = 0;
                $sql = "UPDATE esp32camstatus SET `esp32status`=:esp32status, esp32time = NOW() WHERE esp32ID=:esp32ID";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':esp32ID', $_GET['esp32ID']);
                $stmt->bindParam(':esp32status', $status);
                $stmt->execute();
            }
        }
        // เรียก status
        $response = ['status' => $lastCommunicationTime['esp32status']];
        header('Content-Type: application/json');
        echo json_encode($response);

        break;
    case 2: //update IOT Alert
        if (isset($_GET['esp32ID']) && isset($_GET['status'])) {
            $status = $_GET['status'];
            // ทำการอัปเดต status ตามค่าที่ส่งมา
            // ตัวอย่างเช่นอัปเดตไฟล์หรือฐานข้อมูล
            // ตอบกลับสถานะให้ ESP32
            $sql = "UPDATE esp32camalert SET `esp32alert`=:esp32alert, esp32alerttime = NOW() WHERE esp32ID=:esp32ID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':esp32ID', $_GET['esp32ID']);
            $stmt->bindParam(':esp32alert', $status);
            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'File uploaded and data inserted successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to insert data into the database.'];
            }
        }
        // เรียก status
        header('Content-Type: application/json');
        echo json_encode($response);
        break;
    case 3: //select IOT Alert
        $sql1 = "SELECT esp32alert,esp32alerttime FROM `esp32camalert` WHERE esp32ID=:esp32ID";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(':esp32ID', $_GET['esp32ID']);
        $stmt1->execute();
        $last = $stmt1->fetch(PDO::FETCH_ASSOC); // timestamp
        header('Content-Type: application/json');
        echo json_encode($last['esp32alert']);
        break;
    case 4: //Line send
        $selectsql = "SELECT * FROM `esp32cam` ORDER BY created_at DESC LIMIT 1";
        $stmtselect2 = $conn->prepare($selectsql);
        $stmtselect2->execute();
        $select2 = $stmtselect2->fetch(PDO::FETCH_ASSOC);

        //access token line
        $access_token = 'yrikGSQzBPopvD/ZZqJaQ955wB2vKFVCeHhFv1nXZuDMccart4+9BSsfbTHS9KlDLg4jc+6jc3zst4hfMUmn/7MQOj+KJkDUdpWB6aYrUEpHM5ZCiXKzw2Cpg/taWOUkTEY0WWZLGvKrCCVp5x84pQdB04t89/1O/w1cDnyilFU=';
        //channel secret line
        $channel_secret = 'beb1dbddb17554323ee583c390e817da';
        // ข้อความ
        $message = "มีคนต้องการขอความช่วยเหลือ";

        // Prepare the broadcast message
        $url = 'https://api.line.me/v2/bot/message/broadcast';

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $access_token
        );

        $data = array(
            'messages' => array(
                array(
                    'type' => 'text',
                    'text' => $message
                )
                ,
                array(
                    'type' => 'image',
                    'originalContentUrl' =>  'https://thewateraccident.000webhostapp.com/' . $select2['esp32_imageName'], // replace with your image URL
                    'previewImageUrl' => 'https://thewateraccident.000webhostapp.com/' . $select2['esp32_imageName'] // replace with your image thumbnail URL
                )
            )
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification for simplicity (not recommended for production)

        $result = curl_exec($ch);
        curl_close($ch);
        header('Content-Type: application/json');
        echo json_encode($result);
        // echo json_encode($select2['esp32_imageName']);
        break;
}
