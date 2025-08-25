import { dot, norm } from "mathjs";
import path from "path";
import fs from "fs";

// ---- Step 1: Load Embeddings ----
const dirPath = "../data/embeddingData.json";
const filePath = path.join(process.cwd(), dirPath);
const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);
console.log("Docs:", data.length);

// ---- Step 2: Cosine Similarity ----
function cosine_similarity(a, b) {
    const dot_product = dot(a, b);
    const normalization = norm(a) * norm(b);
    return dot_product / normalization;
}

// ---- Step 3: Build Full Graph (All Pairwise Links Over Threshold) ----
function compute_full_similarity_graph(data, minThreshold = 0.3) {
    const graph = {
        nodes: data.map(doc => ({ id: doc.id })),
        links: []
    };

    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const docA = data[i];
            const docB = data[j];

            const score = cosine_similarity(docA.embedding, docB.embedding);

            if (score >= minThreshold) {
                graph.links.push({
                    source: docA.id,
                    target: docB.id,
                    similarity: score
                });
            }
        }
    }

    return graph;
}

// ---- Step 4: Save to File ----
function saveGraphToFile(graph, filename = "graph.json") {
    const outputPath = path.join(process.cwd(), filename);
    fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2));
    console.log("✅ Saved full graph to:", outputPath);
}

// ---- Step 5: Run ----
const similarityThreshold = 0.3; // adjust as needed
const fullGraph = compute_full_similarity_graph(data, similarityThreshold);
saveGraphToFile(fullGraph);
