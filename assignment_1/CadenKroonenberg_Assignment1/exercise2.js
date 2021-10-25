// Author: Caden Kroonenberg
// Date: 08-31-21

// Exercise 2.1
console.log('########## Exercise 2.1 ##########')
for (let i = 1; i < 9; i++) { // Iterate through each row of triangle
    // Create fresh output string var, row_output
    let row_output =''
    for (let j = 0; j < i; j++) { // Concatenate i stars to the output string, where i = the row #
        // Concatenate star
        row_output += '*'
    }
    // Print output string
    console.log(row_output)
}

// Exercise 2.2
console.log('\n########## Exercise 2.2 ##########')
for (let i = 1; i < 101; i++) { // Iterate from 1-100
    if (i % 35 == 0) { // If i is divisible by 5 and 7, print this fact
        console.log('Divisible by both 5 and 7')
    } else if (i % 5 == 0) { // If i is divisible by 5, but not 7, print this fact
        console.log('Divisible by 5, but not 7')
    } else if (i % 7 == 0) { // If i is divisible by 7, but not 5, print this fact
        console.log('Divisible by 7, but not 5')
    } else { // If i is not divisible by 5 or 7, print i
        console.log(i)
    }
}

// Exercise 2.3
console.log('\n########## Exercise 2.3 ##########')
function ex_2_3(size) {
    console.log(`Size = ${size}`) // Print size
    let output = '' // Initialize output string
    for (let i = 0; i < size; i++) { // Iterate through size
        if (i % 2 == 0) { // Start every other row with ' ', starting with the first row
            output += ' '
        }
        for (let j = 0; j < size - 1; j++) { // Concatenate size - 1 characters to the row
            // Alternate between '*' and ' ' characters, starting with '*'
            if (j % 2 == 0) {
                output += '*'
            } else {
                output += ' '
            }
        }
        if (i % 2 == 1) { // End every other row with ' ' or '*', starting with the second row
            if (size % 2 == 0) { // End row with ' ' if size is even
                output += ' '
            } else { // End row with '*' if size is odd
                output += '*'
            }
        }

        if (i != size - 1) { // End all rows with a newline, except for the last line
            output += '\n'
        }
    }
    console.log(output) // Print output
}
ex_2_3(5) // Execute exercise 2.3 for size 5
ex_2_3(10) // Execute exercise 2.3 for size 10