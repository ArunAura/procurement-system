-- Create database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  vendor_type VARCHAR(100),
  address TEXT,
  gst_number VARCHAR(15),
  pan_number VARCHAR(10),
  contact_person VARCHAR(255),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(20),
  branch_name VARCHAR(255),
  products_services VARCHAR(255),
  delivery_timeline VARCHAR(255),
  payment_terms VARCHAR(50),
  documents TEXT, -- JSON array of checkbox documents submitted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  po_date DATE,
  shipment_state VARCHAR(100),
  shipment_state_code VARCHAR(20),
  shipment_phone VARCHAR(20),
  shipment_gstin VARCHAR(20),
  vendor_state VARCHAR(100),
  vendor_name VARCHAR(255),
  vendor_state_code VARCHAR(20),
  vendor_gstin VARCHAR(20),
  vendor_phone VARCHAR(20),
  place_of_supply VARCHAR(255),
  subtotal DECIMAL(12,2),
  cgst DECIMAL(12,2),
  sgst DECIMAL(12,2),
  grand_total DECIMAL(12,2),
  amount_in_words TEXT,
  payment_terms VARCHAR(255),
  payment_method VARCHAR(100),
  special_terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items table (relational 1-to-many relationship)
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  sl_no INT NOT NULL,
  item_description VARCHAR(255),
  hsn_code VARCHAR(50),
  qty INT,
  unit VARCHAR(50),
  delivery_date DATE,
  unit_price DECIMAL(12,2),
  charges DECIMAL(12,2),
  total DECIMAL(12,2),
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- Indent Requests table
CREATE TABLE IF NOT EXISTS indent_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  indent_number VARCHAR(50) UNIQUE NOT NULL,
  indent_date DATE,
  requested_by VARCHAR(255),
  department VARCHAR(100),
  required_date DATE,
  designation VARCHAR(100),
  reason_for_requirement TEXT,
  prepared_by_name VARCHAR(255),
  prepared_by_sig VARCHAR(255),
  prepared_by_date DATE,
  verified_by_name VARCHAR(255),
  verified_by_sig VARCHAR(255),
  verified_by_date DATE,
  approved_by_name VARCHAR(255),
  approved_by_sig VARCHAR(255),
  approved_by_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indent Request Items table (relational 1-to-many relationship)
CREATE TABLE IF NOT EXISTS indent_request_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  indent_request_id INT NOT NULL,
  sl_no INT NOT NULL,
  item_description VARCHAR(255),
  qty INT,
  remarks VARCHAR(255),
  FOREIGN KEY (indent_request_id) REFERENCES indent_requests(id) ON DELETE CASCADE
);
