<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "pos";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the form data
    $category = $_POST['category'];
    $name = $_POST['name'];
    $price = $_POST['price'];

    // Handle file upload
    $image = $_FILES['image']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($image);
    
    // Move uploaded image to the uploads directory
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
        // Insert the data into the stock table
        $sql = "INSERT INTO stock (category, name, price, image_path) VALUES ('$category', '$name', '$price', '$target_file')";
        
        if ($conn->query($sql) === TRUE) {
            echo "Stock item inserted successfully!";  // Successfully inserted
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;  // Error message
        }
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

$conn->close();
?>
