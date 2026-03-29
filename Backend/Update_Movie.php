<?php
include 'utils/cors.php';
include 'config/db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id'])) {
    $id = $data['id'];
    $movieName = $data['MovieName'];
    $releaseDateTime = $data['ReleasDate'];
    $ticketPrice = $data['ticketprice'];
    $status = $data['Status'];
    
    $releaseTime = date('H:i:s', strtotime($releaseDateTime));

    $sql = "UPDATE movies SET MovieName=?, ReleasDate=?, ticketprice=?, Status=?, release_time=? WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdsii", $movieName, $releaseDateTime, $ticketPrice, $status, $releaseTime, $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => 200, "message" => "Movie updated successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Update failed: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => 400, "message" => "Invalid ID or data"]);
}

$conn->close();
?>
