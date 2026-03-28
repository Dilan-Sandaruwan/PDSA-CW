<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET");

require_once "../config/db.php";
require_once "../utils/responce.php";

$db = new Database();
$conn = $db->connect();

try {
    $stmt = $conn->query("SELECT * FROM Movies ORDER BY id DESC");
    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($movies) > 0) {
        sendResponse(200, "Movies fetched successfully", $movies);
    } else {
        sendResponse(200, "No movies found", []);
    }

} catch (PDOException $e) {
    sendResponse(500, "Failed to fetch movies");
}