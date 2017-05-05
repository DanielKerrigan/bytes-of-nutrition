import requests
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

terms = ['Liquid Soybean Oil', 'Partially Hydrogenated Soybean Oil',
        'Water','Salt','Whey','Vegetable Monoglycerides','Soy Lecithin',
        'Potassium Sorbate','Citric Acid','Artificial Flavor',
        'Beta Carotene','Vitamin A Palmitate']

terms = ['milk', 'sugar', 'Modified Corn Starch', 'Kosher Gelatin',
        'Tricalcium Phosphate', 'Vegetable Juice', 'natural flavor',
        'Potassium Sorbate', 'Carrageenan', 'Vitamin A Acetate',
        'Vitamin D3']

for term in terms:
    term_no_space = term.replace(' ', '-')
    with open('search_results/{}.txt'.format(term_no_space)) as f:
        dat = f.read()
        r = requests.post('http://text-processing.com/api/sentiment/',
                data={'text': dat})
        #print(r.json())
        with open('sentiments.txt', 'a') as sf:
            print(r.json()['probability']['pos'])
            sf.write('{},{}\n'.format(term,r.json()['probability']['pos']))
    time.sleep(2)
