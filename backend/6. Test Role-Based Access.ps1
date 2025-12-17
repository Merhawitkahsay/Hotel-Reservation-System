# Check user role from profile
$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "User Role: $($profile.data.user.role_name)"