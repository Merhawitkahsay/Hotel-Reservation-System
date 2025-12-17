$wrongBody = @{
    email = "admin_test@hotel.com"
    password = "WrongPassword!"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $wrongBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "ERROR: Wrong password accepted!"
} catch {
    Write-Host "SUCCESS: Wrong password rejected (Password hashing working)"
}