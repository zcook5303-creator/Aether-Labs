import requests
import sys
import json
from datetime import datetime

class AetherLabsAPITester:
    def __init__(self, base_url="https://aetherlabs-chat.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_chat_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "api/", 200)

    def test_create_chat(self):
        """Test creating a new chat"""
        success, response = self.run_test(
            "Create Chat",
            "POST", 
            "api/chats",
            200,
            data={"title": "Test Chat"}
        )
        if success and 'id' in response:
            self.created_chat_id = response['id']
            print(f"   Created chat ID: {self.created_chat_id}")
        return success

    def test_get_chats(self):
        """Test getting all chats"""
        return self.run_test("Get All Chats", "GET", "api/chats", 200)

    def test_get_specific_chat(self):
        """Test getting a specific chat"""
        if not self.created_chat_id:
            print("❌ No chat ID available for testing")
            return False
        
        return self.run_test(
            "Get Specific Chat",
            "GET",
            f"api/chats/{self.created_chat_id}",
            200
        )

    def test_send_message(self):
        """Test sending a message to chat"""
        if not self.created_chat_id:
            print("❌ No chat ID available for testing")
            return False
        
        success, response = self.run_test(
            "Send Message",
            "POST",
            f"api/chats/{self.created_chat_id}/messages",
            200,
            data={"content": "Hello, this is a test message"}
        )
        
        if success:
            print("   ⏳ Waiting for AI response...")
            # Wait a bit for AI processing
            import time
            time.sleep(3)
            
            # Check if chat was updated with AI response
            chat_success, chat_data = self.run_test(
                "Verify AI Response",
                "GET",
                f"api/chats/{self.created_chat_id}",
                200
            )
            
            if chat_success and 'messages' in chat_data:
                messages = chat_data['messages']
                if len(messages) >= 2:
                    print(f"   ✅ Found {len(messages)} messages (user + AI)")
                    return True
                else:
                    print(f"   ❌ Expected at least 2 messages, found {len(messages)}")
                    return False
        
        return success

    def test_delete_chat(self):
        """Test deleting a chat"""
        if not self.created_chat_id:
            print("❌ No chat ID available for testing")
            return False
        
        return self.run_test(
            "Delete Chat",
            "DELETE",
            f"api/chats/{self.created_chat_id}",
            200
        )

def main():
    print("🚀 Starting Aether Labs API Tests...")
    print("=" * 50)
    
    tester = AetherLabsAPITester()
    
    # Test sequence
    tests = [
        ("API Root", tester.test_api_root),
        ("Create Chat", tester.test_create_chat),
        ("Get All Chats", tester.test_get_chats),
        ("Get Specific Chat", tester.test_get_specific_chat),
        ("Send Message & AI Response", tester.test_send_message),
        ("Delete Chat", tester.test_delete_chat)
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            tester.tests_run += 1
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())