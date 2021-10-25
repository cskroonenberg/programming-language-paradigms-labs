-- Author: Caden Kroonenberg
-- Date: October 18, 2021

-- replicate takes a integer, n, and a value, x, and returns a List of length n containing x
replicate :: Int -> a -> [a]
replicate n x = [x | n <- [1..n]] -- iterate n times, adding an x element to the returned list each time

-- factors takes a integer, n, and returns a list of it's factors (not including itself)
factorsExclusive :: Int -> [Int]
factorsExclusive n = [x | x <- [1..n-1], n `mod` x == 0]

-- perfects returns all numbers from 1 to n where the sum of the number's factors (not including itself) is the number
perfects :: Int -> [Int]
perfects n = [x | x <- [1..n], x == sum(factorsExclusive x)]

-- based on the parameter, a, adds the second element b in a list of tuples in the form (a,b)
find :: Eq a => a -> [(a,b)] -> [b]
find k t = [v | (k',v) <-t, k==k'] -- Add v to the returned list if it's k matches the parameter k

-- Return a list from 0 .. n - 1; ex. idxList 3 = [0,1,2]
idxList :: [a] -> [Int]
idxList xs = [x | x <- [0..(length xs - 1)]]

-- Zip a list of values with it's indices; ex. idxZip [a,b,c] = [(a,0),(b,1),(c,2)]
idxZip :: [a] -> [(a,Int)]
idxZip xs = zip xs (idxList xs)

-- Returns the list of positions where parameter n is found in a list; ex. positions 1 [0,1,2,1,0] = [1,3]
positions :: Eq a => a -> [a] -> [Int]
positions n xs = find n (idxZip xs) -- Find the parameter n in a list of (element,index) pairs

-- Returns the scalar product of two lists of integers xs and ys of length n is given by the sum of the products of the corresponding integers
scalarproduct :: [Int] -> [Int] -> Int
scalarproduct xs ys = sum [x*y | (x,y) <- zip xs ys] -- Zip both lists together and multiply each pair to get products, the return the sum