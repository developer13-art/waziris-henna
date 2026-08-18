<?php
// ============================================
// CREATE ADMIN USER SCRIPT
// Run: php create_admin.php
// ============================================

// Database connection
$host = 'localhost';
$dbname = 'waziris_henna';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$dbname}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Admin details
    $fullName = 'Aisha Abdullahi Waziri';
    $email = 'admin@wazirishenna.com';
    $phone = '+2347048823830';
    $password = 'admin123'; // CHANGE THIS!
    $role = 'admin';
    
    // Check if admin already exists
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    
    if ($check->fetch()) {
        echo "Admin already exists!\n";
        exit();
    }
    
    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert admin user
    $sql = "INSERT INTO users (full_name, email, phone, password_hash, role, is_active) 
            VALUES (?, ?, ?, ?, ?, 1)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$fullName, $email, $phone, $passwordHash, $role]);
    
    echo "✅ Admin user created successfully!\n";
    echo "Email: {$email}\n";
    echo "Password: {$password}\n";
    echo "\nYou can now login at: http://localhost:3000/admin/login\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}