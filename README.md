# Endpoints

## Create transaction

`POST https://dt-money-api.learntics.com/transactions`

Request body:

```json
{
    "description": "chocolate cake",
    "category": "food",
    "amount": 230,
    "type": "outcome"
}
```

Response:

```json
{
    "transaction": [
        {
            "id": "ff1f445c-d09a-4efd-8967-4a285358557c",
            "description": "Chocolate cake",
            "amount": "230.00",
            "created_at": "2023-07-23T17:16:34.177Z",
            "session_id": "bd739bdc-430e-4cae-b8a2-1fc39fd2eac2",
            "category": "food",
            "type": "outcome"
        }
    ]
}
```

## List transactions

`GET https://dt-money-api.learntics.com/transactions`

Response:

```json
{
    "transaction": [
        {
            "id": "ff1f445c-d09a-4efd-8967-4a285358557c",
            "description": "Chocolate cake",
            "amount": "230.00",
            "created_at": "2023-07-23T17:16:34.177Z",
            "session_id": "bd739bdc-430e-4cae-b8a2-1fc39fd2eac2",
            "category": "food",
            "type": "outcome"
        },
        {
            "id": "3f842d90-f10e-4f02-9774-80351533307e",
            "description": "Pizza",
            "amount": 50,
            "created_at": "2023-07-21 00:36:23",
            "session_id": "e2a6c34d-4db0-4ba7-ab83-6978b669a381",
            "category": "food",
            "type": "outcome"
        },
        {
            "id": "0881b3c9-45a1-48de-b578-23f8a8041151",
            "description": "Salary",
            "amount": 5700,
            "created_at": "2023-07-21 19:25:21",
            "session_id": "e2a6c34d-4db0-4ba7-ab83-6978b669a381",
            "category": "salary",
            "type": "income"
        },
    ]
}
```


# Functional requirements

- [x] The user should be able to create a new transaction
- [x] The user should be able to see the balance
- [x] The user should be able to see all the transactions
- [x] The user should be able to see a specific transaction

# Business requirements

- [x] The transaction can be of type income or outcome
- [x] It must be possible to identify the user of the request
- [x] The user can only see the transactions that he created
