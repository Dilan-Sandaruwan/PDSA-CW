<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";
require_once "../utils/responce.php";


$db = new Database();
$conn = $db->connect();


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // Get all mvoies
    case 'GET':
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
        break;

    // Save
    case 'POST':
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
            $stmt = $conn->prepare("
                INSERT INTO Movies (MovieName, ReleasDate, ticketprice, Status)
                VALUES (:name, :date, :price, :status)
            ");

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
        break;

    // Update
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->id)) {
            sendResponse(400, "Movie ID is required");
        }

        try {
            $stmt = $conn->prepare("
                UPDATE Movies SET
                    MovieName = :name,
                    ReleasDate = :date,
                    ticketprice = :price,
                    Status = :status
                WHERE id = :id
            ");

            $stmt->execute([
                ":name" => $data->MovieName,
                ":date" => $data->ReleasDate,
                ":price" => $data->ticketprice,
                ":status" => $data->Status,
                ":id" => $data->id
            ]);

            sendResponse(200, "Movie updated successfully");

        } catch (PDOException $e) {
            sendResponse(500, "Failed to update movie");
        }
        break;

    // Delete
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->id)) {
            sendResponse(400, "Movie ID is required");
        }

        try {
            $stmt = $conn->prepare("DELETE FROM Movies WHERE id = :id");
            $stmt->execute([":id" => $data->id]);

            sendResponse(200, "Movie deleted successfully");

        } catch (PDOException $e) {
            sendResponse(500, "Failed to delete movie");
        }
        break;

    // DEFAULT 
    default:
        sendResponse(405, "Method not allowed");
}