import { dot, norm } from "mathjs";
import path from "path";
import fs from "fs";

const dirPath = "../data/embeddingData.json";
const filePath = path.join(process.cwd(), dirPath);

const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);
console.log("Docs:", data.length);


function cosine_similarity(a, b) {
    const dot_product = dot(a, b);
    const normalization = norm(a) * norm(b);
    return dot_product / normalization;
}

function precompute_similarity(data, minThreshold) {
    const storage = {};

    for (let i = 0; i < data.length; i++) {
        storage[data[i].id] = []; // init empty list of neighbors
    }

    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const docA = data[i];
            const docB = data[j];

            const score = cosine_similarity(docA.embedding, docB.embedding);

            if (score >= minThreshold) {
                storage[docA.id].push({ id: docB.id, similarity: score });
                storage[docB.id].push({ id: docA.id, similarity: score }); // opposite direction
            }
        }
    }

    return storage;
}

const result = precompute_similarity(data, 0.3);
console.log(result);

const emb1 = [-0.04, -0.03, 0.07];
const emb2 = [-0.02, -0.01, 0.05];

console.log("Test sim:", cosine_similarity(emb1, emb2));