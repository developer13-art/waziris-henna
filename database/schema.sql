-- ============================================
-- WAZIRI'S HENNA - DATABASE SCHEMA
-- All data will be added dynamically via Admin Dashboard
-- ============================================

CREATE DATABASE IF NOT EXISTS waziris_henna CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE waziris_henna;

-- ==================== USERS TABLE ====================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ==================== SERVICES TABLE ====================
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    starting_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_minutes INT DEFAULT 60,
    suitable_occasions TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ==================== DESIGN CATEGORIES TABLE ====================
CREATE TABLE design_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- ==================== DESIGNS TABLE ====================
CREATE TABLE designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INT,
    style VARCHAR(100),
    occasion VARCHAR(100),
    body_area VARCHAR(100),
    complexity ENUM('Simple', 'Medium', 'Intricate') DEFAULT 'Medium',
    price DECIMAL(10,2) DEFAULT NULL,
    image_url VARCHAR(500),
    additional_images TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_design_of_week BOOLEAN DEFAULT FALSE,
    week_start_date DATE,
    views_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES design_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_occasion (occasion),
    INDEX idx_style (style),
    INDEX idx_complexity (complexity),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB;

-- ==================== PRODUCTS TABLE ====================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(10,2) DEFAULT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    sku VARCHAR(100),
    image_url VARCHAR(500),
    additional_images TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB;

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    service_id INT,
    design_id INT,
    event_type VARCHAR(100),
    event_date DATE,
    event_time TIME,
    number_of_people INT DEFAULT 1,
    additional_notes TEXT,
    booking_status ENUM('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Successful', 'Failed', 'Cancelled', 'Refunded') DEFAULT 'Pending',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE SET NULL,
    INDEX idx_reference (booking_reference),
    INDEX idx_status (booking_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_event_date (event_date)
) ENGINE=InnoDB;

-- ==================== ORDERS TABLE ====================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    delivery_method ENUM('Pickup', 'Delivery') DEFAULT 'Pickup',
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    order_status ENUM('Pending', 'Paid', 'Processing', 'Ready', 'Delivered', 'Completed', 'Cancelled') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Successful', 'Failed', 'Cancelled', 'Refunded') DEFAULT 'Pending',
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reference (order_reference),
    INDEX idx_status (order_status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- ==================== ORDER ITEMS TABLE ====================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ==================== PAYMENTS TABLE ====================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    booking_id INT,
    order_id INT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_method VARCHAR(50) DEFAULT 'Paystack',
    payment_status ENUM('Pending', 'Successful', 'Failed', 'Cancelled', 'Refunded') DEFAULT 'Pending',
    paystack_reference VARCHAR(100),
    paystack_transaction_id VARCHAR(100),
    paystack_authorization_code VARCHAR(100),
    payment_date TIMESTAMP NULL,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_reference (payment_reference),
    INDEX idx_status (payment_status),
    INDEX idx_paystack_ref (paystack_reference)
) ENGINE=InnoDB;

-- ==================== SAVED DESIGNS (FAVORITES) TABLE ====================
CREATE TABLE saved_designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    design_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved (user_id, design_id),
    INDEX idx_user (user_id),
    INDEX idx_design (design_id)
) ENGINE=InnoDB;

-- ==================== REVIEWS TABLE ====================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    review_type ENUM('service', 'product', 'general') DEFAULT 'service',
    service_id INT,
    product_id INT,
    booking_id INT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_type (review_type),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- ==================== JOURNAL ARTICLES TABLE ====================
CREATE TABLE journal_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category ENUM('Guides', 'Tutorials', 'Culture', 'Tips', 'Inspiration') DEFAULT 'Guides',
    excerpt VARCHAR(500),
    content LONGTEXT,
    image_url VARCHAR(500),
    author VARCHAR(255),
    tags VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_published (is_published)
) ENGINE=InnoDB;

-- ==================== INVENTORY LOG TABLE ====================
CREATE TABLE inventory_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    change_type ENUM('add', 'remove', 'adjust', 'sale', 'restock') DEFAULT 'adjust',
    quantity_changed INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255),
    order_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_type (change_type)
) ENGINE=InnoDB;

-- ==================== SETTINGS TABLE ====================
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_group VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_group (setting_group)
) ENGINE=InnoDB;

-- ==================== CONTACT MESSAGES TABLE ====================
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_read (is_read)
) ENGINE=InnoDB;

-- ==================== DESIGN VIEWS TRACKING ====================
CREATE TABLE design_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    design_id INT NOT NULL,
    user_id INT,
    ip_address VARCHAR(50),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_design (design_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB;