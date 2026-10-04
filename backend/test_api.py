import urllib.request
import json

BASE_URL = "http://127.0.0.1:5000"

def test_health():
    print("Testing /api/health ...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/health") as response:
            data = json.loads(response.read().decode("utf-8"))
            print("Health Response:", data)
            assert data["status"] == "online"
            print("[OK] /api/health passed!")
    except Exception as e:
        print("[FAIL] Health check failed:", e)

def test_register():
    print("\nTesting /api/register ...")
    payload = {
        "name": "Naivaidya Pare",
        "email": "naivaidya.pare@example.com",
        "phone": "+919876543210",
        "message": "Hello from automated backend verification test!"
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/register",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode("utf-8"))
            print("Register Response:", res)
            assert res["success"] is True
            print("[OK] /api/register passed!")
    except Exception as e:
        print("[FAIL] Registration test failed:", e)

def test_submissions():
    print("\nTesting /api/submissions ...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/submissions") as response:
            res = json.loads(response.read().decode("utf-8"))
            print(f"Submissions Count: {res.get('count')}")
            print("First submission:", res.get("submissions", [])[0] if res.get("submissions") else "None")
            assert res["success"] is True
            print("[OK] /api/submissions passed!")
    except Exception as e:
        print("[FAIL] Submissions test failed:", e)

if __name__ == "__main__":
    test_health()
    test_register()
    test_submissions()
