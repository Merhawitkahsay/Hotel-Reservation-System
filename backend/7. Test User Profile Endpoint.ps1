$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
$profile.data.user | ConvertTo-Json -Depth 5