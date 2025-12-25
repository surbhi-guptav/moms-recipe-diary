/*
  # Mom's Recipe Diary - Initial Schema

  ## Overview
  Creates the foundational database structure for storing family recipes, memories, and traditions.

  ## New Tables
  
  ### `recipes`
  Stores the main recipe information including title, description, and memory story
  - `id` (uuid, primary key) - Unique identifier for each recipe
  - `title` (text) - Name of the recipe
  - `description` (text) - Short description or tagline
  - `category` (text) - Category: "Mom's Special", "Traditional", "Festival", or "Daily"
  - `image_url` (text) - URL to recipe image
  - `memory_story` (text) - Personal memory or story behind the recipe
  - `prep_time` (text) - Preparation time (e.g., "30 minutes")
  - `cook_time` (text) - Cooking time
  - `servings` (text) - Number of servings
  - `created_at` (timestamptz) - When the recipe was added
  - `updated_at` (timestamptz) - Last update timestamp

  ### `ingredients`
  Stores ingredients for each recipe
  - `id` (uuid, primary key) - Unique identifier
  - `recipe_id` (uuid, foreign key) - Links to recipes table
  - `ingredient` (text) - Ingredient description (e.g., "2 cups flour")
  - `order_index` (integer) - Order in the ingredients list
  - `created_at` (timestamptz) - Timestamp

  ### `steps`
  Stores cooking steps/instructions for each recipe
  - `id` (uuid, primary key) - Unique identifier
  - `recipe_id` (uuid, foreign key) - Links to recipes table
  - `step_description` (text) - Instruction text
  - `order_index` (integer) - Step number
  - `created_at` (timestamptz) - Timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access (for viewing recipes)
  - Restrict write operations (for now, allowing inserts for demo purposes)

  ## Notes
  - Uses soft, warm approach to data modeling
  - Designed to preserve family memories with care
  - All timestamps use timestamptz for proper timezone handling
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'Daily',
  image_url text DEFAULT '',
  memory_story text DEFAULT '',
  prep_time text DEFAULT '',
  cook_time text DEFAULT '',
  servings text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create steps table
CREATE TABLE IF NOT EXISTS steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_description text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view ingredients"
  ON ingredients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view steps"
  ON steps FOR SELECT
  TO anon
  USING (true);

-- Create policies for inserting recipes (for demo purposes)
CREATE POLICY "Anyone can add recipes"
  ON recipes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can add ingredients"
  ON ingredients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can add steps"
  ON steps FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);