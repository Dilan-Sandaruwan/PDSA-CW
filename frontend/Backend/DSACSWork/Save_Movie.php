<?php
header("Content-Type: application/json");

require_once "../config/db.php";
require_once "../utils/responce.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->MovieName) ||
    empty($data->ReleasDate) ||
    empty($data->ticketprice) ||
    empty($data->Status)
) {
    sendResponse(400, "All fields are required");
}

try {
    $query = "INSERT INTO Movies (MovieName, ReleasDate, ticketprice, Status)
              VALUES (:name, :date, :price, :status)";

    $stmt = $conn->prepare($query);

    $stmt->execute([
        ":name" => htmlspecialchars(strip_tags($data->MovieName)),
        ":date" => $data->ReleasDate,
        ":price" => $data->ticketprice,
        ":status" => htmlspecialchars(strip_tags($data->Status))
    ]);

    sendResponse(201, "Movie created successfully");

} catch (PDOException $e) {
    sendResponse(500, "Failed to create movie");
}