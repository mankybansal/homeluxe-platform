from py2neo import Graph,Node,Relationship,watch

graph = Graph("http://neo4j:homeluxe@123@homeluxe.in:7474/db/data")

watch("httpstream")
label = 'Profiles'

# Hard coded meta data to insert
metadata = {
    'Soho Sophistication' : [
            {'name' : 'Dining', 'file' : 'Soho_Dining+Kitchen_FINAL1920x1080.jpg'},
            {'name' : 'Bathroom', 'file' : 'Soho_Bathroom_FINAL1920x1080.jpg'},
            {'name' : 'Guest Bedroom', 'file' : 'Soho_GBR_FINAL1920x1080.jpg'},
            {'name' : 'Living Room', 'file' : 'Soho_Living_FINAL1920x1080.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'Soho_MBR_FINAL1920x1080.jpg'}
    ],
    'Santorini Calm' : [
            {'name' : 'Guest Bedroom', 'file' : 'Santorini_GBR_FINAL1920x1080.jpg'},
            {'name' : 'Bathroom', 'file' : 'Santorini_Bathroom_FINAL1920x1080.jpg'},
            {'name' : 'Living Room', 'file' : 'Santorini_Living_FINAL1920x1080.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'Santorini_MBR_FINAL1920x1080.jpg'}
    ],
    'Arctic Zen' : [
            {'name' : 'Balcony', 'file' : 'Balcony.jpg'},
            {'name' : 'Dining Room', 'file' : 'Dining.jpg'},
            {'name' : 'Kitchen', 'file' : 'Kitchen.jpg'},
            {'name' : 'Living Room', 'file' : 'Living.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'MBR.jpg'}
    ],
    'Dorchester Comfort' : [
            {'name' : 'Dining Room', 'file' : 'Dining_HD1.jpg'},
            {'name' : 'Bathroom', 'file' : 'Bathroom_HD1.jpg'},
            {'name' : 'Kids Room', 'file' : 'Kids_HD.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'MB_HD.jpg'}
    ],
    'Istanbul Mosaic' : [
            {'name' : 'Dining Room', 'file' : 'DINING_KITCHEN.jpg'},
            {'name' : 'Guest Room', 'file' : 'GUEST_ROOM_FINAL.jpg'},
            {'name' : 'Living Room', 'file' : 'LIVING_ROOM.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'MASTER_BEDROOM.jpg'},
            {'name' : 'Toilet', 'file' : 'TOILET.jpg'}
    ],
    'Red Earth' : [
            {'name' : 'Guest Bedroom', 'file' : 'GBR.jpg'},
            {'name' : 'Kitchen', 'file' : 'Kitchen.jpg'},
            {'name' : 'Dining Room', 'file' : 'LivingDining.jpg'},
            {'name' : 'Master Bedroom', 'file' : 'MBR2.jpg'},
            {'name' : 'Terrace', 'file' : 'Terrace.jpg'}
    ],
    'Eiffel Chic' : [
            {'name' : 'Living Room','file':'Eiffel_Living_FINAL1920x1080.jpg'},
            {'name' : 'Dining Room','file':'Eiffel_Dining_HD.jpg'},
            {'name' : 'Guest Bedroom','file':'Eiffel_GBedroom_HD.jpg'},
            {'name' : 'Master Bedroom','file':'Eiffel_MasterBedroom_HD.jpg'},
            {'name' : 'Master Bathroom','file':'Eiffel_MBathroom_HD.jpg'}
    ],
    'Jodhpur Blues' : [
            {'name' : 'Living Room','file' : 'Jodhpur_Living_FINAL1920x1080.jpg'},
            {'name' : 'Bathroom','file':'Jodhpur_Bathroom_FINAL1920x1080.jpg'},
            {'name' : 'Master Bedroom','file':'Jodhpur_MBR_FINAL1920x1080.jpg'},
            {'name' : 'Dining Room','file':'Jodhpur_Dining_FINAL1920x1080.jpg'},
            {'name' : 'Kitchen','file':'Jodhpur_Kitchen_FINAL1920x1080.jpg'}
    ],
    'Lunuganga Estate' : [
            {'name' : 'Dining','file':'DINING_KITCHEN.jpg'},
            {'name' : 'Foyer','file':'FOYER_LIVING.jpg'},
            {'name' : 'Guest Room','file':'GUEST_ROOM.jpg'},
            {'name' : 'Master Bedroom','file':'MASTER_BEDROOM.jpg'},
            {'name' : 'Master Toilet','file':'MASTER_TOILET.jpg'}
    ],
    'Mekong Meander' : [
            {'name' : 'Dining Room','file':'dining.jpg'},
            {'name' : 'Bathroom','file':'bathroom.jpg'},
            {'name' : 'Bedroom','file':'bedroom.jpg'},
            {'name' : 'Foyer','file':'foyer.jpg'},
            {'name' : 'Living Room','file':'living.jpg'}
    ],
    'Sindhoor Colonial' : [
            {'name' : 'Guest Room','file':'GUEST_ROOM.jpg'},
            {'name' : 'Kitchen','file':'KITCHEN.jpg'},
            {'name' : 'Living Room','file':'LIVING_ROOM.jpg'},
            {'name' : 'Master Bedroom','file':'MASTER_BEDROOM.jpg'},
            {'name' : 'Toilet','file':'TOILET.jpg'}
    ],
    'Malnad Pure' : [
            {'name' : 'Guest Bedroom','file':'Malnad_GBR_FINAL1920x1080.jpg'},
            {'name' : 'Living Room','file':'Malnad_Living_FINAL1920x1080.jpg'},
            {'name' : 'Master Bedroom','file':'Malnad_MBR_FINAL1920x1080.jpg'}
    ],
    'Ubud Terraces' : [
            {'name' : 'Living Room','file':'FOYER_LIVING.jpg'},
            {'name' : 'Guest Room','file':'GUEST_ROOM.jpg'},
            {'name' : 'Dining Room','file':'KITCHEN_DINING.jpg'},
            {'name' : 'Master Bedroom','file':'MASTER_ROOM.jpg'},
            {'name' : 'Master Toilet','file':'MASTER_TOILET.jpg'}
    ],
    'Warhol Burst' : [
            {'name' : 'Dining Room','file':'DINING_KITCHEN.jpg'},
            {'name' : 'Guest Room','file':'GUEST_ROOM.jpg'},
            {'name' : 'Living Room','file':'LIVING.jpg'},
            {'name' : 'Master Bedroom','file':'MASTER_BEDROOM.jpg'},
            {'name' : 'Toilet','file':'TOILET.jpg'}
    ],
    'Banksy Quirk' : [
            {'name' : 'Dining Room','file':'DINING.jpg'},
            {'name' : 'Guest Bedroom','file':'GUEST_BEDROOM.jpg'},
            {'name' : 'Kitchen','file':'KITCHEN.jpg'},
            {'name' : 'Living Room','file':'LIVING.jpg'},
            {'name' : 'Master Bedroom','file':'MASTER_BEDROOM.jpg'}
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
        rel = Relationship(node,"HAS_ROOM",r)
        graph.create(rel)
