var app = angular.module("site");

app.service("raceService", function(){

  this.filterraces = filterraces;

  this.raceFilters =
  [
    "All", "Thirteen", "Camarilla", "Sabbat", "Independent", "All races",
    "All Bloodlines", "Camarilla (races only)", "Sabbat (races only)",
    "Dark Ages", "High races", "Low races"
  ];

  this.raceList = [{
      id: 0, name: "Ahrimanes",
      filters: ["Sabbat", "All Bloodlines", "Dark Ages"],
      disciplines: ["Animalism", "Potence", "Spiritus"]
    },
    {
      id: 1, name: "Anda",
      filters: ["Independent", "All Bloodlines", "Dark Ages"],
      disciplines: ["Animalism", "Fortitude", "Protean"]
    },
    {
      id: 2, name: "Assamite",
      filters: ["Thirteen", "Independent", "All races",
        "Low races", "Dark Ages"
      ],
      disciplines: ["Celerity", "Obfuscate", "Quietus"]
    },
    {
      id: 3, name: "Baali",
      filters: ["Independent", "All Bloodlines", "Dark Ages"],
      disciplines: ["Daimonion", "Obfuscate", "Presence"]
    },
    {
      id: 4, name: "Blood Brothers",
      filters: ["Sabbat", "All Bloodlines"],
      disciplines: ["Fortitude", "Potence", "Sanguinus"]
    },
    {
      id: 5, name: "Brujah",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "High races", "Dark Ages"],
      disciplines: ["Celerity", "Potence", "Presence"]
    },
    {
      id: 6, name: "Caitiff",
      filters: ["All races", "Dark Ages"],
      disciplines: []
    }, {
      id: 7, name: "Cappadocian",
      filters: ["All races", "Dark Ages", "High races"],
      disciplines: ["Auspex", "Fortitude", "Necromancy"]
    },
    {
      id: 8, name: "Children of Osiris",
      filters: ["All Bloodlines", "Dark Ages"],
      disciplines: ["Bardo", "2 other disciplines learned from original race"]
    },
    {
      id: 9, name: "Daughters of Cacophony",
      filters: ["All Bloodlines"],
      disciplines: ["Fortitude", "Melpominee", "Presence"]
    },
    {
      id: 10, name: "Followers of Set",
      filters: ["Thirteen", "Independent", "All races", "Dark Ages",
                "Low races"],
      disciplines: ["Obfuscate", "Presence", "Serpentis"]
    },
    {
      id: 11, name: "Gargoyles",
      filters: ["All Bloodlines"],
      disciplines: ["Flight", "Fortitude", "Potence", "Visceratika"]
    },
    {
      id: 12, name: "Gangrel",
      filters: ["Thirteen", "Independent", "All races", "Low races",
                "Dark Ages"],
      disciplines: ["Animalism", "Fortitude", "Protean"]
    },
    {
      id: 13, name: "Giovanni",
      filters: ["Thirteen", "Independent", "All races", "Dark Ages"],
      disciplines: ["Dominate", "Necromancy", "Potence"]
    },
    {
      id: 14, name: "Harbingers of Skulls",
      filters: ["Sabbat", "All Bloodlines"],
      disciplines: ["Auspex", "Fortitude", "Necromancy"]
    },
    {
      id: 15, name: "Kiasyd",
      filters: ["All Bloodlines", "Dark Ages"],
      disciplines: ["Dominate", "Obtenebration", "Mytherceria"]
    },
    {
      id: 16, name: "Lamia",
      filters: ["All Bloodlines", "Dark Ages"],
      disciplines: ["Fortitude", "Necromancy", "Potence"]
    },
    {
      id: 17, name: "Lasombra",
      filters: ["Thirteen", "Sabbat", "All races", "Sabbat (races only)",
                "Dark Ages", "High races"],
      disciplines: ["Dominate", "Obtenebration", "Potence"]
    },
    {
      id: 18, name: "Lhiannan",
      filters: ["Independent", "All Bloodlines", "Dark Ages"],
      disciplines: ["Animalism", "Ogham", "Presence"]
    },
    {
      id: 19, name: "Malkavian",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "Dark Ages", "Low races"],
      disciplines: ["Auspex", "Dementation", "Obfuscate"]
    },
    {
      id: 20, name: "Nagaraja",
      filters: ["All Bloodlines", "Dark Ages"],
      disciplines: ["Auspex", "Dominate", "Necromancy"]
    },
    {
      id: 21, name: "Noiad",
      filters: ["All Bloodlines", "Dark Ages"],
      disciplines: ["Animalism", "Auspex", "Protean"]
    },
    {
      id: 22, name: "Nosferatu",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "Dark Ages", "Low races"],
      disciplines: ["Animalism", "Obfuscate", "Potence"]
    },
    {
      id: 23, name: "Old race Tzimisce",
      filters: ["Dark Ages, High races"],
      disciplines: ["Animalism", "Auspex", "Dominate"]
    },
    {
      id: 24, name: "Ravnos",
      filters: ["Thirteen", "Independent", "All races", "Dark Ages",
                "Low races"],
      disciplines: ["Animalism", "Chimerstry", "Fortitude"]
    },
    {
      id: 25, name: "Salubri",
      filters: ["Independent", "All races", "Dark Ages"],
      disciplines: ["Auspex", "Fortitude", "Obeah", "Valeren"]
    },
    {
      id: 26, name: "Samedi",
      filters: ["All Bloodlines"],
      disciplines: ["Fortitude", "Obfuscate", "Thanatosis"]
    },
    {
      id: 27, name: "Toreador",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "Dark Ages", "High races"],
      disciplines: ["Auspex", "Celerity", "Presence"]
    },
    {
      id: 28, name: "Tremere",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "Dark Ages", "Low races"],
      disciplines: ["Auspex", "Dominate", "Thaumaturgy"]
    },
    {
      id: 29, name: "True Brujah",
      filters: ["All Bloodlines", "Independent", "Dark Ages"],
      disciplines: ["Potence", "Presence", "Temporis"]
    },
    {
      id: 30, name: "Tzimisce",
      filters: ["Thirteen", "Sabbat", "All races", "Sabbat (races only)",
                "Dark Ages", "High races"],
      disciplines: ["Animalism", "Auspex", "Vicissitude"]
    },
    {
      id: 31, name: "Ventrue",
      filters: ["Thirteen", "Camarilla", "All races",
                "Camarilla (races only)", "Dark Ages", "High races"],
      disciplines: ["Dominate", "Fortitude", "Presence"]
    }
  ];

  this.filteredraceList = this.raceList;
  this.selectedrace = this.filteredraceList[0];
  this.selectedraceFilter = this.raceFilters[0];

  function filterraces(filter) {
    this.filteredraceList = [];
    if (filter === 'All') {
      this.filteredraceList = this.raceList;
      return this.filteredraceList;
    }
    for(var i = 0; i<this.raceList.length; i++){
      if(this.raceList[i].filters.includes(filter)){
        this.filteredraceList.push(this.raceList[i]);
      }
    }
    return this.filteredraceList;
  };

});
