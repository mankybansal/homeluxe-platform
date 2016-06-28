from py2neo import Graph,Node,Relationship,watch
import random,string

def randomImageName(length):
    return ''.join(random.choice(string.lowercase) for i in range(0,length)) + '.jpg'

def generateImageString(image,flag):
    if flag:
        filename = image
    else:
        filename = 'NOIMAGE.png'
    desc = 'N/A'
    string = '{"name" : "%s","desc" : "%s"}' % (filename,desc)
    return string

graph = Graph("http://neo4j:homeluxe@123@dev.homeluxe.in:7474/db/data")

watch("httpstream")
label = 'Profiles'

metadata = {
    'Soho Sophistication' : {
        'desc' : 'Regardless of which city you live in, you have a New York style quotient. Style has defined your life, with a very understated and sophisticated palette. You often buy timeless classic whether clothes or curtains. Muted colors very deliberately come together to create a sophisticated and sexy home.',
        'cover' : 'soho sophistication.jpg',
        'images' : [
            'Soho_Dining+Kitchen_FINAL1920x1080.jpg',
            'Soho_Bathroom_FINAL1920x1080.jpg',
            'Soho_GBR_FINAL1920x1080.jpg',
            'Soho_Living_FINAL1920x1080.jpg',
            'Soho_MBR_FINAL1920x1080.jpg'
        ]
    },
    'Santorini Calm' : {
        'desc' : 'Beaches make you happy. You are a water baby, often a water sign, and aqua refreshes you. Comfort is important to you, and creating cheerful and welcoming spaces gives you pleasure.',
        'cover' : 'santorini calm.jpg',
        'images' : [
            'Santorini_GBR_FINAL1920x1080.jpg',
            'Santorini_Bathroom_FINAL1920x1080.jpg',
            'Santorini_Living_FINAL1920x1080.jpg',
            'Santorini_MBR_FINAL1920x1080.jpg'
        ]
    },
    'Arctic Zen' : {
        'desc' : 'You like clean lines, hate clutter, and your home is an oasis of calm. Lot of room for circulation and a touch of the exotic will ensure that calm is no way boring.',
        'cover' : 'arctic zen.jpg',
        'images' : [
            'Balcony.jpg',
            'Dining.jpg',
            'Kitchen.jpg',
            'Living.jpg',
            'MBR.jpg'
        ]
    },
    'Dorchester Comfort' : {
        'desc' : 'People would most describe you as classic. Takes while to be your friend, but once there they have a loyal and reliable friend for life. Your spaces mix the formal and the comfortable easily, making sure game night or a dinner party are just as lovely.',
        'cover' : 'dorchester comfort.jpg',
        'images' : [
            'Dining_HD1.jpg',
            'Bathroom_HD1.jpg',
            'Kids_HD.jpg',
            'MB_HD.jpg'
        ]
    },
    'Istanbul Mosaic' : {
        'desc' : 'Color color in all its glory. With mirrors that reflect them in many dimensions. That could as much describe you as this home. Inspired by the mosaic of Istanbul, this looks brings a modern twist to the workmanship, colors and ceramics of the minarets and homes on the Bosphorus.',
        'cover' : 'istanbul mosaic.jpg',
        'images' : [
            'DINING_KITCHEN.jpg',
            'GUEST_ROOM_FINAL.jpg',
            'LIVING_ROOM.jpg',
            'MASTER_BEDROOM.jpg',
            'TOILET.jpg'
        ]
    },
    'Red Earth' : {
        'desc' : 'Vibrant and sultry. Thats how you are most described. You are the life at every wedding, the person who gets the baraat going. Your home has museum worth pieces, but will never look like a museum, coz of the modern sensibility you bring to it.',
        'cover' : 'red earth.jpg',
        'images' : [
            'GBR.jpg',
            'Kitchen.jpg',
            'LivingDining.jpg',
            'MBR2.jpg',
            'Terrace.jpg'
        ]
    },
    'Eiffel Chic' : {
        'desc' : 'Your chic is timeless, not defined by fads or trends. You are young at heart, and people always talk about your energy. Light filled rooms, bright colors and lots of personal touches make you happy!',
        'cover' : 'eiffecl chic.jpg',
        'images' : [
            'Eiffel_Living_FINAL1920x1080.jpg',
            'Eiffel_Dining_HD.jpg',
            'Eiffel_GBedroom_HD.jpg',
            'Eiffel_MasterBedroom_HD.jpg',
            'Eiffel_MBathroom_HD.jpg'
        ]
    },
    'Jodhpur Blues' : {
        'desc' : 'A modern Indian, who blends the wonder of Jaipuri block prints with silhoettes that can fit in any country. You take whats ethnic but make it contemporary and all your own. This style maybe blue, but is sure to brighten your day.',
        'cover' : 'jodhpur blues.png',
        'images' : [
            'Jodhpur_Living_FINAL1920x1080.jpg',
            'Jodhpur_Bathroom_FINAL1920x1080.jpg',
            'Jodhpur_MBR_FINAL1920x1080.jpg',
            'Jodhpur_Dining_FINAL1920x1080.jpg',
            'Jodhpur_Kitchen_FINAL1920x1080.jpg'
        ]
    },
    'Lunuganga Estate' : {
        'desc' : 'Being outdoors is not an option its a necessity. Lush spaces that remind you of the forest you walked through, or the coffee plantations you visited. This all teak iconic look is as much a homage to you as to Bawa.',
        'cover' : 'lunuganga estate.jpg',
        'images' : [
            'DINING_KITCHEN.jpg',
            'FOYER_LIVING.jpg',
            'GUEST_ROOM.jpg',
            'MASTER_BEDROOM.jpg',
            'MASTER_TOILET.jpg'
        ]
    },
    'Mekong Meander' : {
        'desc' : 'The world around you maybe in a rush, but you always make the time for the things that are important. You take long boat or train rides, finding joy in the moments that not many others can see.',
        'cover' : 'mekong meander.jpg',
        'images' : [
            'dining.jpg',
            'bathroom.jpg',
            'bedroom.jpg',
            'foyer.jpg',
            'living.jpg'
        ]
    },
    'Sindhoor Colonial' : {
        'desc' : 'You still remember summers at our grandparents home. Climbing trees to pluck mangoes, and running through long corridors with your cousins. So what if you live in a flat in a large urban city now, its just as easy to be traditional, nostalgic and modern all in one.',
        'cover' : 'sindhoor colonial.jpg',
        'images' : [
            'GUEST_ROOM.jpg',
            'KITCHEN.jpg',
            'LIVING_ROOM.jpg',
            'MASTER_BEDROOM.jpg',
            'TOILET.jpg'
        ]
    },
    'Malnad Pure' : {
        'desc' : 'There is a charm and old school elegance to you that show in the way you dress and entertain. You love experimenting with traditional food, crafts, fabric and jewellery. Authenticity is important to you, with history and these pieces will tell your story well. This rattan and timber look will keep conversations going.',
        'cover' : 'malnad pure.jpg',
        'images' : [
            'Malnad_GBR_FINAL1920x1080.jpg',
            'Malnad_Living_FINAL1920x1080.jpg',
            'Malnad_MBR_FINAL1920x1080.jpg'
        ]
    },
    'Ubud Terraces' : {
        'desc' : 'Romance is very much a part of your life. You exude warmth and an understated energy. You are more yoga than aerobics. Healthy food and conversation are mandatory at the dinner table.',
        'cover' : 'ubud terraces.jpg',
        'images' : [
            'FOYER_LIVING.jpg',
            'GUEST_ROOM.jpg',
            'KITCHEN_DINING.jpg',
            'MASTER_ROOM.jpg',
            'MASTER_TOILET.jpg'
        ]
    },
    'Warhol Burst' : {
        'desc' : 'Your parties are the talk of the town. Not because of how much effort you put in, but just how interesting they turn out to be! You have a streak of the unpredictable in you, like splashes of color, and could have fit right into Studio 54.',
        'cover' : 'warhol burst.jpg',
        'images' : [
            'DINING_KITCHEN.jpg',
            'GUEST_ROOM.jpg',
            'LIVING.jpg',
            'MASTER_BEDROOM.jpg',
            'TOILET.jpg'
        ]
    },
    'Banksy Quirk' : {
        'desc' : 'You are the person who picked up that little curio in Venice or Vellore, that everyone talks about. Everything about you is YOU. Special, edgy, liberal and sexy. Who thinks graffiti can be the purest form of art. Been to a protest lately?',
        'cover' : 'banksy quirk.jpg',
        'images' : [
            'DINING.jpg',
            'GUEST_BEDROOM.jpg',
            'KITCHEN.jpg',
            'LIVING.jpg',
            'MASTER_BEDROOM.jpg'
        ]
    }
}

z = graph.find(label)

for node in z:
    node.properties['price'] = (random.randint(20000,100000))
    node.properties['description'] = metadata[node['name']]['desc']
    node.properties['cover_pic'] = metadata[node['name']]['cover']
#    node.properties['images'] = []
#    if len(metadata[node['name']]['images']) > 0:
#        for image in metadata[node['name']]['images']:
#            node.properties['images'].append(generateImageString(image,1))
#    else:
#        for i in range(0,4):
#            node.properties['images'].append(generateImageString(i,0))
    node.push()
