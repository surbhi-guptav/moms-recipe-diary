import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
);

export default API;

export interface Comment {
    user: { _id: string; name: string } | string;
    text: string;
    createdAt: string;
}

export interface Recipe {
    _id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    memoryNote?: string;
    category: string;
    imageUrl?: string;
    createdBy?: string;
    createdAt: string;
    likes: string[];
    comments: Comment[];
}

export async function fetchRecipes(search?: string, category?: string): Promise<Recipe[]> {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (category && category !== 'All') params.append('category', category);

    const url = params.toString() ? `/recipes?${params.toString()}` : '/recipes';
    console.log("Fetching recipes from:", url);
    const res = await API.get(url);
    return res.data
}

export const fetchRecipesWithFilters = async (params: {
    search?: string;
    category?: string;
}) => {
    const res = await API.get("/recipes", { params });
    return res.data;
};

export async function fetchCanCook(ingredients: string[]): Promise<Recipe[]> {
    const res = await API.post("/recipes/can-cook", { ingredients });
    return res.data;
}

export async function fetchMyRecipes(search?: string, category?: string): Promise<Recipe[]> {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (category && category !== 'All') params.append('category', category);

    const url = params.toString() ? `/recipes/mine?${params.toString()}` : '/recipes/mine';
    console.log("Fetching my recipes from:", url);
    const res = await API.get(url);
    return res.data;
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
    const res = await API.get(`/recipes/${id}`);
    return res.data;
}


export async function addRecipe(recipeData: {
    title: string;
    ingredients: string[];
    steps: string[];
    memoryNote?: string;
    category: string;
    imageUrl?: string;
}): Promise<Recipe> {
    const res = await API.post('/recipes', recipeData);
    return res.data;
}

export async function updateRecipe(id: string, recipeData: {
    title: string;
    ingredients: string[];
    steps: string[];
    memoryNote?: string;
    category: string;
    imageUrl?: string;
}): Promise<Recipe> {
    const res = await API.put(`/recipes/${id}`, recipeData);
    return res.data;
}

export async function deleteRecipe(id: string): Promise<{ message: string }> {
    const res = await API.delete(`/recipes/${id}`);
    return res.data;
}

export const toggleLike = async (id: string) => {
    const res = await API.post(`/recipes/${id}/like`);
    return res.data;
};

export const addComment = async (id: string, text: string) => {
    const res = await API.post(`/recipes/${id}/comment`, { text });
    return res.data;
};


