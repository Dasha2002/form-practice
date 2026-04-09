<?php

header('Content-Type: application/json');

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

if (!$name || !$email) {
    echo json_encode(["success" => false]);
    exit;
}

$data = [
    "name" => $name,
    "email" => $email,
    "phone" => $phone,
    "message" => $message,
    "date" => date("Y-m-d H:i:s")
];

$file = "leads.json";

$existing = [];

if (file_exists($file)) {
    $existing = json_decode(file_get_contents($file), true);
}

$existing[] = $data;

file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["success" => true]);
