const fs = require('fs')
const path = require('path')
// Set the folder path where the SVG files are located
const folderPath = process.argv[2]

// Check if the folder path argument is provided
if (!folderPath) {
    console.log('Folder path argument is missing.');
    console.log('Usage: node script.js <folder-path>');
    process.exit(1);
}

// Check if the folder exists
if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`)
    process.exit(1)
}

// Get all SVG files in the folder
const svgFiles = getAllSvgFiles(folderPath)
// Iterate over each SVG file
svgFiles.forEach((file) => {
    // Read the SVG file
    const content = fs.readFileSync(file, 'utf8')

    // Check if the file has width and height attributes
    const widthMatch = content.match(/width="([^"]+)"/)
    const heightMatch = content.match(/height="([^"]+)"/)

    if (widthMatch && heightMatch) {
        const width = widthMatch[1]
        const height = heightMatch[1]

        // Check if the viewBox attribute is missing
        if (!content.includes('viewBox')) {
            // Add the viewBox attribute
            const viewBoxContent = `viewBox="0 0 ${width} ${height}"`
            const modifiedContent = content.replace(/<svg/, `<svg ${viewBoxContent}`)

            // Write the modified content back to the file
            fs.writeFileSync(file, modifiedContent)
            console.log(`Added viewBox attribute to: ${file}`)
        }
    }
})

function getAllSvgFiles(folderPath) {
    const svgFiles = []

    function traverseDirectory(currentPath) {
        const files = fs.readdirSync(currentPath)

        files.forEach((file) => {
            const filePath = path.join(currentPath, file)
            const stats = fs.statSync(filePath)

            if (stats.isDirectory()) {
                traverseDirectory(filePath) // Recursively traverse subdirectories
            } else if (stats.isFile() && path.extname(filePath) === '.svg') {
                svgFiles.push(filePath)
            }
        })
    }

    traverseDirectory(folderPath)

    return svgFiles
}
