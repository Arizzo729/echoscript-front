import requests
print('signup test')
res = requests.post('http://localhost:8000/api/v1/auth/signup', json={'email':'test2@example.com','password':'longpassword'})
print(res.status_code, res.text)
res2 = requests.post('http://localhost:8000/api/v1/auth/login', json={'email':'test2@example.com','password':'longpassword'})
print(res2.status_code, res2.text)
