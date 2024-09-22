# Take home assignment for Gomboc 

This project consists of React frontend and a Node-Express backend.

### To start the backend:
1. Open terminal 
2. CD into server directory
3. npm install
4. npm run dev

### To start the frontend:
1. Open new terminal 
2. CD into client directory
3. npm install
4. npm start


## API


---

### **1. POST /bets/place**

- **Description**: Place a bet for the current game.
- **Method**: `POST`
- **Endpoint**: `/bets/place`
- **Request Body**:
    ```json
    {
        "bet_amount": 100,  // Amount of the bet
        "guess": 3          // The guess (number between 1 and 6)
    }
    ```
- **Response**:
    - **Success (200 OK)**:
        ```json
        {
            "new_balance": 900,
            "win": true,
            "game_end": false,
            "game_id": 1,
            "dice_roll": 3
        }
        ```
    - **Error (400 Bad Request)**:
        ```json
        {
            "error": "Bet amount exceeds current balance."
        }
        ```
    - **Error (500 Internal Server Error)**:
        ```json
        {
            "error": "An error occurred while placing the bet."
        }
        ```

---

### **2. GET /games/setup**

- **Description**: Set up a new game for the user if no current game exists.
- **Method**: `GET`
- **Endpoint**: `/games/setup`
- **Request Body**: None
- **Response**:
    - **Success (200 OK)**:
        ```json
        {
            "game_id": 1,
            "user_id": 1,
            "balance": 1000
        }
        ```
    - **Error (500 Internal Server Error)**:
        ```json
        {
            "error": "User not found."
        }
        ```

---

### **3. PATCH /games/reset**

- **Description**: Reset the current game and start a new one. Resets the user's balance to 1000.
- **Method**: `PATCH`
- **Endpoint**: `/games/reset`
- **Request Body**: None
- **Response**:
    - **Success (200 OK)**:
        ```json
        {
            "new_game_id": 2,
            "balance": 1000
        }
        ```
    - **Error (500 Internal Server Error)**:
        ```json
        {
            "error": "An error occurred while resetting the game."
        }
        ```

---

### **4. GET /history/games**

- **Description**: Fetches the user's game history.
- **Method**: `GET`
- **Endpoint**: `/history/games`
- **Request Body**: None
- **Response**:
    - **Success (200 OK)**:
        ```json
        {
            "game_history": [
                {
                    "game_id": 1,
                    "time": "2023-09-21T12:30:00.000Z",
                    "current_game": false,
                    "bets": [
                        {
                            "id": 1,
                            "game_id": 1,
                            "time": "2023-09-21T12:35:00.000Z",
                            "bet_amount": 100,
                            "start_balance": 1000,
                            "end_balance": 900,
                            "win": false
                        }
                    ]
                }
            ]
        }
        ```
    - **Error (404 Not Found)**:
        ```json
        {
            "error": "No games found for this user."
        }
        ```

---

## How to Use This API

1. **Placing a Bet**: Make a `POST` request to `/bets/place` with a JSON body containing `bet_amount` and `guess`.
2. **Setting Up a Game**: Make a `GET` request to `/games/setup` to create a new game if no current game exists.
3. **Resetting a Game**: Make a `PATCH` request to `/games/reset` to end the current game and reset the balance.
4. **Viewing Game History**: Make a `GET` request to `/history/games` to retrieve the user's game history.
