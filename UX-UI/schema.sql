-- PostgreSQL Database Schema for TaskToGroup (Multi-Tenant Task Assignment System)
-- Schema: sa (System/Application)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Schema
CREATE SCHEMA IF NOT EXISTS sa;

-- 1. Companies (Tenants / Organization Heads)
CREATE TABLE sa.Companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(100) UNIQUE, -- Unique domain/identifier for the tenant
    
    plan_tier VARCHAR(50) DEFAULT 'Starter', -- 'Starter', 'Pro', 'Enterprise'
    is_active BOOLEAN DEFAULT TRUE,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Employees / Staff)
CREATE TABLE sa.Users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES sa.Companies(company_id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'CompanyAdmin' (if secondary), 'User'
    full_name VARCHAR(150),
    phone VARCHAR(50),
    bio TEXT,
    profile_picture_url TEXT,
    must_change_password BOOLEAN DEFAULT TRUE, -- Force change on first login
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email),
    UNIQUE(company_id, username)
);

-- 3. Categories (Work Groups)
CREATE TABLE sa.Categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES sa.Companies(company_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50), -- Material symbol icon name
    color_accent VARCHAR(7), -- HEX color code
    created_by UUID REFERENCES sa.Users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

-- 4. Category_Members (Junction Table)
CREATE TABLE sa.Category_Members (
    category_id UUID REFERENCES sa.Categories(category_id) ON DELETE CASCADE,
    user_id UUID REFERENCES sa.Users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, user_id)
);

-- 5. Tasks
CREATE TABLE sa.Tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES sa.Companies(company_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES sa.Categories(category_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    assigned_to UUID REFERENCES sa.Users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Done'
    created_by UUID NOT NULL REFERENCES sa.Users(user_id) ON DELETE CASCADE,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Task_Attachments
CREATE TABLE sa.Task_Attachments (
    attachment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES sa.Tasks(task_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT, -- in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance & Multi-tenancy Isolation
CREATE INDEX idx_users_company ON sa.Users(company_id);
CREATE INDEX idx_categories_company ON sa.Categories(company_id);
CREATE INDEX idx_tasks_company ON sa.Tasks(company_id);
CREATE INDEX idx_tasks_category ON sa.Tasks(category_id);
CREATE INDEX idx_tasks_assigned_to ON sa.Tasks(assigned_to);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION sa.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON sa.Companies FOR EACH ROW EXECUTE PROCEDURE sa.update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON sa.Users FOR EACH ROW EXECUTE PROCEDURE sa.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON sa.Categories FOR EACH ROW EXECUTE PROCEDURE sa.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON sa.Tasks FOR EACH ROW EXECUTE PROCEDURE sa.update_updated_at_column();
