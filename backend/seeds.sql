-- Seed Data for New Schema

-- 1. Users
-- Password is 'password123' ($2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO)
INSERT INTO Users (first_name, last_name, email, phone_number, password_hash, user_type) VALUES 
('Admin', 'User', 'admin@example.com', '0911000000', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO', 'admin'),
('Guide', 'User', 'guide@example.com', '0911000001', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO', 'guide'),
('Visitor', 'User', 'visitor@example.com', '0911000002', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO', 'visitor'),
('Researcher', 'User', 'researcher@example.com', '0911000003', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO', 'researcher');

-- 2. Roles
INSERT INTO Roles (role_name, description) VALUES 
('Admin', 'Administrator with full access'),
('Guide', 'Tour guide'),
('Visitor', 'Tourist or visitor'),
('Researcher', 'Content creator and researcher');

-- 3. UserRoles
INSERT INTO UserRoles (user_id, role_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- 4. Categories
INSERT INTO Categories (category_name, description) VALUES 
('Historical', 'Ancient historical sites'),
('Natural', 'Natural landscapes and parks'),
('Cultural', 'Cultural heritage sites');

-- 5. Regions
INSERT INTO Regions (region_name, city) VALUES 
('Amhara', 'Lalibela'),
('Tigray', 'Axum'),
('Oromia', 'Bale'),
('Addis Ababa', 'Addis Ababa');

-- 6. Sites
INSERT INTO Sites (site_name, short_description, full_description, location_address, visit_price, entrance_fee, guide_fee, category_id, region_id, created_by, is_approved, approved_by) VALUES 
('Lalibela Rock-Hewn Churches', 'Famous rock-hewn churches.', 'The 11 medieval monolithic cave churches of this 13th-century ''New Jerusalem'' are situated in a mountainous region in the heart of Ethiopia near a traditional village with circular-shaped dwellings.', 'Lalibela, Ethiopia', 500.00, 200.00, 300.00, 1, 1, 1, TRUE, 1),
('Simien Mountains National Park', 'Spectacular landscapes.', 'Massive erosion over the years on the Ethiopian plateau has created one of the most spectacular landscapes in the world, with jagged mountain peaks, deep valleys and sharp precipices dropping some 1,500 m.', 'North Gondar', 400.00, 150.00, 250.00, 2, 1, 1, TRUE, 1);

-- 8. Guide Types
INSERT INTO GuideTypes (type_name, description, additional_fee) VALUES 
('Standard', 'Standard tour guide', 0.00),
('Expert', 'Expert historian or specialist', 500.00);

-- 10. Payment Methods
INSERT INTO PaymentMethods (method_name, description) VALUES 
('Chapa', 'Chapa Online Payment'),
('Bank Transfer', 'Direct Bank Transfer');

-- 9. Guide Requests
INSERT INTO GuideRequests (visitor_id, site_id, guide_type_id, preferred_date, preferred_time, number_of_visitors, request_status, assigned_guide_id) VALUES 
(3, 1, 1, '2025-12-25', '09:00:00', 2, 'pending', NULL),
(3, 2, 2, '2026-01-10', '08:00:00', 5, 'approved', 2);

-- 11. Payments
INSERT INTO Payments (request_id, payment_method_id, total_amount, reference_code, payment_status, paid_at) VALUES 
(2, 1, 2500.00, 'TXN-NEW-12345', 'paid', '2025-12-05 10:00:00');

-- 16. Notifications
INSERT INTO Notifications (user_id, title, message, notification_type, is_read) VALUES 
(3, 'Welcome', 'Welcome to the new Tourism System!', 'system', FALSE);
