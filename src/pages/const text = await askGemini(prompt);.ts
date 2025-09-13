const prompt = "Please enter your message:";
const text = await askGemini(prompt);

async function askGemini(prompt: string): Promise<string> {
    // Simulate an async call to a model or API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Gemini response to: ${prompt}`);
        }, 500);
    });
}

