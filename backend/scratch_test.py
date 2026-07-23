import requests

def test_student_register():
    url = "http://127.0.0.1:8000/student/register"
    payload = {
        "first_name": "Test",
        "last_name": "Student",
        "email": "teststudent@example.com",
        "phone": "9876543210",
        "department": "CSE",
        "year": 3,
        "password": "password123"
    }
    response = requests.post(url, json=payload)
    print("Student register status:", response.status_code)
    print("Student register body:", response.text)

def test_company_register():
    url = "http://127.0.0.1:8000/company/register"
    payload = {
        "company_name": "Test Company",
        "email": "testcompany@example.com",
        "phone": "9876543211",
        "website": "https://testcompany.com",
        "location": "NY",
        "description": "Awesome company",
        "password": "password123"
    }
    response = requests.post(url, json=payload)
    print("Company register status:", response.status_code)
    print("Company register body:", response.text)

if __name__ == "__main__":
    try:
        test_student_register()
    except Exception as e:
        print("Student register error:", e)
        
    try:
        test_company_register()
    except Exception as e:
        print("Company register error:", e)
