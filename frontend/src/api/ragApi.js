const API_URL = "http://localhost:8000/ask";

export async function askQuestion(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: query })
  });

  const data = await response.json();
  return data;
}