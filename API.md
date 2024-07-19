API doc by steve v1.0.03  2024-07-19


1.0 allClaims
Method: Get
Parameter 
1 ascending |  -1 descending order
sortByCreatedAt default 1
sortByPolicyNumber default 1
sortByAmount default 1
sortByStatus default 1
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/admin/allClaims?sortByCreatedAt=-1&returnJson=1
http://127.0.0.1:1234/admin/allClaims?sortByPolicyNumber=-1&returnJson=1
http://127.0.0.1:1234/admin/allClaims?sortByAmount=1&returnJson=1
http://127.0.0.1:1234/admin/allClaims?sortByStatus=1&returnJson=1
Output:
[
  {
    "_id": "668f5ffc71be094fd33af9f2",
    "userId": "6688058db58ce72799586539",
    "policyNumber": 123456,
    "amount": 111111,
    "status": "pending",
    "messages": [
      {
        "status": "pending",
        "date": "2024-07-11T04:30:52.294Z"
      }
    ],
    "documents": [
      
    ],
    "createdAt": "2024-07-11T04:30:52.293Z",
    "updatedAt": "2024-07-11T04:30:52.293Z",
    "__v": 0,
    "userName": "steve"
  },
 …..
]
1.1.1 claimByObjectId
Method : Get
Parameter 
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/admin/claimByObjectId?objectId=668f60a271be094fd33af9f3&returnJson=1
Output:
{
  "_id": "669499b9f1ceec7affa6a903",
  "userId": "6688058db58ce72799586539",
  "claimNumber": 2024071141438,
  "policyNumber": 1414,
  "amount": 1111,
  "status": "pending",
  "incurredDate": "2024-07-07T00:00:00.000Z",
  "documents": [
    {
      "path": "upload/claim/user-steve-1721014713267.javascript}"
    },
    {
      "path": "upload/claim/user-steve-1721014713268.javascript}"
    }
  ],
  "messages": [
    {
      "status": "pending",
      "date": "2024-07-15T03:38:33.275Z"
    }
  ],
  "createdAt": "2024-07-15T03:38:33.275Z",
  "updatedAt": "2024-07-15T03:38:33.275Z",
  "__v": 0
}
1.1.2 claimByObjectIdUpdateStatus
URL example :
http://127.0.0.1:1234/admin/claimByObjectIdUpdateStatus?objectId=66952686f29eaf41416d61da&status=approved
Output:
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
1.1.3 claimByObjectIdDelete
Method : Get
URL example :
http://127.0.0.1:1234/admin/claimByObjectIdDelete?objectId=668f5ffc71be094fd33af9f2
Output:
{
  "_id": "668f5ffc71be094fd33af9f2",
  "userId": "6688058db58ce72799586539",
  "policyNumber": 123456,
  "amount": 111111,
  "status": "approved",
  "messages": [
    {
      "status": "pending",
      "date": "2024-07-11T04:30:52.294Z"
    }
  ],
  "documents": [
    
  ],
  "createdAt": "2024-07-11T04:30:52.293Z",
  "updatedAt": "2024-07-16T12:01:24.297Z",
  "__v": 0
}


1.2.1 claimsByUserId
Method : Get
Parameter 
1 ascending |  -1 descending order
sortByCreatedAt default 1
sortByPolicyNumber default 1
sortByAmount default 1
sortByStatus default 1
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/users/claimsByUserId?useriD=6688058db58ce72799586539&sortByCreatedAt=-1&returnJson=1
http://127.0.0.1:1234/users/claimsByUserId?useriD=6688058db58ce72799586539&sortByPolicyNumber=-1&returnJson=1
http://127.0.0.1:1234/users/claimsByUserId?useriD=6688058db58ce72799586539&sortByAmount=-1&returnJson=1
http://127.0.0.1:1234/users/claimsByUserId?useriD=6688058db58ce72799586539&sortByStatus=-1&returnJson=1

Output:
[
  {
    "_id": "6694db3a4bc299c2507c9b4a",
    "userId": "6688058db58ce72799586539",
    "policyNumber": 123455,
    "amount": 123113,
    "status": "pending",
    "messages": [
      {
        "status": "pending",
        "date": "2024-07-15T08:18:02.196Z"
      }
    ],
    "createdAt": "2024-07-15T08:18:02.196Z",
    "updatedAt": "2024-07-15T08:18:02.196Z",
    "userName": "steve"
  },
]

1.3.1  claimsByPolicyNumber
Method : Get
Parameter 
sortBypolicyNumber: 1 ascending |  -1 descending order
URL example :
http://127.0.0.1:1234/users/claimsByPolicyNumber?policyNumber=20240715&sortByPolicyNumber=1
Output: Json Default
[
  {
    "_id": "66952686f29eaf41416d61da",
    "userId": "6694f269adfe79f3d516672d",
    "policyNumber": 20240715,
    "amount": 500,
    "status": "approved",
    "messages": [
      {
        "status": "pending",
        "date": "2024-07-15T13:39:18.094Z"
      }
    ],
    "createdAt": "2024-07-15T13:39:18.093Z",
    "updatedAt": "2024-07-16T03:59:17.801Z"
  }
]


2.0 allUsers
Parameter 
1 ascending |  -1 descending order
sortByUserId default 1
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/users/allUsers?sortByUserId=-1
Output: Json Default
 [ {
    "_id": "6688058db58ce72799586539",
    "userId": "steve",
    "name": "steve",
    "passwordConfirm": "1",
    "createdAt": "2024-07-05T14:39:09.442Z",
    "updatedAt": "2024-07-10T01:32:15.461Z",
    "__v": 0
  },
]


2.1.1 userByUserId
Parameter 
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/users/userByUserId?userId=steve
Output: Json Default
{
  "_id": "6688058db58ce72799586539",
  "userId": "steve",
  "name": "steve",
  "password": "1",
  "passwordConfirm": "1"
}

2.1.2 userByUserIdUpdateName
Parameter 
returnJson: 0 or 1 (if omit default 0)
URL example :
http://127.0.0.1:1234/users/userByUserIdUpdateName?userId=may3&name=may4
Output: Json Default
{
  "acknowledged": true,
  "modifiedCount": 0,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 0
}



