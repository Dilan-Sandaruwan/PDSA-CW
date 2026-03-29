<?php
include 'utils/cors.php';
include 'config/db_connection.php';

$sql = "SELECT id, MovieName, ReleasDate, ticketprice, Status, created_at, updated_at, release_time FROM movies ORDER BY created_at DESC";
$result = $conn->query($sql);

$movies = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }
}

echo json_encode(["status" => 200, "data" => $movies]);

$conn->close();
?>
