from py2neo import Graph,Node,Relationship,watch

graph = Graph("http://neo4j:homeluxe@123@localhost:7474/db/data")

watch("httpstream")
label = 'Profiles'

# Hard coded meta data to insert
metadata = {
    'Soho Sophistication' : [
            {'name' : 'Dining', 'file' : 'Soho_Dining+Kitchen_FINAL1920x1080.jpg','order':2},
            {'name' : 'Bathroom', 'file' : 'Soho_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Guest Bedroom', 'file' : 'Soho_GBR_FINAL1920x1080.jpg','order':6},
            {'name' : 'Living Room', 'file' : 'Soho_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Master Bedroom', 'file' : 'Soho_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Floor Plan','file':'soho sophistication.jpg','order':0}
    ],
    'Santorini Calm' : [
            {'name' : 'Guest Bedroom', 'file' : 'Santorini_GBR_FINAL1920x1080.jpg','order':6},
            {'name' : 'Bathroom', 'file' : 'Santorini_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Kitchen', 'file' : 'Santorini_Kitchen_FINAL1920x1080.jpg','order':3},
            {'name' : 'Living Room', 'file' : 'Santorini_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Master Bedroom', 'file' : 'Santorini_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Floor Plan','file':'santorini calm.jpg','order':0}
    ],
    'Arctic Zen' : [
            {'name' : 'Balcony', 'file' : 'Balcony.jpg','order':7},
            {'name' : 'Dining Room', 'file' : 'Dining.jpg','order':2},
            {'name' : 'Kitchen', 'file' : 'Kitchen.jpg','order':3},
            {'name' : 'Living Room', 'file' : 'Living.jpg','order':1},
            {'name' : 'Master Bedroom', 'file' : 'MBR.jpg','order':4},
            {'name' : 'Floor Plan','file':'arctic zen.jpg','order':0}
    ],
    'Dorchester Comfort' : [
            {'name' : 'Dining Room', 'file' : 'Dining_HD1.jpg','order':2},
            {'name' : 'Bathroom', 'file' : 'Bathroom_HD1.jpg','order':5},
            {'name' : 'Kids Room', 'file' : 'Kids_HD.jpg','order':6},
            {'name' : 'Master Bedroom', 'file' : 'MB_HD.jpg','order':4},
            {'name' : 'Kitchen', 'file' : 'Kitchen_HD.jpg','order':3},
            {'name' : 'Floor Plan','file':'dorchester comfort.jpg','order':0}
    ],
    'Istanbul Mosaic' : [
            {'name' : 'Dining Room', 'file' : 'Istanbul_Dining_FINAL1920x1080.jpg','order':2},
            {'name' : 'Kitchen', 'file' : 'Istanbul_Kitchen_FINAL1920x1080.jpg','order':3},
            {'name' : 'Living Room', 'file' : 'Istanbul_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Master Bedroom', 'file' : 'Istanbul_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Bathroom', 'file' : 'Istanbul_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Staircase','file':'Istanbul_Staircase_FINAL1920x1080.jpg','order':7},
            {'name' : 'Floor Plan','file':'ISTANBUL lower levell.jpg','order':0}
    ],
    'Red Earth' : [
            {'name' : 'Guest Bedroom', 'file' : 'GBR.jpg','order':6},
            {'name' : 'Kitchen', 'file' : 'Kitchen.jpg','order':3},
            {'name' : 'Dining Room', 'file' : 'LivingDining.jpg','order':2},
            {'name' : 'Master Bedroom', 'file' : 'MBR2.jpg','order':4},
            {'name' : 'Terrace', 'file' : 'Terrace.jpg','order':7},
            {'name' : 'Floor Plan','file':'red earth.jpg','order':0}
    ],
    'Eiffel Chic' : [
            {'name' : 'Living Room','file':'Eiffel_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Dining Room','file':'Eiffel_Dining_HD.jpg','order':2},
            {'name' : 'Guest Bedroom','file':'Eiffel_GBedroom_HD.jpg','order':6},
            {'name' : 'Master Bedroom','file':'Eiffel_MasterBedroom_HD.jpg','order':4},
            {'name' : 'Master Bathroom','file':'Eiffel_MBathroom_HD.jpg','order':5},
            {'name' : 'Floor Plan','file':'eiffel chic.jpg','order':0}
    ],
    'Jodhpur Blues' : [
            {'name' : 'Living Room','file' : 'Jodhpur_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Bathroom','file':'Jodhpur_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Master Bedroom','file':'Jodhpur_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Dining Room','file':'Jodhpur_Dining_FINAL1920x1080.jpg','order':2},
            {'name' : 'Kitchen','file':'Jodhpur_Kitchen_FINAL1920x1080.jpg','order':3},
            {'name' : 'Floor Plan','file':'jodhpur blues.jpg','order':0}
    ],
    'Lunuganga Estate' : [
            {'name' : 'Dining','file':'Dinning_HD.jpg','order':2},
            {'name' : 'Foyer','file':'Foyer_HD.jpg','order':7},
            {'name' : 'Kids Room','file':'Kids Bedroom_HD.jpg','order':6},
            {'name' : 'Master Bedroom','file':'Mbr_HD.jpg','order':4},
            {'name' : 'Kitchen','file':'Kitchen_HD.jpg','order':3},
            {'name' : 'Living Room','file':'Living_HD.jpg','order':1},
            {'name' : 'Floor Plan','file':'lunuganga estate.jpg','order':0}
    ],
    'Mekong Meander' : [
            {'name' : 'Dining Room','file':'dining.jpg','order':2},
            {'name' : 'Bathroom','file':'bathroom.jpg','order':5},
            {'name' : 'Bedroom','file':'bedroom.jpg','order':4},
            {'name' : 'Foyer','file':'foyer.jpg','order':7},
            {'name' : 'Living Room','file':'living.jpg','order':1},
            {'name' : 'Floor Plan','file':'mekong meander.jpg','order':0}
    ],
    'Sindhoor Colonial' : [
            {'name' : 'Kitchen','file':'Sindhoor_Kitchen_FINAL1920x1080.jpg','order':3},
            {'name' : 'Living Room','file':'Sindhoor_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Master Bedroom','file':'Sindhoor_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Bathroom','file':'Sindhoor_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Dining Room','file':'Sindhoor_Dining_FINAL1920x1080.jpg','order':2},
            {'name' : 'Floor Plan','file':'sindhoor colonial.jpg','order':0}
    ],
    'Malnad Pure' : [
            {'name' : 'Guest Bedroom','file':'Malnad_GBR_Var1_FINAL1920x1080.jpg','order':6},
            {'name' : 'Living Room','file':'Malnad_Living_Var1_FINAL1920x1080.jpg','order':1},
            {'name' : 'Master Bedroom','file':'Malnad_MBR_Var1_FINAL1920x1080.jpg','order':4},
            {'name' : 'Bathroom','file':'Malnad_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Dining Room','file':'Malnad_Dining_FINAL1920x1080.jpg','order':2},
            {'name' : 'Floor Plan','file':'MALNAD.jpg','order':0}
    ],
    'Ubud Terraces' : [
            {'name' : 'Foyer','file':'Ubud_Foyer_FINAL1920x1080.jpg','order':7},
            {'name' : 'Living Room','file':'Ubud_Living_FINAL1920x1080.jpg','order':1},
            {'name' : 'Dining Room','file':'Ubud_Dining_FINAL1920x1080.jpg','order':2},
            {'name' : 'Master Bedroom','file':'Ubud-MBR_FINAL1920x1080_01.jpg','order':4},
            {'name' : 'Bathroom','file':'Ubud_Bathroom_FINAL1920x1080.jpg','order':5},
            {'name' : 'Floor Plan','file':'ubud terraces.jpg','order':0}
    ],
    'Warhol Burst' : [
            {'name' : 'Dining Room','file':'Dinning_HD.jpg','order':2},
            {'name' : 'Kids Room','file':'Kids_Hd.jpg','order':6},
            {'name' : 'Kitchen','file':'Kitchen_Hd.jpg','order':3},
            {'name' : 'Living Room','file':'Living_HD.jpg','order':1},
            {'name' : 'Master Bedroom','file':'MBR_HD.jpg','order':4},
            {'name' : 'Floor Plan','file':'warhol burst.jpg','order':0}
    ],
    'Banksy Quirk' : [
            {'name' : 'Dining Room','file':'Dinning and Kitchen.jpg','order':2},
            {'name' : 'Guest Bedroom','file':'GBedroom_HD.jpg','order':6},
            {'name' : 'Living Room','file':'Living.jpg','order':1},
            {'name' : 'Master Bedroom','file':'Banksy_MBR_FINAL1920x1080.jpg','order':4},
            {'name' : 'Bathroom','file':'Bathroom.jpg','order':5},
            {'name' : 'Floor Plan','file':'banksy quirk.jpg','order':0}
    ]
}

z = graph.find(label)

for node in z:
    print node['name']
    for room in metadata[node['name']]:
        print '\t'
        print room
        r = Node("Rooms",name=room['name'])
        r['file'] = room['file']
        r['desc'] = 'N/A'
        r['order'] = room['order']
        rel = Relationship(node,"HAS_ROOM",r)
        graph.create(rel)
