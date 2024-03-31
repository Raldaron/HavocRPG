document.addEventListener("DOMContentLoaded", () => {
  populateLevelDropdown();
  populateRacesDropdown();
  populateClassesDropdown();
  populateRankingDropdowns();
  initAttributeScoreListeners();
  initRankingChangeListeners();
  document.querySelectorAll(".level-bubble").forEach(bubble => {
    bubble.addEventListener("click", function() {
      this.classList.toggle("filled");
    });
  });
  document.querySelector(".tablinks").click();
  
  // Delay Firebase-specific setup to ensure it doesn't interfere
  setTimeout(initAuth, 500); // Adjust time as needed
});

function initAuth() {
  // User Registration
  document.getElementById("registerButton").addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("User registered successfully!");
        console.log("User registered:", userCredential.user);
      })
      .catch((error) => {
        alert("Error registering user:", error.message);
        console.error("Error registering new user:", error);
      });
  });

  // User Login
  document.getElementById("loginButton").addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("User logged in successfully!");
        console.log("User logged in:", userCredential.user);
        // Example: Load user's character sheet
        loadCharacterSheet();
      })
      .catch((error) => {
        alert("Error logging in:", error.message);
        console.error("Error signing in:", error);
      });
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("User logged in: ", user);
      // Optionally load user data or character sheet
      loadCharacterSheet();
    } else {
      console.log("User logged out");
    }
  });
}

// Load user's character sheet
function loadCharacterSheet() {
  const user = firebase.auth().currentUser;
  if (user) {
    db.collection("characterSheets")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const characterData = doc.data();
          console.log("Character Sheet Data:", characterData);
          // Populate character sheet on the page with characterData
          // Example: document.getElementById('characterName').value = characterData.name;
        } else {
          console.log("No character sheet found.");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
}

// Function to save character sheet data
// This should be called with the appropriate data when the character sheet is submitted
function saveCharacterSheet(characterData) {
  const user = firebase.auth().currentUser;
  if (user) {
    db.collection("characterSheets")
      .doc(user.uid)
      .set(characterData)
      .then(() => {
        console.log("Character sheet saved!");
      })
      .catch((error) => {
        console.error("Error saving character sheet:", error);
      });
  } else {
    console.log("User is not logged in");
  }
}

function populateRankingDropdowns() {
  // Get all ranking select elements
  const rankingSelects = document.querySelectorAll(".attribute-ranking-select");

  // Define the ranking options
  const rankings = [
    { value: "primary", text: "Primary" },
    { value: "secondary", text: "Secondary" },
    { value: "tertiary", text: "Tertiary" }
  ];

  // Populate each select element with the ranking options
  rankingSelects.forEach((select) => {
    rankings.forEach((rank) => {
      const option = document.createElement("option");
      option.value = rank.value;
      option.textContent = rank.text;
      select.appendChild(option);
    });
  });
}

function initRankingChangeListeners() {
  document.querySelectorAll(".attribute-ranking-select").forEach((select) => {
    select.addEventListener("change", handleRankingChange);
  });
}

const rankingPoints = {
  primary: 9,
  secondary: 5,
  tertiary: 3
};

let attributePoints = {
  Physical: 0,
  Social: 0,
  Mental: 0
};

let attributeLimits = {
  Physical: 0,
  Social: 0,
  Mental: 0
};

function handleRankingChange() {
  const attribute = this.closest(".attribute").dataset.attribute;
  attributeLimits[attribute] = rankingPoints[this.value];
  attributePoints[attribute] = 0; // Reset points for this attribute

  resetAttributeScores(attribute);
  checkAndDisableButtons(attribute);
}

function resetAttributeScores(attribute) {
  document
    .querySelectorAll(`[data-attribute="${attribute}"] .trait-score`)
    .forEach((span) => {
      span.textContent = "0"; // Reset score
    });
}

function initAttributeScoreListeners() {
  document
    .querySelectorAll(".attribute .increment, .attribute .decrement")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const action = this.dataset.action;
        const trait = this.dataset.trait;
        const attribute = this.closest(".attribute").dataset.attribute;

        changeTraitScore(trait, action === "increment" ? 1 : -1, attribute);
      });
    });
}

