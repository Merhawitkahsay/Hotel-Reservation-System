$invalidHeaders = @{
    "Authorization" = "Bearer INVALID_TOKEN_12345"
}

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $invalidHeaders -ErrorAction Stop
    Write-Host "ERROR: Invalid token accepted!"
} catch {
    Write-Host "SUCCESS: Invalid token rejected"
}