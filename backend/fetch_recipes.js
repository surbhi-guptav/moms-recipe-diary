// fetch_recipes.js
async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/recipes');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

run();
