# TopoBERT: A Visual Tool for Exploring Word Representations from Fine-Tuned Transformer Models

TopoBERT is a visual analytics tool for analyzing intermediate representations for transformer models such as BERT fine-tuned on specific tasks using tools from Topological Data Analysis.
The system allows users to interactively explore the fine-tuning process and change parameters of the visualization algorithm.
TopoBERT is aimed at NLP practitioners who want to explore the fine-tuning process of transformer models and for linguistic experts interested in understanding the lexical, synactic, and semantic concepts captured by the model.

## Requirements
TopoBERT requires python 3.6 and node.js 8.11.0 or higher.

## Data Loading
 * Go to the folder ```backend```
 * Create a folder ```data```
 * Download all datasets from https://drive.google.com/drive/folders/1va-BA6DPkWqt5tke7kDM3U8iDh9hJTw-?usp=sharing 
 * Extract and put the datasets under the foler  ```data/```

## Installation
Start the server

```bash
pip install -r requirements.txt
cd backend/server
python -m flask run
```

Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the browser and navigate to the URL provided by the server (typically http://localhost:3000).
