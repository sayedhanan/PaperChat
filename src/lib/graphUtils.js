import fs from 'fs';
import path from 'path';
import { dot, norm } from "mathjs"

import { HuggingFaceTransformersEmbeddings } from 
"@langchain/community/embeddings/huggingface_transformers";

const DIR_PATH = "../data/sample.jsonl";
const filePath = path.join(process.cwd(), DIR_PATH);


function parse_jsonline(filePath) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const lines = raw.split("\n").filter(Boolean);
    const result = lines.map(line => JSON.parse(line));
    return result
}

const data = parse_jsonline(filePath);

function transforming_data(data) {
    const graphData = data.map(d => {
        return {
            title: d.title,
            id: d.id,
            abstract: d.abstract
        };
    });
    return graphData;
}

const graphData = transforming_data(data)

const model = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
  dtype: "fp32",
  device: 'cpu'
});


const res = await model.embedDocuments(graphData.map(obj => obj.abstract));
console.log(res[0])


graphData.forEach((obj, i) => {
    obj.embedding = res[i]
});

console.log(graphData[0]);

const output_path = path.join("../data", "/embeddingData")

fs.writeFileSync(output_path, JSON.stringify(graphData, null, 4), "utf-8")
