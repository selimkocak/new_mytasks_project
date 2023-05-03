import requests

headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgyNzYxNTU0LCJpYXQiOjE2ODI3NTc5NTQsImp0aSI6ImEyNjQ3YTNlZDU1MDQyZTRhMzcxYzNlMGE4NzA1NGZlIiwidXNlcl9pZCI6NH0.1UJWpROWYAnD5_ET6w8cqvLzIiTg6v9vJLTch_F8fo0',  # Your access token here
}

response = requests.get('http://localhost:8000/api/tasks/', headers=headers)

print(response.status_code)
print(response.json())
