-- LogiTrack Database Initialization Script
-- Creates necessary tables and initial data

-- Enable UUID extension if using PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_parcels INTEGER DEFAULT 0,
    active_parcels INTEGER DEFAULT 0
);

-- Delivery agents table
CREATE TABLE IF NOT EXISTS delivery_agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    vehicle VARCHAR(100),
    vehicle_number VARCHAR(20),
    license_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    current_location VARCHAR(255),
    total_deliveries INTEGER DEFAULT 0,
    active_deliveries INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.0,
    joined_date DATE
);

-- Parcels table
CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(50) PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    sender_address TEXT NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_address TEXT NOT NULL,
    weight VARCHAR(20) NOT NULL,
    delivery_type VARCHAR(20) NOT NULL,
    current_status VARCHAR(50) NOT NULL,
    current_location VARCHAR(255),
    created_date TIMESTAMP NOT NULL,
    expected_delivery TIMESTAMP,
    assigned_agent_id VARCHAR(50),
    FOREIGN KEY (assigned_agent_id) REFERENCES delivery_agents(id)
);

-- Parcel status history table
CREATE TABLE IF NOT EXISTS parcel_history (
    id SERIAL PRIMARY KEY,
    parcel_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    timestamp TIMESTAMP NOT NULL,
    note TEXT,
    FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(20) NOT NULL,
    FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(current_status);
CREATE INDEX IF NOT EXISTS idx_parcels_created_date ON parcels(created_date);
CREATE INDEX IF NOT EXISTS idx_parcel_history_parcel_id ON parcel_history(parcel_id);
CREATE INDEX IF NOT EXISTS idx_parcel_history_timestamp ON parcel_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp);

-- Insert initial data
INSERT INTO delivery_agents (id, name, phone, email, vehicle, vehicle_number, license_number, status, current_location, total_deliveries, active_deliveries, rating, joined_date) VALUES
('agent_1', 'Michael Rodriguez', '+1-555-0123', 'michael@logitrack.com', 'Delivery Van', 'Ford Transit', 'DL123456', 'active', 'Chicago, IL', 145, 8, 4.8, '2023-01-15'),
('agent_2', 'Lisa Johnson', '+1-555-0124', 'lisa@logitrack.com', 'Delivery Truck', 'Mercedes Sprinter', 'DL789012', 'active', 'Austin, TX', 132, 5, 4.9, '2023-03-20'),
('agent_3', 'James Wilson', '+1-555-0125', 'james@logitrack.com', 'Delivery Van', 'Dodge ProMaster', 'DL345678', 'active', 'Philadelphia, PA', 167, 3, 4.7, '2023-02-10'),
('agent_4', 'Patricia Martinez', '+1-555-0126', 'patricia@logitrack.com', 'Delivery Truck', 'Isuzu NPR', 'DL901234', 'active', 'Miami, FL', 98, 6, 4.6, '2023-04-05'),
('agent_5', 'Robert Taylor', '+1-555-0127', 'robert@logitrack.com', 'Delivery Motorcycle', 'Honda PCX', 'DL567890', 'active', 'Chicago, IL', 78, 4, 4.5, '2023-05-12');

-- Insert sample users
INSERT INTO users (id, name, email, phone, address, total_parcels, active_parcels) VALUES
('user_1', 'John Doe', 'john@example.com', '+1-234-567-8900', '123 Main St, New York, NY 10001', 15, 3),
('user_2', 'Jane Smith', 'jane@example.com', '+1-098-765-4321', '456 Oak Ave, Los Angeles, CA 90001', 8, 2),
('user_3', 'Bob Johnson', 'bob@example.com', '+1-555-123-4567', '789 Pine St, Chicago, IL 60601', 12, 4),
('user_4', 'Alice Brown', 'alice@example.com', '+1-555-987-6543', '321 Elm St, Boston, MA 02101', 6, 1),
('user_5', 'Charlie Wilson', 'charlie@example.com', '+1-555-246-8135', '654 Maple Dr, Seattle, WA 98101', 23, 7);

-- Insert default settings
INSERT INTO settings (category, key, value) VALUES
('general', 'company_name', 'LogiTrack'),
('general', 'company_email', 'info@logitrack.com'),
('general', 'company_phone', '+1-234-567-8900'),
('general', 'timezone', 'UTC-5'),
('general', 'language', 'en'),
('general', 'currency', 'USD'),
('notifications', 'email_notifications', 'true'),
('notifications', 'sms_notifications', 'false'),
('notifications', 'push_notifications', 'true'),
('notifications', 'delivery_alerts', 'true'),
('notifications', 'system_alerts', 'true'),
('security', 'two_factor_auth', 'false'),
('security', 'session_timeout', '30'),
('security', 'password_expiry', '90'),
('data', 'auto_backup', 'true'),
('data', 'backup_frequency', 'daily'),
('data', 'retention_period', '90');

-- Create trigger to update user parcel counts
CREATE OR REPLACE FUNCTION update_user_parcel_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET total_parcels = total_parcels + 1, active_parcels = active_parcels + 1 WHERE id = 'user_' || NEW.receiver_name;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.current_status != 'Delivered' AND NEW.current_status = 'Delivered' THEN
            UPDATE users SET active_parcels = active_parcels - 1 WHERE id = 'user_' || NEW.receiver_name;
        ELSIF OLD.current_status IN ('Failed Delivery', 'Returned') AND NEW.current_status NOT IN ('Failed Delivery', 'Returned') THEN
            UPDATE users SET active_parcels = active_parcels + 1 WHERE id = 'user_' || NEW.receiver_name;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_user_parcel_counts ON parcels;
CREATE TRIGGER trigger_update_user_parcel_counts
    AFTER INSERT OR UPDATE ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION update_user_parcel_counts();
