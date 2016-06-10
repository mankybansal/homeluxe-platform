# Include dependancies
from py2neo import Graph,Node,Relationship,watch
from random import randint

# System wide connection object
graph = Graph("http://neo4j:homeluxe@123@homeluxe.in:7474/db/data")

# User defined Functions
def stringGeneration(name):
    if(' ' in name):
        cat_id = dStringGeneration(name)
        return cat_id
    else:
        cat_id = wStringGeneration(name)
        return cat_id

def dStringGeneration(name):
    # Declare result variable
    result = ''

    words = name.split()
    for word in words:
        result = result + word[:3]

    # Return the catalogue string
    return result

def wStringGeneration(name):
    # Declare result variable
    result = ''

    if(len(name) >= 6):
        return name[:6]
    else:
        rd = random_with_N_digits(6-len(name))
        name = name + str(rd);
        return name

def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)

watch("httpstream")
label = 'Profiles'

z = graph.find(label);

for node in z:
    # Check for existing catalogue string
    if(node['catalogueKey']):
        print 'Existing catalogue key : ' + node['catalogueKey']
    else:
        cat_id = stringGeneration(node['name'])
        node.properties['catalogueKey'] = cat_id
        node.push()
