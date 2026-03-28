<?php
header("Content-Type: application/json");

require_once "../config/db.php";
require_once "../utils/responce.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    sendResponse(400, "Movie ID is required");
}

try {
    $check = $conn->prepare("SELECT id FROM Movies WHERE id = :id");
    $check->execute([":id" => $data->id]);

    if ($check->rowCount() == 0) {
        sendResponse(404, "Movie not found");
    }

    $query = "DELETE FROM Movies WHERE id = :id";
    $stmt = $conn->prepare($query);

    $stmt->execute([":id" => $data->id]);

    sendResponse(200, "Movie deleted successfully");

} catch (PDOException $e) {
    sendResponse(500, "Failed to delete movie");
}