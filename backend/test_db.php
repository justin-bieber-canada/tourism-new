<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/config/env.php';
require_once __DIR__ . '/src/config/db.php';

use App\Config\Database;
use App\Config\Env;

// Load environment variables
$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $pdo = Database::make();
    echo "✅ Database connection successful!\n";
    
    $stmt = $pdo->query("SELECT VERSION()");
    $version = $stmt->fetchColumn();
    echo "📊 MySQL Version: " . $version . "\n";

    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    echo "busts Users in database: " . $userCount . "\n";

} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}
