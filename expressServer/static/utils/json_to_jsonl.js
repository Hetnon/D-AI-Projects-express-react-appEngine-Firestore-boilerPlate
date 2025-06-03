import fs from 'fs';
import path from 'path'
export function jsonTojsonl(){
    console.log('jsonTojsonl')
    const inputFilePath = './static/GoogleGemini/chatEntryPointTrainingData.json'
    const inputFileBaseName = path.basename(inputFilePath, path.extname(inputFilePath));
    console.log('inputFileBaseName', inputFileBaseName)
    const inputFolderName = path.dirname(inputFilePath); 
    console.log('inputFolderName', inputFolderName)
    const outputFilePath = inputFolderName + '/' + inputFileBaseName + '.jsonl';
    console.log('outputFilePath', outputFilePath)
    
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading input file:', err);
        return;
      }
    
      try {
        const jsonData = JSON.parse(data);
    
        // Assuming jsonData is an array of objects:
        const jsonlData = jsonData.map(item => {
            let newItem = {
                input_text: item.inputs[0], // Taking first element of the inputs array
                output_text: item.outputs[0] // Taking first element of the outputs array
            };
            return JSON.stringify(newItem)
        }).join('\n');
    
        fs.writeFile(outputFilePath, jsonlData, (err) => {
          if (err) {
            console.error('Error writing output file:', err);
          } else {
            console.log('JSONL conversion successful!');
          }
        });
    
      } catch (err) {
        console.error('Error parsing JSON data:', err);
      }
    });
}

jsonTojsonl();