<?php
include 'utils/cors.php';
include 'config/db_connection.php';

// Get JSON data from POST body
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $movieName = $data['MovieName'];
    $releaseDateTime = $data['ReleasDate'];
    $ticketPrice = $data['ticketprice'];
    $status = $data['Status'];
    
    // Extract time from datetime-local string (format: YYYY-MM-DDTHH:MM)
    $releaseTime = date('H:i:s', strtotime($releaseDateTime));

    // Notice the typo in 'ReleasDate' to match the database image
    $sql = "INSERT INTO movies (MovieName, ReleasDate, ticketprice, Status, release_time) VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdss", $movieName, $releaseDateTime, $ticketPrice, $status, $releaseTime);

    if ($stmt->execute()) {
        echo json_encode(["status" => 201, "message" => "Movie saved successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Error: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => 400, "message" => "Invalid input data"]);
}

$conn->close();
?>
