-- Author: Caden Kroonenberg
-- Date: Octover 30, 2021

-- Main Function
nim :: IO()
nim = play initial 1

-- Board type declaration
type Board = [Int]

-- Initial board state
initial :: Board
initial = [5,4,3,2,1]

-- Main game loop
play :: Board -> Int -> IO()
play b p =  do printBoard b
               if checkWin b then printWin p else do
                   nb <- doMove b p
                   let np = newPlayer p
                   play nb np

-- Function to initialize recursive prints of rows
printBoard :: Board -> IO()
printBoard b = do
                  putChar '\n'
                  printBoardRec b 0

-- Recursive game board print function
printBoardRec :: Board -> Int -> IO()
printBoardRec b i = if i < 5
                      then do
                        let s = formRow (b!!i) i
                        putChar '\n'
                        putStr s
                        printBoardRec b (i+1)
                      else do
                        putStr "\n\n"

-- Creates a string with param n being the # of stars and param i being row index
formRow :: Int -> Int -> [Char]
formRow n i = show (i+1) ++ ": " ++ replicate n '*'

-- New player returns the # of the other player (newPlayer 1 = 2; newPlayer 2 = 1)
newPlayer :: Int -> Int
newPlayer p = if p == 1 then 2 else 1

-- Check if the winning state has been reached
checkWin :: Board -> Bool
checkWin = all zero

-- Print the message that the game has ended (along with who won)
printWin :: Int -> IO()
printWin n = do let p = newPlayer n
                putStr "Player "
                putStr (show p)
                putStrLn " Wins!"

-- True if n == 0
zero :: Int -> Bool
zero n = n == 0

-- IO Function to acquite row #
getRow :: IO Int
getRow = do
            putStr "Enter a row number: "
            x <- getChar
            return (read [x])

-- IO Function to acquire start count
getStars :: IO Int
getStars = do
            putStr "\nStars to remove: "
            x <- getChar
            return (read [x])

-- Get row and star count from player and call function to execute move if valid; else print error and try again
doMove :: Board -> Int -> IO Board
doMove b p = do
              putStr "Player "
              print p
              r <- getRow
              s <- getStars
              if r > 5 || s > b !! (r-1)
                then do
                    putStrLn "\nERROR: Invalid Move"
                    printBoard b
                    doMove b p
                else do
                    return (applyMove b (r-1) s)

-- Execute a players move; Change b[r] to be (b[r] - s)
applyMove :: Board -> Int -> Int -> Board
applyMove b r s = do map (\x -> if x == r then b!!r - s else b!!x) [0..4]