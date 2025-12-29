const recipes = [
{"_id":"694e9a3276a139ece96faf77","title":"Mixed Veg Upma","ingredients":["Semolina","Mustard seeds","Onion","Carrot","Peas","Water","Salt","Cilantro"],"category":"Daily"},
{"_id":"694e9a3276a139ece96faf76","title":"Lemon Mint Mocktail","ingredients":["Lemon juice","Mint leaves","Sugar","Soda","Ice"],"category":"Festival"},
{"_id":"694e9a3276a139ece96faf6e","title":"Aloo Gobi","ingredients":["2 cups cauliflower florets","2 medium potatoes, diced","2 tbsp vegetable oil","1 tsp cumin seeds","1 onion, finely chopped","1 tomato, chopped","1 tsp turmeric powder","1 tsp coriander powder","1 tsp garam masala","Salt to taste","Fresh cilantro for garnish"],"category":"Daily"},
{"_id":"694e9a3276a139ece96faf6f","title":"Pav Bhaji","ingredients":["2 tbsp butter","1 cup boiled mixed vegetables","1 onion, finely chopped","1 capsicum, chopped","2 tomatoes, pureed","1 tbsp pav bhaji masala","1/2 tsp turmeric","Salt to taste","8 pav buns","Lemon wedges and cilantro"],"category":"Festival"},
{"_id":"694e9a3276a139ece96faf70","title":"Mango Lassi","ingredients":["1 cup mango pulp","1 cup yogurt","1/2 cup milk","2 tbsp sugar","Ice cubes","Pinch of cardamom"],"category":"Festival"}
];

function testMatch(userInputs) {
    console.log(`\nTesting with inputs: ${JSON.stringify(userInputs)}`);
    const userIngredients = userInputs.map(i => i.toLowerCase().trim());

    const validRecipes = recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());

      return userIngredients.every(userIng =>
        recipeIngredients.some(recipeIng => recipeIng.includes(userIng))
      );
    });

    console.log(`Found ${validRecipes.length} matches.`);
    validRecipes.forEach(r => console.log(` - ${r.title}`));
}

testMatch(["tomato"]);
testMatch(["1 cup mango pulp", "1 cup yogurt", "1/2 cup milk"]);
testMatch(["mango"]);
