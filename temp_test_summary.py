import requests
url='http://localhost:8000/api/v1/usage/summary'
payload={'transcript':'hello world','tone':'default','length':'short'}
res=requests.post(url,json=payload)
print('status',res.status_code)
print(res.text)