function changeTraitScore(traitId, change, attribute) {
  const scoreElement = document.getElementById(traitId);
  let score = parseInt(scoreElement.textContent);
  let newScore = score + change;

  // Update score only if within limits
  if (
    (change > 0 && attributePoints[attribute] < attributeLimits[attribute]) ||
    change < 0
  ) {
    if (newScore >= 0) {
      scoreElement.textContent = newScore.toString();
      attributePoints[attribute] += change;
      checkAndDisableButtons(attribute);
    }
  }
}

function checkAndDisableButtons(attribute) {
  const incrementButtons = document.querySelectorAll(
    `[data-attribute="${attribute}"] .increment`
  );
  if (attributePoints[attribute] >= attributeLimits[attribute]) {
    incrementButtons.forEach((button) => (button.disabled = true));
  } else {
    incrementButtons.forEach((button) => (button.disabled = false));
  }
}

// Function to populate the level dropdown
function populateLevelDropdown() {
  const levelSelect = document.getElementById("level");
  for (let i = 1; i <= 30; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = `Level ${i}`;
    levelSelect.appendChild(option);
  }
}

// Function to populate races dropdown and set up descriptions
function populateRacesDropdown() {
  const races = [
    {
      name: "Pocket Kuma",
      description:
        "Lets get this straight: the Pocket Kuma is the result of what happens when high elves play mad scientist with the animal kingdom. Imagine taking a bear, making it pocket-sized, and then adding a sprinkle of fairy dust just for giggles. The High Elf King Finian, in a moment of unparalleled wisdom, decided these intelligent, magic-infused fluff balls were too much of a threat to his ego and ordered a mass extermination. A few crafty survivors played hide-and-seek in the jungle, and now were blessed with these bug-eyed, adorable abominations. Fighting? Forget about it. Walking? Barely. But if there was a competition for being so cute its almost criminal, Pocket Kumas would be the reigning champions. Just dont squeeze them too hard; theyre not stress balls, no matter how squishy they look."
    },
    {
      name: "Saccathian",
      description:
        'Ah, the Saccathians, or "Sacs" if youre into the whole brevity thing. Picture a squid, scale it up to human size, and slap on a dash of Lovecraftian nightmare fuel, and youve got yourself a Saccathian. These cephalopod-faced wonders are like the odd cousins of the oceanic world that decided legs were overrated and tentacles were in. Theyre the life of the party in any cosmic horror-themed gathering, and their ability to make anyone uncomfortable is unmatched. If youve ever wanted to hug a creature that could potentially strangle you with affection, the Saccathian is your go-to race.'
    },
    {
      name: "Rat Hooligan",
      description:
        "The Rat Hooligans, or Rat-kin, are essentially what youd get if rats decided to stand up, demand rights, and start wearing clothes. At a towering five feet tall, these furry anarchists are the embodiment of street smarts mixed with a dash of petty theft. If youve ever wanted to play a character that can scurry through dungeons, talk trash, and look surprisingly dapper in a tiny leather jacket, the Rat Hooligan is calling your name. Just keep an eye on your belongings; these guys have sticky fingers."
    },
    {
      name: "Nullian",
      description:
        "The Nullians, affectionately known as Nulls, are your classic Roswell aliens with a twist of cosmic discrimination. These little green men have been given the cold shoulder by just about every spacefaring council out there. Its not easy being green, especially when entire systems slam the no-entry sign in your face. But hey, what they lack in popularity, they make up for in mysterious Area 51 vibes and a knack for crashing in the most inconvenient places. If youre into playing the intergalactic underdog with a penchant for probing the unknown, the Nullian is your alien."
    },
    {
      name: "Caprid",
      description:
        "Caprids are what happens when the universe decides goats need to be in space. These goat-like aliens probably have the best headbutt in the galaxy and an affinity for chewing on things they definitely shouldnt. If youve ever fantasized about being able to eat a tin can as a party trick, congratulations, the Caprid race is your dream come true. Just try to keep them away from the ships wiring; its not part of a balanced diet."
    },
    {
      name: "Naga",
      description:
        'The Naga, with their cobra-headed elegance, are the slithery sovereigns of the stars, once ruling over Dungeon Crawler World with a cold-blooded grip. Governed by the illustrious Blood Sultanate, these serpentine strategists were as feared in politics as they were in battle, until crawler Drakea handed them a financial L so large, theyre probably still trying to uncoil themselves from bankruptcy. If youre into playing a race thats part history lesson in fiscal irresponsibility and part "why is my boss a snake?", the Naga offers a unique blend of venomous charm and monetary cautionary tales.'
    },
    {
      name: "Forsoothed",
      description:
        "Meet the Forsoothed, or Soothers if youre not into the whole formality thing. These humanoids look like they walked straight out of a sci-fi casting call: bald, white, sporting a ridged mohawk crest that would make any punk rocker jealous, and eyes big enough to see their own awkwardness. With three fingers, they’re basically what aliens would look like if they were trying too hard to count to five. Earth fictions favorite, but still, no Oscar nominations for them."
    },
    {
      name: "Skyfowl",
      description:
        "The Skyfowl are exactly what you get when an eagle gets too frisky with a humanoid: a race of eagle-headed beings with a superiority complex. Proud and irritable, these feathered folks are part of a legendary side quest that will make you question if ‘bird-brained’ is actually a compliment. Just dont expect them to laugh at your chicken cross-the-road jokes."
    },
    {
      name: "Bugbear",
      description:
        "Bugbears are the mystery meat of the fantasy world. No one knows what they look like, but everyones familiar with bugbear paste – the go-to condiment for explosive sandwiches. They’ve got a metal named after them and drove one priestly fellow bonkers, which honestly is the kind of PR you cant buy."
    },
    {
      name: "Incubus",
      description:
        "Ah, the Incubus. Also known as the Gigachad of the Over City, these dusky gray-skinned, horned hunks with forked tails and bat-like wings are the bad boys of the demon world. They’ll sweep you off your feet, show you a night on the town, and leave you with nothing but a hangover and a set of stunningly sensuous footprints. Low alcohol tolerance, but whos counting drinks when youre that good-looking?"
    },
    {
      name: "Changeling",
      description:
        "Changelings are the ultimate plus-ones, able to morph into any species they’ve touched. Need a date that can also double as your pet? Theyve got you covered. Just make sure you don’t lose track of who—or what—you brought to the party."
    },
    {
      name: "Porsuk",
      description:
        "Porsuks are your friendly neighborhood badger-heads, and they’ve got the monopoly on bartending at the Desperado Club. If you want a drink with a side of dont mess with me, a Porsuks your guy. Just tip well, or you might find your beer a little... gritty."
    },
    {
      name: "Orc",
      description:
        "Orcs, the pig-like mainstay of fantasy races. Theyre like the neighbors you only invite to barbecues out of obligation. Common as dirt, but surprisingly good at turning a spit."
    },
    {
      name: "Zebani",
      description:
        "The Zebani are the blue-tinged humans of the cosmos. Not feeling blue? Spend a day with them. They’re like walking, talking mood rings, only less 70s and more interstellar chic."
    },
    {
      name: "Doppelgänger",
      description:
        "Doppelgängers are the Swiss Army knives of shape-shifters. Need to look like someone else? Theyve got you. But beware: shifting mass to mimic others doesnt come with an instruction manual. Sometimes you’re the spitting image, and sometimes you’re just spitting images."
    },
    {
      name: "Gondii",
      description:
        'Gondii, the parasitic worms of the Valtay, are the ultimate body-snatchers. Theyll take over your body faster than you can say "not it!" and the worst part? They dont even pay rent. If you like your hosts like you like your coffee—completely taken over—then Gondiis the race for you.'
    },
    {
      name: "Tigran",
      description:
        "Picture a humanoid, now add stripes, fur, and feline grace, and boom: youve got the Tigran. These orange, furry, tiger-like beings are for those who like their RPG characters with a side of whiskers and a penchant for naps in the sun."
    },
    {
      name: "Fairy",
      description:
        "Fairies: not just the tiny winged beings of lore, but creatures whose magic is literally on their back. Think twice before using those orcish metal ball bearings; its like kryptonite with wings."
    },
    {
      name: "Kuhli",
      description:
        'Imagine a gecko but with more personality and ambition. The Kuhli, spotted and cunning, are masters of "stick and move." Their ability to blend into any party without drawing attention is unparalleled, making them the ultimate plus-ones. If youve ever aspired to be that person who leaves a conversation by simply vanishing, Kuhlis your race of choice.'
    },
    {
      name: "Cretin",
      description:
        'Not your average bouncer, the Cretin are rock elementals with a side gig in security at The Desperado Club. Imagine telling someone youre a mercenary for Ken, and your resume includes "gatekeeper of the Feral Gods." Its like saying youve worked both the VIP and the apocalypse. Rock solid on loyalty and literally hard-headed, choosing Cretin means never having to say youre sorry, mainly because youre a rock.'
    },
    {
      name: "Infiltrator",
      description:
        'The ultimate eavesdroppers. These aquatic brain parasites take "getting under your skin" to a whole new level. Fancy locking someone out of their own body? Infiltrators are your go-to. But remember, every host party must come to an end, preferably before an anti-parasitic crashes it. If revenge is a dish best served cold, Infiltrators are the chefs in the frosty kitchen of retribution.'
    },
    {
      name: "Cat Girl",
      description:
        "Its like choosing to be the internets darling, but with more fur and a charisma bonus that makes politicians look like amateurs. Offending Domino is a badge of honor, or perhaps a death wish, depending on how you look at it. Sister Ines, the Havana Brown cat humanoid, is living proof that sometimes, being adorable is enough to start a feud."
    },
    {
      name: "Crest",
      description:
        "The Crest, a race that boldly challenges the necessity of eyebrows in society. Engaging in faction wars with the smooth confidence of someone who has never known the struggle of a bad brow day. If youve ever wanted to be part of a community that values forehead real estate over facial expressions, the Crest is calling your name."
    },
    {
      name: "Igneous",
      description:
        'Ever wanted to be the person at the party who can casually mention theyre made of rock and can shoot lava? Igneous is your ticket to becoming that conversation stopper. Altering personalities like theyre going out of style, these rockstars (pun intended) bring new meaning to "hot-headed." With the ability to breathe underwater, because why not add that to the mix, choosing Igneous means never having to play it cool.'
    },
    {
      name: "Bune",
      description:
        'Ah, the Bune, because the universe looked at dragons and thought, "What if we made them less fire-breathy and more... approachable?" Imagine a dragon that got a corporate job and settled down in the suburbs. Bune are your go-to for those who want the prestige of draconic ancestry without the hassle of hoarding gold or kidnapping princesses. Less "burninate the countryside," more "can you help me file my taxes?"'
    },
    {
      name: "Crocodilian",
      description:
        'Imagine a creature that embodies the phrase "you are what you eat" to a terrifyingly literal degree. Crocodilians, the apex predators of the buffet line, get triple the mileage out of their meals. Want to see a barbarian go from zero to hero with a single snack? Choose Crocodilian, and remember, friends dont let friends skip meal prep.'
    },
    {
      name: "Vampire",
      description:
        'Ah, the classic bloodsucker with a real estate problem. Vampires, the only race that considers a staircase more of a life commitment than a convenience. If youve ever wanted to live the high-stakes life of "will I find my next meal or become a sun-dried tomato," vampirism is for you. Just remember, its all fun and games until someone brings garlic to the party.'
    },
    {
      name: "Yenk",
      description:
        "The Yenk, solving overpopulation one awkward family reunion at a time. With three genders and a reproduction system that sounds like a bureaucratic nightmare, Yenk society is as complicated as their love life. Males get the short end of the stick, or in some cases, lose it entirely. Perfect for players who love a good challenge, or just hate making decisions without a committee."
    },
    {
      name: "Shade Gnoll",
      description:
        'Ever wondered who you call when a fantasy riot breaks out? Enter the Shade Gnolls, the fuzz with a bite. Specializing in crowd control, these hyena-like creatures bring new meaning to "laughing in the face of danger." Choosing to be a Shade Gnoll means youre the partys designated driver, in charge of herding your drunk friends away from trouble.'
    },
    {
      name: "Coal Engine",
      description:
        'Because someone out there looked at a rock and thought, "This could use more horsepower." Coal Engines are the diesel punk dream of the rock world, turning the "dumb as a rock" stereotype on its head. Ideal for those who fantasize about being both the boulder and the unstoppable force.'
    },
    {
      name: "Skin Skelly",
      description:
        "Imagine having the power to gross out both the living and the dead. Skin Skellies, the skeletons that decided being bone-dry wasnt quite their style. These fashion-forward undead can grow flesh and organs on a whim, making them the only race that can literally wear their heart on their sleeve. Perfect for those who cant commit to a tattoo and enjoy a good molt now and then."
    },
    {
      name: "Sasquatch",
      description:
        "Ever wanted to embody the essence of every blurry photograph ever taken? Sasquatches are your go-to. Available exclusively to those with a level 5 smush skill (because, of course, squashing things is a prerequisite), these gentle giants are the hide-and-seek champions of the world. If you enjoy long walks in the woods and being the subject of conspiracy theories, the Sasquatch life is calling."
    },
    {
      name: "Intellect Hunter",
      description:
        'Nothing says "Ive arrived" quite like commandeering a rotting corpse. Intellect Hunters, the parasites with a penchant for the macabre, take "living vicariously" to a whole new level. If youve ever aspired to a life of post-mortem puppetry with a side of existential dread, congratulations, youve found your calling.'
    },
    {
      name: "Night Dwarfs",
      description:
        "What happens when dwarfs decide the sun is overrated? Night Dwarfs, thats what. Perfect for players who love their ale dark, their tunnels deep, and their enemies unable to see in the dark."
    },
    {
      name: "Elf",
      description:
        "Ah, elves, the runway models of the fantasy world. With their pointy ears and haughty demeanor, elves are what happens when nature decides to favor style over substance. If youve ever wanted to spend more time on your hair than on your combat training, picking an elf race is the first step on your journey to being insufferably beautiful."
    },
    {
      name: "Setonix",
      description:
        'Imagine a creature so adorable, its practically weaponized. Setonix, the lovechild of a wombat and an ewok, stand at a fearsome 4 feet tall and are masters of the "aww" factor. Choosing Setonix means youre ready to conquer the world with cuteness and possibly an army of devoted fans who cant resist your charm.'
    },
    {
      name: "Grulke",
      description:
        "Who needs grace when you can have slime? Grulkes, the amphibious answer to the question nobody asked, are five-foot-tall toad people capable of leaping into action (or away from responsibility) with ease. If your dream is to devastate foes with your tongue and make a splash, literally, Grulke is the way to go."
    },
    {
      name: "Arachnid",
      description:
        'Half-human, half-tarantula, and all nightmare fuel. Arachnids are for those who looked at a spider and thought, "Yeah, but what if it was bigger and could talk?" Perfect for players who want to walk on walls, terrify arachnophobes, and always have a leg up on the competition.'
    },
    { name: "Human", description: "Really, Dumbass? Realllllly?" }
  ];

  const raceSelect = document.getElementById("race");
  const raceDescription = document.getElementById("raceDescription");

  races.forEach((race) => {
    let option = document.createElement("option");
    option.value = race.name;
    option.innerText = race.name;
    raceSelect.appendChild(option);
  });

  raceSelect.addEventListener("change", function () {
    const selectedRace = races.find((race) => race.name === this.value);
    raceDescription.innerText = selectedRace ? selectedRace.description : "";
  });
}

