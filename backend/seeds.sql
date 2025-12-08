-- Users (Password is 'password123')
INSERT INTO users (full_name, role, email, phone, password_hash) VALUES 
('Admin User', 'admin', 'admin@example.com', '0911000000', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO'),
('Guide User', 'guide', 'guide@example.com', '0911000001', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO'),
('Visitor User', 'visitor', 'visitor@example.com', '0911000002', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO');

-- Sites
INSERT INTO sites (name, description, location, status) VALUES 
('Lalibela', 'Rock-hewn churches of Lalibela, a UNESCO World Heritage site.', 'Lalibela, Amhara', 'active'),
('Simien Mountains', 'Spectacular mountain scenery and unique wildlife.', 'North Gondar, Amhara', 'active'),
('Axum', 'Ancient capital with obelisks and tombs.', 'Axum, Tigray', 'active'),
('Bale Mountains', 'Home to the Ethiopian wolf and diverse landscapes.', 'Bale, Oromia', 'active');

-- Requests
INSERT INTO requests (visitor_id, site_id, request_status, scheduled_date, notes) VALUES 
(3, 1, 'pending', '2025-12-25 09:00:00', 'I would like a full day tour.'),
(3, 2, 'approved', '2026-01-10 08:00:00', 'Hiking trip.');

-- Payments
INSERT INTO payments (request_id, total_amount, payment_status, reference_code, payment_method_id, paid_at) VALUES 
(2, 1500.00, 'completed', 'TXN-123456789', 1, '2025-12-01 10:00:00');

-- Notifications
INSERT INTO notifications (user_id, title, body, is_read) VALUES 
(3, 'Welcome', 'Welcome to the Tourism Management System!', 0),
(2, 'New Assignment', 'You have been assigned to a new tour.', 0);
