// Author: Caden Kroonenberg
// Date: 12-6-21

// CREATE SERVER
const {createServer} = require("http");
const methods = Object.create(null);
createServer((request, response) => {
    let handler = methods[request.method] || notAllowed; // If method cannot be handled, call notAllowed() to handle the situation
    handler(request)
    .catch(error => { // Catch and handle any errors
        if (error.status != null) return error;
        return {body: String(error), status: 500};
    })
    .then(({body, status = 200, type = "text/plain"}) => { // Display contents of "current" file (starting with base directory)
        response.writeHead(status, {"Content-Type": type});
        if (body && body.pipe) body.pipe(response);
        else response.end(body);
    });
}).listen(8000); // Listen on port 8000
console.log("http://localhost:8000/")

async function notAllowed(request) { // Function to handle requests that the server cannot handle (POST, HEAD, etc.)
    return {
        status: 405,
        body: `Method ${request.method} not allowed.\n`
    };
}

var {parse} = require("url");
var {resolve, sep} = require("path");

var baseDirectory = process.cwd(); // Directory Node is started from

function urlPath(url) {
    let {pathname} = parse(url);
    let path = resolve(decodeURIComponent(pathname).slice(1));
    if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) { // If path goes somewhere not within the base directory ...
        throw {status: 403, body: "Forbidden"}; // Return 403 status and display "Forbidden"
    }
    return path;
}

const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const { exit } = require("process");
const mime = require("mime");

methods.GET = async function(request) {
    let path = urlPath(request.url);
    console.log(request.url); // Print where file server is pointing to
    let stats;
    try {
        stats = await stat(path); // Fetch information about the file
    } catch (error) {
        if (error.code != "ENOENT") { // Ignore "File Doesn't Exist" error, throw all other errors
            throw error;
        }
        else {
            return {status: 404, body: "File not found"}; // File does not exist - return 404 status and display "File not found"
        }
    }
    if (stats.isDirectory()) { // If path points to a directory ...
        return {body: (await readdir(path)).join("\n")}; // ... display the directory
    } else { // If path points to a file ... 
        return {body: createReadStream(path), type: mime.getType(path)}; // ... display the contents of the file
    }
};

// PUT
const {createWriteStream} = require("fs");
function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        from.on("error", reject); // Have stream fire error if something goes wrong when opening file
        to.on("error", reject); // If stream from request fails, reject promise
        to.on("finish", resolve); // When pipe is done, fire "finish event" -> Resolve promise
        from.pipe(to); // Set "from"'s pipe to "to"
    });
}

methods.PUT = async function(request) {
    let path = urlPath(request.url); // Path of request file
    await pipeStream(request, createWriteStream(path)); // Allow pipestream to handle writing file
    let stats;
    try {
        stats = await stat(path);  // Fetch information about the file
    } catch (error) { // Handle error if one occurs
        throw error;
    }
    if (stats.isDirectory()) {
        console.log("\nCreated folder: " + path);
    } else {
        console.log("\nCreated file: " + path);
    }
    return {status: 204};
};

// DELETE
const fs = require("fs");
const http = require("http");
methods.DELETE = async function(request) { // This function deletes the file or directory the request's path points to (if it exists)
    let path = urlPath(request.url);
    let stats;
    try {
        stats = await stat(path);  // Fetch information about the file
    } catch (error) { // Handle error if one occurs
        if (error.code != "ENOENT") { // If the error is not a "file does not exist" error, throw it.
            throw error;
        } else {
            return {status: 204}; // If the file doesn't exist (error.code == "ENOENT"), return a status of 204
        } 
    }
    if (stats.isDirectory()) { // if the path leads to a directory, remove it
        // await rmdir(path);
        fs.rmdir(path, (err => { // the path leads to a folder, remove it
            if (err) console.log(err);
            else {
              console.log("\nDeleted folder: " + path);
            }
        }));
    } else {
        // await unlink(path); // the path leads to a file, remove it
        // await fs.unlink(path); 
        fs.unlink(path, (err => { // the path leads to a file, remove it
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: " + path);
            }
        }));
    }
    return {status: 204}; // Return a status of 204
};

// MKCOL
const {mkdir} = require("fs").promises;
methods.MKCOL = async function(request) {
  let path = urlPath(request.url); // Path to new folder
  let stats; // Var to store stats object for path
  try {
    stats = await stat(path); // Fetch information about the file
  } catch (error) {
    if (error.code != "ENOENT") throw error; // Throw error if it isn't a "File Doesn't Exist" error
    fs.mkdir(path, (err => { // Create a directory at path
        if (err) console.log(err); // Print error if one occurs during mkdir process
        else {
          console.log("\nCreated folder: " + path); // Confirm successful mkdir operation
        }
    }));
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "Not a directory"}; // If a file exists at the path, return error code 400
};
