<?php
include 'utils/cors.php';
include 'config/db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['id'])) {
    $id = $data['id'];
    
    $sql = "DELETE FROM movies WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => 200, "message" => "Movie deleted successfully"]);
    } else {
        echo json_encode(["status" => 500, "message" => "Deletion failed: " . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => 400, "message" => "Invalid ID"]);
}

$conn->close();
?>
