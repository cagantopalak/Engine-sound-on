<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$response = [
  "news" => true,
  "snow" => true,
  "message" => "Hello from PHP JSON endpoint!",
  "timestamp" => date('c'),
  "data" => [
    "example" => 123,
    "items" => ["a", "b", "c"]
  ]
];

http_response_code(200);
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
exit;