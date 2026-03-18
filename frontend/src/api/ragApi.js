const API_URL = "https://supreme-robot-699ggvrxjxpphx4q9-8000.app.github.dev/ask";

export async function askQuestion(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: query }) 
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}