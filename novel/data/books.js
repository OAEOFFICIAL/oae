// Database of Literature Texts

const literatureDatabase = [
    {
        id: "life-changer",
        title: "The Life Changer",
        author: "Khadija Abubakar Jalli",
        examCategory: "JAMB",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
        description: "The official JAMB Use of English compulsory novel. It follows the story of Ummi and her family as she narrates her university experiences to her children, warning them about the freedom and challenges of campus life.",
        characters: [
            { name: "Ummi", role: "Protagonist/Narrator", desc: "A mother and a teacher who shares her university experiences with her children." },
            { name: "Salma", role: "Key Character", desc: "Ummi's roommate in the university. A beautiful, arrogant girl who gets expelled due to examination malpractice." },
            { name: "Omar", role: "Ummi's Son", desc: "Ummi's first child who just gained admission into Ahmadu Bello University to study Law." },
            { name: "Bint", role: "Ummi's Daughter", desc: "The youngest child who is very brilliant and inquisitive." }
        ],
        chapters: [
            {
                number: 1,
                title: "The Wait",
                summary: "The story opens with Ummi's family waiting for her husband to return. Bint tells a story about her classroom experience where she outsmarted her social studies teacher. Omar rushes in with the exciting news that he has been admitted into Ahmadu Bello University to study Law."
            },
            {
                number: 2,
                title: "Campus Life Rules",
                summary: "Ummi begins narrating her own university experience to Omar to prepare him. She tells him about the illusion of freedom on campus, warning him that freedom without boundaries leads to destruction. She shares her encounter with the HOD, Samuel Johnson, who tried to assist her but was misunderstood by her."
            },
            {
                number: 3,
                title: "The Story of the Quiet One",
                summary: "Ummi tells the story of 'The Quiet One', a boy named Talle from a village called Lafayette. Talle was considered a model citizen until he was caught assisting a kidnapper. He was extorting money and hiding a victim. This shocked the entire village, proving that appearances can be very deceptive."
            },
            {
                number: 4,
                title: "Salma's Arrogance",
                summary: "The focus shifts to Salma, Ummi's roommate. Salma is depicted as extremely beautiful but arrogant and condescending. She initially alienates her roommates but eventually warms up to them. Salma's overconfidence becomes her tragic flaw as she refuses to study hard."
            }
        ]
    },
    {
        id: "lekki-headmaster",
        title: "The Lekki Headmaster",
        author: "Unknown Author",
        examCategory: "WAEC",
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400",
        description: "A placeholder for the WAEC approved literature text exploring the educational system and societal values.",
        characters: [
            { name: "Mr. Headmaster", role: "Protagonist", desc: "The strict but fair headmaster of Lekki High." }
        ],
        chapters: [
            { number: 1, title: "The Arrival", summary: "The headmaster arrives at the new school." }
        ]
    }
];
