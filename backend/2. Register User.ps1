$body = @{
    email = "receptionist@hotel.com"
    password = "Receptionist123!"
    role_id = 1
    first_name = "Receptionist"
    last_name = "Test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"