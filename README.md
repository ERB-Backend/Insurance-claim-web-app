API doc by steve v1.0.01 2024-06-25

1.01 allClaims
Method: Get
Parameter 
sortByCreatedAt: 1 ascending |  -1 descending order (if omit default -1)
returnJson: 0 or 1 (if omit default 0)
URL example
http://127.0.0.1:3000/users/allClaims
http://127.0.0.1:3000/users/allClaims?sortByCreatedAt=-1
http://127.0.0.1:3000/users/allClaims?returnJson=1

http://127.0.0.1:3000/users/allClaims?sortByCompanyName=-1
http://127.0.0.1:3000/users/allClaims?sortByPolicyNumber=-1
http://127.0.0.1:3000/users/allClaims?sortByAmount=-1
http://127.0.0.1:3000/users/allClaims?sortByStatus=-1

Output:
[{"_id":"667a8375e9239cdb75cc7959","userId":"steve","companyName":"Sun","policyNumber":226,"amount":8888,"status":"approved","createdAt":"2024-06-25T08:49:53.982Z"},{"_id":"667a72aee34223b8037b3dd3","userId":"steve","companyName":"AIA","policyNumber":401,"amount":5559,"status":"new","createdAt":"2024-06-25T08:35:51.728Z"},{"_id":"667a73781a7c70d142ad63cb","userId":"steve","companyName":"Manulife","policyNumber":402,"amount":6666,"status":"new","createdAt":"2024-06-25T08:35:51.728Z"}]


claimsByUserId
Method : Get
Parameter 
sortByCreatedAt: 1 ascending |  -1 descending order  (if omit default -1)
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:3000/users/claimsByUserId?userId=steve&sortByCreatedAt=-1
 

Output:
[
  {
    "_id": "6683bc9c3379b5e253c83e12",
    "userId": "steve",
    "companyName": "AIA",
    "policyNumber": 412,
    "amount": 1241,
    "status": "new",
    "createdAt": "2024-07-02T08:36:02.778Z",
    "userName": "steve lee"
  },
  {
    "_id": "6683bca63379b5e253c83e14",
    "userId": "steve",
    "companyName": "AIA",
    "policyNumber": 412,
    "amount": 1241,
    "status": "new",
    "createdAt": "2024-07-02T08:36:02.778Z",
    "userName": "steve lee"
  }]



claimByObjectId
Method : Get
URL example :
http://127.0.0.1:3000/users/claimByObjectId?objectId=667a8375e9239cdb75cc7959
Output:
{"_id":"667a8375e9239cdb75cc7959","userId":"steve","companyName":"Sun","policyNumber":226,"amount":8888,"status":"approved","createdAt":"2024-06-25T08:49:53.982Z"}

claimsByPolicyNumber
Method : Get
Parameter 
sortBypolicyNumber: 1 ascending |  -1 descending order
URL example :
http://127.0.0.1:3000/users/claimsByPolicyNumber?policyNumber=9405822&sortByPolicyNumber=1
Output:
[{"_id":"667685b8ed02ff91f348a66c","policyNumber":9405822,"amount":1250,"status":"submitted","createdAt":"2024-06-22T08:05:12.436Z","updatedAt":"2024-06-22T08:05:12.436Z"}]

claimByObjectIdUpdate
URL example :
http://127.0.0.1:3000/users/claimByObjectIdUpdate?objectId=667a8375e9239cdb75cc7959&userId=steve&companyName=Sun&policyNumber=226&amount=8888&status=approved
Output:
{"_id":"667a8375e9239cdb75cc7959","userId":"steve","companyName":"Sun","policyNumber":226,"amount":8888,"status":"approved","createdAt":"2024-06-25T08:49:53.982Z"}

claimsByPolicyNumberUpdate  (need modify last object)
URL example :
http://127.0.0.1:3000/users/claimsByPolicyNumberUpdate?policyNumber=401&userId=steve&companyName=AIA&newPolicyNumber=401&amount=5559&status=new
Output:
{"_id":"667a72aee34223b8037b3dd3","userId":"steve","companyName":"AIA","policyNumber":401,"amount":5559,"status":"new","createdAt":"2024-06-25T08:35:51.728Z"}

claimInsert
URL example :  (amount value could not be the same)
http://127.0.0.1:3000/users/claimInsert?userId=steve&companyName=AIA&policyNumber=412&amount=1241
Output:
[{"userId":"steve","companyName":"AIA","policyNumber":412,"amount":1241,"status":"new","createdAt":"2024-06-25T08:44:32.314Z","_id":"667a8375e9239cdb75cc7959","__v":0}]

claimByObjectIdDelete
URL example :
http://127.0.0.1:3000/users/claimByObjectIdDelete?objectId=667685b8ed02ff91f348a66f
Output:
{"_id":"667685b8ed02ff91f348a66f","userId":"steve","amount":8888,"status":"approved","createdAt":"2024-06-25T07:53:33.333Z"}


allUsers
Parameter 
sortByUserId: 1 ascending |  -1 descending order  (if omit default 1)
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:3000/users/allUsers
http://127.0.0.1:3000/users/allUsers?sortByUserId=1
http://127.0.0.1:3000/users/allUsers?returnJson=1
Output:
[{"_id":"667685a011c6ac2e08224027","name":"John Doe","email":"john.doe@example.com","photo":"https://example.com/john.jpg","passwordConfirm":"password123","createdAt":"2024-06-22T08:04:48.867Z","updatedAt":"2024-06-22T08:04:48.867Z","__v":0}]




userByUserId
Parameter 
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:3000/users/userByUserId?userId=steve

Output
{
  "_id": "667685a011c6ac2e08224027",
  "name": "John3",
  "email": "john.doe@example.com",
  "photo": "https://example.com/john.jpg",
  "password": "password123",
  "passwordConfirm": "password123",
  "userId": "steve"
}




userByUserIdUpdate
Parameter 
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:3000/users/userByUserIdUpdate?email=john.doe@example.com&name=John3
Output
{
  "acknowledged": true,
  "modifiedCount": 0,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}


