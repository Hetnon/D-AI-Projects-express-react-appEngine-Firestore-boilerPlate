import fs from 'fs';
import path from 'path'
export function jsonTojson(){
    console.log('jsonTojson')
    const inputFilePath = './static/agents_central/agents/menu_items_agent/defineSearchTypesExamples.json'
    const inputFileBaseName = path.basename(inputFilePath, path.extname(inputFilePath));
    console.log('inputFileBaseName', inputFileBaseName)
    const inputFolderName = path.dirname(inputFilePath); 
    console.log('inputFolderName', inputFolderName)
    const outputFilePath = inputFolderName + '/defineQueryExamples.json';
    console.log('outputFilePath', outputFilePath)
    
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading input file:', err);
        return;
      }
    
      try {
        const jsonData = JSON.parse(data);
    
        // Assuming jsonData is an array of objects:
        const newJsonData = jsonData.map(item => {
            let newItem = {
                inputs: item.outputs, // Taking first element of the outputs array
                outputs: [""]
            };
            return JSON.stringify(newItem)
        });
        const formattedJson = `[${newJsonData.join(',\n')}]`;
    
        fs.writeFile(outputFilePath, formattedJson, (err) => {
          if (err) {
            console.error('Error writing output file:', err);
          } else {
            console.log('JSON conversion successful!');
          }
        });
    
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    });
}

jsonTojson();