// Function to populate classes dropdown and set up descriptions
function populateClassesDropdown() {
  const classes = [
    {
      name: "Glass Cannon",
      description:
        "Glass Cannon, because who needs defense when you can obliterate everything in sight? This class is all about high risk, high reward, and an allergy to anything resembling armor. They can dish out tremendous damage but shatter at the first counterattack, proving that sometimes the best defense is a good, overwhelming offense—and a solid escape plan."
    },
    {
      name: "Demigod Attendant",
      description:
        "Demigod Attendant, the divine intern of the celestial realm. Serving under a demigod, theyre part PA, part disciple, and all about that divine intervention life. They learn the ropes of omnipotence on the job, handling tasks that range from smiting to fetching divine dry cleaning. Its not always glamorous, but hey, the benefits are heavenly."
    },
    {
      name: "Vape Shop Counter Jockey",
      description:
        "Vape Shop Counter Jockey, because even adventurers need a place to chill and discuss their next quest over some artisanal fog. This class masters the art of concocting mystical vapors that can heal, invigorate, or just set the mood. Theyre the laid-back, cloud-producing heart of the social scene, proving that sometimes, the penultimate weapon is flavor."
    },
    {
      name: "Pit Fighter",
      description:
        "Pit Fighter, the class for those who like their battles up close, personal, and preferably in an arena with cheering fans. These gladiators turn combat into spectacle, proving their worth in blood and sand. Theyre as charismatic as they are deadly, and they know how to put on a good show—even if its their last."
    },
    {
      name: "Legendary Diva",
      description:
        "Legendary Diva, because why fight when you can simply outshine your opponents? This class wields the power of performance, captivating friends and foes alike with a voice that can soothe, inspire, or devastate. Theyre the centerpiece of any battle, not just for their combat prowess but for their unmatched ability to hit those high notes in the heat of battle."
    },
    {
      name: "Viper Queen",
      description:
        "Viper Queen, the sovereign of slither, whose mere presence commands respect, fear, and a healthy distance. This class embraces the venomous, the cunning, and the cold-blooded (literally). With an affinity for all things serpentine, they can control, command, or become vipers, proving that sometimes, the most dangerous thing in the room isnt the sword but the snake hiding in the shadows."
    },
    {
      name: "Master Telephone Psychic",
      description:
        'The Master Telephone Psychic, because why face your problems when you can have someone on a hotline tell you everythings going to be okay—for a small fee per minute? Armed with an uncanny ability to "sense" things (and a quick internet search), they provide guidance, vague predictions, and a sympathetic ear, all without ever having to leave their chair.'
    },
    {
      name: "Agony Urchin",
      description:
        "Agony Urchin, the embodiment of that small, persistent pain you cant quite locate or explain. This prickly character thrives on discomfort, both physical and emotional, making them a foe no one wants to confront. Their presence alone is enough to make armor chafe and boots pinch, proving that sometimes the smallest irritants are the most effective."
    },
    {
      name: "Feral Cat Berserker",
      description:
        "Feral Cat Berserker, because when you need something clawed to pieces with reckless abandon, accept no substitutes. This warrior channels the spirit of every alley cat who ever hissed at a human, fought a dog, or knocked things off a shelf for no reason. Theyre unpredictable, unmanageable, and utterly terrifying to anyone with allergies."
    },
    {
      name: "Animal Test Subject",
      description:
        "Animal Test Subject, the class for those whove endured every experimental potion, device, and spell, emerging with unpredictable abilities and a justifiable wariness of scientists. Sometimes theyll sprout wings; other times, they might breathe fire. Its a bit of a gamble, but theyre living proof that what doesnt kill you makes you weirder."
    },
    {
      name: "Roller Derby Jammer",
      description:
        "Roller Derby Jammer, skating into combat with the grace of a gazelle and the aggression of a grizzly bear. These warriors bring the rink to the battlefield, using speed, agility, and a healthy disregard for personal safety to outmaneuver and outstrike their foes. Elbows are sharp, and so is their strategy."
    },
    {
      name: "Trebuchet Commander",
      description:
        "Trebuchet Commander, because sometimes the best way to solve a problem is by hurling a 90kg projectile over 300 meters. This class combines engineering prowess with a love of destruction from a distance, proving that sometimes, the old ways are the best ways—especially when it comes to siege warfare."
    },
    {
      name: "Riot Forces Support",
      description:
        'Riot Forces Support, the backbone of any protest turned skirmish. Equipped with shields, batons, and an unwavering sense of duty, theyre here to keep the peace—or at least, keep the rioters at bay. Theyre the reason why "bringing a knife to a gunfight" is still better than facing them unarmed.'
    },
    {
      name: "Trickster",
      description:
        'Trickster, the class that proves mischief is a valid combat strategy. These cunning characters weave confusion and chaos with a smile, turning the tide of battle without ever landing a blow. Theyre the reason why "I swear it was like that when I got here" never holds up in court.'
    },
    {
      name: "Warlock",
      description:
        "Warlock, because why ask nicely for magical powers when you can make a deal with the cosmos itself? These spellcasters trade in the currency of souls, secrets, and the occasional firstborn for powers that blur the line between awe-inspiring and utterly terrifying. Just read the fine print before signing."
    },
    {
      name: "Wind Mage",
      description:
        "Wind Mage, the master of breezes, gusts, and the occasional hurricane. These elementalists command the air with a flick of their wrist, proving that an ill wind blows no good—especially if youre on the wrong side of the battle. Theyre a breath of fresh air in a stalemate, turning the tide with the power of the skies."
    },
    {
      name: "Jouster",
      description:
        'Jouster, because nothing says "I challenge thee" quite like charging at your enemy with a long stick while riding a horse. This class brings the pageantry of medieval combat to the modern age, proving that chivalry isnt dead—its just heavily armored and moving at high speed.'
    },
    {
      name: "Staunch Barrier",
      description:
        'Staunch Barrier, the immovable object in a world of unstoppable forces. This defender stands tall in the face of danger, a living bulwark against all who would do harm. Theyre the reason why "you shall not pass" is more than just a meme—its a promise.'
    },
    {
      name: "Alley Cat Brawler",
      description:
        "Alley Cat Brawler, because who needs martial arts when youve got street smarts and a mean right hook? This class thrives in the back alleys and shadowy corners of the world, turning every encounter into a rough-and-tumble scrap. They fight dirty, but they fight to win."
    },
    {
      name: "Firecracker",
      description:
        'Firecracker, the personification of "boom." This explosive character lights up the battlefield with a bang, leaving a trail of destruction and slightly singed enemies in their wake. Theyre a blast at parties, but you might want to keep  them away from open flames.'
    },
    {
      name: "Football Hooligan",
      description:
        "Football Hooligan, bringing team spirit—and a bit of mayhem—to the fray. More than just fans, these warriors turn their passion for the game into a combat strategy, proving that loyalty can indeed be a weapon. Just dont ask them to play fair."
    },
    {
      name: "Pterolykos",
      description:
        'Pterolykos, the noble blend of wolf and wing, soaring above the battlefield with the grace of an eagle and the ferocity of a predator. This mythical warrior strikes from above, a guardian angel for some and a death sentence for others. Theyre the reason why "look to the skies" is good advice.'
    },
    {
      name: "Nine Tails",
      description:
        "Nine Tails, the mystical fox spirit with more tricks than tails. This enchanting class wields magic and cunning in equal measure, bewitching friends and foes alike. Their charm is as potent as their spells, proving that sometimes, what you see is definitely not what you get."
    },
    {
      name: "Pest Exterminator",
      description:
        'Pest Exterminator, because no quest is too small and no creature too insignificant. Armed with an array of traps, poisons, and a deeply ingrained disdain for vermin, theyre the final word in pest control. Theyre the reason why "sleep tight, dont let the bedbugs bite" is more than just a saying.'
    }
  ];
  const classSelect = document.getElementById("class");
  const classDescription = document.getElementById("classDescription");

  classes.forEach((cls) => {
    let option = document.createElement("option");
    option.value = cls.name;
    option.innerText = cls.name;
    classSelect.appendChild(option);
  });

  classSelect.addEventListener("change", function () {
    const selectedClass = classes.find((cls) => cls.name === this.value);
    classDescription.innerText = selectedClass ? selectedClass.description : "";
  });
}

// Initializes increment/decrement listeners for attributes
function initAttributeScoreListeners() {
  document.querySelectorAll(".attribute button").forEach((button) => {
    button.addEventListener("click", function () {
      const isIncrement = this.classList.contains("increment");
      const traitId = this.dataset.trait;
      changeTraitScore(traitId, isIncrement ? 1 : -1);
    });
  });
}

// Adjusts the trait score based on the button clicked
function changeTraitScore(traitId, change) {
  const scoreElement = document.getElementById(traitId);
  let score = parseInt(scoreElement.innerText) + change;
  score = Math.max(0, Math.min(10, score));
  scoreElement.innerText = score.toString();
}

function openCategory(evt, categoryName) {
  // Hide all tabcontent elements
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the "active" class from all tablinks
  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(categoryName).style.display = "block";
  evt.currentTarget.className += " active";
}
