import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { JSONLoader } from "langchain/document_loaders/fs/json";

export function getLoader(document: Blob) {
	const fileType = document.type; // MIME type
	const fileExtension = (document as File).name.split(".").pop()?.toLowerCase(); // File extension

	switch (fileType || fileExtension) {
		case "application/pdf":
		case "pdf":
			return new PDFLoader(document, { parsedItemSeparator: " " });
		case "text/plain":
		case "txt":
			return new TextLoader(document);
		case "text/csv":
		case "csv":
			return new CSVLoader(document);
		case "application/json":
		case "json":
			return new JSONLoader(document);
		default:
			throw new Error("Unsupported file type");
	}
}
