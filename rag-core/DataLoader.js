/**
 * Custom Class that extends LangChain Document Class.
 * Turns Data into LangChain styel Documents.
 * filePath: jsonline file path, funciton to read this format is hardcoded into the function.
 * Args: mode: "complete", and "abstract"
 * Returns Object like Data with pageContent, and metadata
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSONLinesLoader } from "langchain/document_loaders/fs/json";
import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";

// Dataset path
const BASE_DIR = "/kaggle/input/sample-dataset"; //Directory in which data is present.
const FILE_NAME = "sample.jsonline";         // Data File
const FILE_PATH = path.join(BASE_DIR, FILE_NAME); // Creating a Complete path.

console.log("File path:", FILE_PATH);

class CustomDataLoader extends BaseDocumentLoader {
  /**
   * @param {string} filePath
   * @param {"abstract"|"complete"} mode
   */
  constructor(filePath, mode = "abstract") {
    super();
    this.filePath = filePath;
    this.mode = mode;
  }

  async load() {
    try {

     // Reading JSONlines data format.
      const raw = await fs.readFile(this.filePath, "utf-8");
      const lines = raw.split("\n").filter(Boolean);

      const docs = lines.map((line, index) => {
        try {
          const item = JSON.parse(line);
          return new Document({
            // map complete -> markdown, abstract -> abstract
            pageContent:
              this.mode === "complete"
                ? item.markdown || ""
                : item.abstract || "",
            metadata: {
              id: item.id,
              title: item.title,
              link: item.link,
              authors: item.authors,
              level: this.mode,
              _line: index,
              _source: this.filePath,
            },
          });
        } catch (parseError) {
          console.warn(`Failed to parse line ${index}:`, parseError.message);
          return null;
        }
      }).filter(Boolean);

      console.log(`Loaded ${docs.length} documents successfully`);
      return docs;
    } catch (error) {
      console.error("Error loading file:", error.message);
      throw error;
    }
  }
}

export default CustomDataLoader;
export { FILE_PATH };
