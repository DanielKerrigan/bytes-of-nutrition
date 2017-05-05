from py_ms_cognitive import PyMsCognitiveWebSearch
import json
import time

terms = ['banana', 'cream', 'salt', 'corn meal',
        'vegetable oil', 'whey', 'corn starch', 'cheddar cheese',
        'maltodextrin', 'butter', 'natural and artificial flavors',
        'buttermilk', 'monosodium glutamate', 'yellow 5', 'yellow 6',
        'yellow 5 lake', 'whole grain oats', 'sugar', 'canola oil',
        'whole grain rice', 'rice', 'almonds','dried blueberries',
        'honey', 'dried cranberries', 'molasses',
        'rice flour', 'cinnamon', 'baking soda', 'mixed tocopherols',
        'bht', 'commodity beef', 'carbonated water',
        'high fructose corn syrup', 'caramel color', 'phosphoric acid',
        'caffeine', 'citric acid', 'natural flavor', 'milk', 'pectin']

terms = ['grass fed beef']

terms = ['Liquid Soybean Oil', 'Partially Hydrogenated Soybean Oil',
        'Water','Salt','Whey','Vegetable Monoglycerides','Soy Lecithin',
        'Potassium Sorbate','Citric Acid','Artificial Flavor',
        'Beta Carotene','Vitamin A Palmitate']

terms = ['Modified Corn Starch', 'Kosher Gelatin',
        'Tricalcium Phosphate', 'Vegetable Juice',
        'Potassium Sorbate', 'Carrageenan',
        'Vitamin A Acetate', 'Vitamin D3']

for term in terms:
    print(term)
    search_term = '{} health'.format(term)
    bing_web = PyMsCognitiveWebSearch('0dbdc875b6524ead8e9f2edaa7578944',
            search_term)
    result = bing_web.search(limit=5, format='json')
    term_no_space = term.replace(' ', '-')
    with open('search_results/{}.txt'.format(term_no_space), 'w') as out:
        for res in result:
            out.write(res.name+'\n')
            out.write(res.snippet+'\n\n')
    time.sleep(1)
