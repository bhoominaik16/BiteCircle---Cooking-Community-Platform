// Front-end/src/utils/foodCategories.js

/**
 * Helper function to get more accurate search terms for specific food categories
 * especially for Indian dishes and cuisine-specific recipes
 * 
 * @param {string} recipeName - The name of the recipe
 * @returns {string} A specific search term for better image matching
 */
export function getFoodSearchTerm(recipeName) {
    if (!recipeName) return 'food dish';

    const name = recipeName.toLowerCase();
    
    // Special handling for paneer dishes
    if (name.includes('paneer')) {
        if (name.includes('butter paneer') || name.includes('paneer butter masala')) {
            return 'paneer butter masala dish';
        } else if (name.includes('palak paneer') || name.includes('saag paneer')) {
            return 'palak paneer indian dish';
        } else if (name.includes('kadai paneer')) {
            return 'kadai paneer indian dish';
        } else if (name.includes('paneer tikka')) {
            return 'paneer tikka dish';
        } else if (name.includes('shahi paneer')) {
            return 'shahi paneer dish';
        } else if (name.includes('matar paneer')) {
            return 'matar paneer dish';
        } else {
            return 'paneer indian dish';
        }
    }
    
    // Special handling for curry dishes
    if (name.includes('curry')) {
        if (name.includes('butter chicken')) {
            return 'butter chicken curry dish';
        } else if (name.includes('chicken tikka masala')) {
            return 'chicken tikka masala dish';
        } else if (name.includes('thai') && name.includes('green')) {
            return 'thai green curry dish';
        } else if (name.includes('thai') && name.includes('red')) {
            return 'thai red curry dish';
        } else if (name.includes('japanese') && name.includes('curry')) {
            return 'japanese curry dish';
        } else if (name.includes('vindaloo')) {
            return 'vindaloo curry dish';
        } else {
            // Generic curry with detected meat
            if (name.includes('chicken')) return 'chicken curry dish';
            if (name.includes('lamb')) return 'lamb curry dish';
            if (name.includes('beef')) return 'beef curry dish';
            if (name.includes('pork')) return 'pork curry dish';
            if (name.includes('vegetable')) return 'vegetable curry dish';
            
            return 'curry dish';
        }
    }
    
    // Other Indian dishes
    if (name.includes('biryani')) return 'biryani rice dish';
    if (name.includes('samosa')) return 'samosa indian snack';
    if (name.includes('naan')) return 'naan bread';
    if (name.includes('dosa')) return 'dosa indian dish';
    if (name.includes('idli')) return 'idli indian dish';
    if (name.includes('chaat')) return 'chaat indian street food';
    if (name.includes('tandoori')) return 'tandoori dish';
    
    // Italian dishes
    if (name.includes('pasta')) {
        if (name.includes('carbonara')) return 'pasta carbonara dish';
        if (name.includes('bolognese') || name.includes('bolognaise')) return 'pasta bolognese dish';
        if (name.includes('alfredo')) return 'pasta alfredo dish';
        if (name.includes('pesto')) return 'pasta pesto dish';
        if (name.includes('lasagna') || name.includes('lasagne')) return 'lasagna dish';
        
        return 'pasta dish';
    }
    
    if (name.includes('pizza')) return 'pizza italian dish';
    if (name.includes('risotto')) return 'risotto italian dish';
    if (name.includes('tiramisu')) return 'tiramisu italian dessert';
    if (name.includes('gelato')) return 'gelato italian dessert';
    
    // Mexican dishes
    if (name.includes('taco')) return 'tacos mexican dish';
    if (name.includes('burrito')) return 'burrito mexican dish';
    if (name.includes('enchilada')) return 'enchiladas mexican dish';
    if (name.includes('quesadilla')) return 'quesadilla mexican dish';
    if (name.includes('guacamole')) return 'guacamole mexican dish';
    if (name.includes('salsa')) return 'salsa mexican dish';
    if (name.includes('nachos')) return 'nachos mexican dish';
    
    // Chinese dishes
    if (name.includes('dumpling') || name.includes('dim sum')) return 'dumplings chinese dish';
    if (name.includes('fried rice')) return 'fried rice chinese dish';
    if (name.includes('chow mein')) return 'chow mein chinese dish';
    if (name.includes('kung pao')) return 'kung pao chicken dish';
    if (name.includes('sweet and sour')) return 'sweet and sour chinese dish';
    if (name.includes('spring roll')) return 'spring rolls chinese dish';
    if (name.includes('hot pot')) return 'hot pot chinese dish';
    
    // Japanese dishes
    if (name.includes('sushi')) return 'sushi japanese dish';
    if (name.includes('ramen')) return 'ramen japanese dish';
    if (name.includes('tempura')) return 'tempura japanese dish';
    if (name.includes('teriyaki')) return 'teriyaki japanese dish';
    if (name.includes('miso soup')) return 'miso soup japanese dish';
    if (name.includes('katsu')) return 'katsu japanese dish';
    
    // Thai dishes
    if (name.includes('pad thai')) return 'pad thai dish';
    if (name.includes('tom yum')) return 'tom yum thai soup';
    if (name.includes('green curry') || name.includes('thai green')) return 'thai green curry dish';
    if (name.includes('red curry') || name.includes('thai red')) return 'thai red curry dish';
    if (name.includes('massaman')) return 'massaman curry dish';
    
    // General dish types
    if (name.includes('salad')) return 'fresh salad dish';
    if (name.includes('soup')) return 'soup dish';
    if (name.includes('sandwich')) return 'sandwich food';
    if (name.includes('cake')) return 'cake dessert';
    if (name.includes('ice cream')) return 'ice cream dessert';
    if (name.includes('smoothie')) return 'smoothie drink';
    
    // Main ingredients
    if (name.includes('chicken')) return 'chicken dish';
    if (name.includes('beef')) return 'beef dish';
    if (name.includes('pork')) return 'pork dish';
    if (name.includes('lamb')) return 'lamb dish';
    if (name.includes('fish')) return 'fish dish';
    if (name.includes('vegetarian')) return 'vegetarian dish';
    if (name.includes('vegan')) return 'vegan dish';
    
    // Default case - just use the recipe name with "food dish"
    return `${recipeName} food dish`;
}

/**
 * Get cuisine specific image search terms
 * 
 * @param {string} cuisine - The cuisine type
 * @returns {string} A cuisine-specific search term
 */
export function getCuisineSearchTerm(cuisine) {
    if (!cuisine) return 'food dish';
    
    const cuisineType = cuisine.toLowerCase();
    
    switch (cuisineType) {
        case 'indian':
            return 'indian food dish';
        case 'italian':
            return 'italian food dish';
        case 'mexican':
            return 'mexican food dish';
        case 'chinese':
            return 'chinese food dish';
        case 'japanese':
            return 'japanese food dish';
        case 'thai':
            return 'thai food dish';
        case 'french':
            return 'french cuisine dish';
        case 'mediterranean':
            return 'mediterranean food dish';
        case 'american':
            return 'american food dish';
        case 'middle eastern':
            return 'middle eastern food dish';
        case 'korean':
            return 'korean food dish';
        case 'vietnamese':
            return 'vietnamese food dish';
        case 'spanish':
            return 'spanish food dish';
        case 'greek':
            return 'greek food dish';
        default:
            return `${cuisine} food dish`;
    }
}