-- ENUM Types MUST be created FIRST - they're dependencies for tables
CREATE TYPE room_status_enum AS ENUM ('available', 'occupied', 'maintenance', 'cleaning');
CREATE TYPE reservation_status_enum AS ENUM ('confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_method_enum AS ENUM ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'online_payment', 'voucher');
CREATE TYPE guest_type_enum AS ENUM ('online', 'walk-in');
CREATE TYPE audit_action_enum AS ENUM ('INSERT', 'UPDATE', 'DELETE');


-- 1. Roles Table (independent, referenced by users)
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (depends on roles)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(role_id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Staff Table (depends on users)
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Guests Table (depends on users and staff)
CREATE TABLE guests (
    guest_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id),
    created_by INTEGER REFERENCES staff(staff_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    date_of_birth DATE,
    nationality VARCHAR(100),
    guest_type guest_type_enum DEFAULT 'walk-in',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Room Types Table (independent)
CREATE TABLE room_types (
    room_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    amenities TEXT[],
    size_sqft INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Rooms Table (depends on room_types)
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_type_id INTEGER NOT NULL REFERENCES room_types(room_type_id),
    room_number VARCHAR(10) UNIQUE NOT NULL,
    floor INTEGER NOT NULL,
    status room_status_enum DEFAULT 'available',
    price_adjustment DECIMAL(10,2) DEFAULT 0.00,
    special_features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reservations Table (depends on guests, rooms, users)
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id),
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    created_by INTEGER NOT NULL REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    actual_check_in TIMESTAMPTZ,
    actual_check_out TIMESTAMPTZ,
    number_of_guests SMALLINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status reservation_status_enum DEFAULT 'confirmed',
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payments Table (depends on reservations, staff)
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_reason TEXT,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processed_by INTEGER REFERENCES staff(staff_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Audit Logs Table (depends on users)
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action audit_action_enum NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER REFERENCES users(user_id),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);