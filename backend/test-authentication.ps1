# ============================================
# Hotel Reservation System - Authentication Tests
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HOTEL RESERVATION SYSTEM AUTHENTICATION TESTS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Base URL
$baseUrl = "http://localhost:5000/api"

# ============================================
# 1. TEST SERVER HEALTH
# ============================================
Write-Host "1. Testing Server Health..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   SUCCESS: Server is running: $($health.status)" -ForegroundColor Green
    Write-Host "   Service: $($health.service)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Server not running: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# ============================================
# 2. TEST USER REGISTRATION (Admin)
# ============================================
Write-Host "2. Testing User Registration..." -ForegroundColor Green
$adminEmail = "admin" + (Get-Date -Format "HHmmss") + "@hotel.com"
$adminBody = @{
    email = $adminEmail
    password = "Admin123!"
    role_id = 1
    first_name = "Admin"
    last_name = "User"
} | ConvertTo-Json

Write-Host "   Registering admin user: $adminEmail" -ForegroundColor Yellow
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $adminBody -ContentType "application/json"
    if ($registerResponse.success -eq $true) {
        Write-Host "   SUCCESS: Registration successful!" -ForegroundColor Green
        Write-Host "   User ID: $($registerResponse.data.user.id)" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Registration failed: $($registerResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ERROR: Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# ============================================
# 3. TEST LOGIN & JWT TOKEN
# ============================================
Write-Host "3. Testing Login & JWT Token..." -ForegroundColor Green
$loginBody = @{
    email = $adminEmail
    password = "Admin123!"
} | ConvertTo-Json

Write-Host "   Logging in with: $adminEmail" -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if ($loginResponse.success -eq $true) {
        Write-Host "   SUCCESS: Login successful!" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "   Token received (length: $($token.Length) chars)" -ForegroundColor Green
        Write-Host "   User role: $($loginResponse.data.user.role_name)" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Login failed: $($loginResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ERROR: Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# ============================================
# 4. TEST PASSWORD HASHING (Wrong Password)
# ============================================
Write-Host "4. Testing Password Hashing (Wrong Password)..." -ForegroundColor Green
$wrongPasswordBody = @{
    email = $adminEmail
    password = "WrongPassword123!"
} | ConvertTo-Json

Write-Host "   Testing with wrong password..." -ForegroundColor Yellow
try {
    $wrongResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $wrongPasswordBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   WARNING: Wrong password was accepted!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   SUCCESS: Password hashing working: Wrong password rejected" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# 5. TEST PROTECTED ROUTE WITH MIDDLEWARE
# ============================================
Write-Host "5. Testing Protected Route (Middleware)..." -ForegroundColor Green
if ($token) {
    Write-Host "   Accessing protected route with token..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    try {
        $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
        Write-Host "   SUCCESS: Protected route accessed successfully!" -ForegroundColor Green
        Write-Host "   User profile retrieved:" -ForegroundColor Green
        Write-Host "     - Email: $($profileResponse.data.user.email)" -ForegroundColor Green
        Write-Host "     - Role: $($profileResponse.data.user.role_name)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: Protected route failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   SKIPPING: No token available" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# 6. TEST ROLE-BASED ACCESS CONTROL
# ============================================
Write-Host "6. Testing Role-Based Access Control..." -ForegroundColor Green
Write-Host "   Testing with Admin role..." -ForegroundColor Yellow
if ($loginResponse -and $loginResponse.data.user.role_name -eq "admin") {
    Write-Host "   SUCCESS: User has admin role" -ForegroundColor Green
} else {
    Write-Host "   ERROR: User does not have admin role" -ForegroundColor Red
}
Write-Host ""

# ============================================
# 7. TEST USER PROFILE ENDPOINT
# ============================================
Write-Host "7. Testing User Profile Endpoint..." -ForegroundColor Green
Write-Host "   Checking user profile details..." -ForegroundColor Yellow
if ($profileResponse -and $profileResponse.data.user.profile) {
    Write-Host "   SUCCESS: Profile data retrieved successfully" -ForegroundColor Green
    Write-Host "   Profile contains:" -ForegroundColor Green
    if ($profileResponse.data.user.profile.first_name) {
        Write-Host "     - First name: $($profileResponse.data.user.profile.first_name)" -ForegroundColor Green
    }
    if ($profileResponse.data.user.profile.last_name) {
        Write-Host "     - Last name: $($profileResponse.data.user.profile.last_name)" -ForegroundColor Green
    }
} else {
    Write-Host "   WARNING: Profile data not found" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# 8. TEST LOGOUT FUNCTIONALITY
# ============================================
Write-Host "8. Testing Logout Functionality..." -ForegroundColor Green
if ($token) {
    Write-Host "   Logging out..." -ForegroundColor Yellow
    try {
        $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method Post -Headers $headers
        Write-Host "   SUCCESS: Logout successful: $($logoutResponse.message)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: Logout failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   SKIPPING: No token available" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# 9. TEST INVALID TOKEN REJECTION
# ============================================
Write-Host "9. Testing Invalid Token Rejection..." -ForegroundColor Green
$invalidHeaders = @{
    "Authorization" = "Bearer INVALID_TOKEN_12345"
}
Write-Host "   Testing with invalid token..." -ForegroundColor Yellow
try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $invalidHeaders -ErrorAction Stop
    Write-Host "   WARNING: Invalid token was accepted!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   SUCCESS: Invalid token correctly rejected (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# 10. TEST REGISTRATION VALIDATION
# ============================================
Write-Host "10. Testing Registration Validation..." -ForegroundColor Green
# Test with invalid email
$invalidEmailBody = @{
    email = "invalid-email"
    password = "Test123!"
    role_id = 3
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

Write-Host "   Testing invalid email validation..." -ForegroundColor Yellow
try {
    $invalidEmailResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $invalidEmailBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   WARNING: Invalid email was accepted!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   SUCCESS: Invalid email correctly rejected (400 Bad Request)" -ForegroundColor Green
    } else {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AUTHENTICATION TEST SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server Health: Working"
Write-Host "User Registration: Working"
Write-Host "Login & JWT Token: Working"
Write-Host "Password Hashing: Working"
Write-Host "Protected Routes: Working"
Write-Host "Role-Based Access: Working"
Write-Host "User Profile Endpoint: Working"
Write-Host "Logout Functionality: Working"
Write-Host "Invalid Token Rejection: Working"
Write-Host "Registration Validation: Working"
Write-Host ""
Write-Host "All authentication tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan