import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// FULL LOCATION DATA: Countries → Regions → Cities → Neighborhoods
// ============================================================
const locationData = [
  {
    name: 'Togo', code: 'TG', phoneCode: '+228', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Maritime', cities: [
          { name: 'Lomé', neighborhoods: ['Adidogomé', 'Agoè', 'Bè', 'Tokoin', 'Nyékonakpoè', 'Djidjolé', 'Kodjoviakopé', 'Hédzranawoé', 'Vakpossito', 'Légba'] },
          { name: 'Tsévié', neighborhoods: ['Centre-ville', 'Quartier Résidentiel'] },
          { name: 'Tabligbo', neighborhoods: [] },
          { name: 'Vogan', neighborhoods: [] },
        ]
      },
      {
        name: 'Plateaux', cities: [
          { name: 'Atakpamé', neighborhoods: ['Atakpamé-Centre', 'Kouka', 'Lili'] },
          { name: 'Kpalimé', neighborhoods: ['Centre', 'Adeta', 'Kouma-Konda'] },
          { name: 'Badou', neighborhoods: [] },
          { name: 'Amlamé', neighborhoods: [] },
        ]
      },
      {
        name: 'Centrale', cities: [
          { name: 'Sokodé', neighborhoods: ['Centre', 'Kassena', 'Kpangalam'] },
          { name: 'Sotouboua', neighborhoods: [] },
        ]
      },
      {
        name: 'Kara', cities: [
          { name: 'Kara', neighborhoods: ['Centre', 'Kpékplémé', 'Tchatchouli'] },
          { name: 'Niamtougou', neighborhoods: [] },
          { name: 'Bassar', neighborhoods: [] },
        ]
      },
      {
        name: 'Savanes', cities: [
          { name: 'Dapaong', neighborhoods: ['Centre', 'Bombouaka'] },
          { name: 'Mango', neighborhoods: [] },
        ]
      },
    ]
  },
  {
    name: 'Bénin', code: 'BJ', phoneCode: '+229', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Littoral', cities: [
          { name: 'Cotonou', neighborhoods: ['Akpakpa', 'Cadjèhoun', 'Fidjrossè', 'Gbèdjromèdji', 'Haie Vive', 'Jéricho', 'Menontin', 'Aidjèdo', 'Zongo', 'Gbégamey', 'Vodjè', 'Cocotomey', 'Agla', 'Sainte-Rita'] },
        ]
      },
      {
        name: 'Atlantique', cities: [
          { name: 'Abomey-Calavi', neighborhoods: ['Godomey', 'Togba', 'Kpanroun', 'Akassato', 'Zinvié'] },
          { name: 'Ouidah', neighborhoods: ['Centre', 'Houèzounmè'] },
          { name: 'Allada', neighborhoods: [] },
        ]
      },
      {
        name: 'Ouémé', cities: [
          { name: 'Porto-Novo', neighborhoods: ['Ouando', 'Agbonlin', 'Tokpa', 'Djassin', 'Ahouansori'] },
          { name: 'Sèmè-Kpodji', neighborhoods: [] },
          { name: 'Dangbo', neighborhoods: [] },
        ]
      },
      {
        name: 'Zou', cities: [
          { name: 'Abomey', neighborhoods: ['Centre', 'Djègbé'] },
          { name: 'Bohicon', neighborhoods: ['Centre', 'Saclo'] },
        ]
      },
      {
        name: 'Borgou', cities: [
          { name: 'Parakou', neighborhoods: ['Banikanni', 'Zongo', 'Baka', 'Madina', 'Ganhi'] },
          { name: 'Nikki', neighborhoods: [] },
        ]
      },
    ]
  },
  {
    name: "Côte d'Ivoire", code: 'CI', phoneCode: '+225', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Abidjan', cities: [
          { name: 'Plateau', neighborhoods: ['Centre administratif', 'Plateau'] },
          { name: 'Cocody', neighborhoods: ['Deux Plateaux', 'Angré', 'Riviera', 'Bonoumin', 'Danga', 'Akouédo', 'Blockhaus'] },
          { name: 'Yopougon', neighborhoods: ['Selmer', 'Niangon', 'Toits Rouges', 'Wassakara', 'Kouté', 'Maroc'] },
          { name: 'Abobo', neighborhoods: ['Sogefia', 'N\'Dotré', 'Banco', 'PK18', 'Avocatier'] },
          { name: 'Marcory', neighborhoods: ['Anoumabo', 'Zone 4', 'Biétry'] },
          { name: 'Treichville', neighborhoods: ['Arras', 'Dépôt'] },
          { name: 'Adjamé', neighborhoods: ['Williamsville', 'Amissa', 'Renouard'] },
          { name: 'Koumassi', neighborhoods: [] },
          { name: 'Port-Bouët', neighborhoods: ['Vridi', 'Gonzagueville'] },
          { name: 'Attécoubé', neighborhoods: [] },
          { name: 'Bingerville', neighborhoods: [] },
          { name: 'Anyama', neighborhoods: [] },
        ]
      },
      {
        name: 'Yamoussoukro', cities: [
          { name: 'Yamoussoukro', neighborhoods: ['Quartier du Lycée', 'Habitat', 'Dioulakro', 'Millionnaire'] },
        ]
      },
      {
        name: 'Bouaké', cities: [
          { name: 'Bouaké', neighborhoods: ['Air France', 'Belleville', 'Commerce', 'Dar Es Salam', 'N\'Gattakro'] },
          { name: 'Sakassou', neighborhoods: [] },
        ]
      },
      {
        name: 'San-Pédro', cities: [
          { name: 'San-Pédro', neighborhoods: ['Cité', 'Balmer', 'Bardo'] },
        ]
      },
      {
        name: 'Daloa', cities: [
          { name: 'Daloa', neighborhoods: ['Lobia', 'Marais', 'Tazibouo'] },
        ]
      },
    ]
  },
  {
    name: 'Sénégal', code: 'SN', phoneCode: '+221', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Dakar', cities: [
          { name: 'Dakar', neighborhoods: ['Plateau', 'Médina', 'Fann', 'Point E', 'Sacré-Cœur', 'Mermoz', 'Liberté', 'Ouakam', 'Ngor', 'Yoff', 'Almadies', 'Parcelles Assainies', 'Guédiawaye'] },
          { name: 'Rufisque', neighborhoods: ['Rufisque-Est', 'Rufisque-Ouest', 'Diokoul'] },
          { name: 'Pikine', neighborhoods: ['Pikine-Nord', 'Pikine-Dagoudane', 'Thiaroye'] },
        ]
      },
      {
        name: 'Thiès', cities: [
          { name: 'Thiès', neighborhoods: ['Cité Lamy', 'Randoulène', 'Mbour 3', 'Cité Ballabey'] },
          { name: 'Mbour', neighborhoods: ['Mbour-Centre', 'Thioffior', 'Fissel'] },
          { name: 'Tivaouane', neighborhoods: [] },
        ]
      },
      {
        name: 'Diourbel', cities: [
          { name: 'Touba', neighborhoods: ['Darou Khoudoss', 'Ndamatou', 'Guédé Bousso'] },
          { name: 'Mbacké', neighborhoods: [] },
          { name: 'Diourbel', neighborhoods: [] },
        ]
      },
      {
        name: 'Saint-Louis', cities: [
          { name: 'Saint-Louis', neighborhoods: ['Île de Saint-Louis', 'Sor', 'Guet Ndar', 'Lodo'] },
          { name: 'Richard-Toll', neighborhoods: [] },
        ]
      },
      {
        name: 'Ziguinchor', cities: [
          { name: 'Ziguinchor', neighborhoods: ['Boucotte', 'Kandialang', 'Tilène'] },
        ]
      },
    ]
  },
  {
    name: 'Mali', code: 'ML', phoneCode: '+223', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Bamako', cities: [
          { name: 'Bamako', neighborhoods: ['Badalabougou', 'ACI 2000', 'Hamdallaye', 'Lafiabougou', 'Magnambougou', 'Faladié', 'Kalaban-Coro', 'Niamakoro', 'Sogoniko', 'Sabalibougou'] },
          { name: 'Kati', neighborhoods: [] },
        ]
      },
      {
        name: 'Sikasso', cities: [
          { name: 'Sikasso', neighborhoods: ['Wayerma', 'Médina', 'Sanoubougou'] },
          { name: 'Bougouni', neighborhoods: [] },
        ]
      },
      {
        name: 'Koulikoro', cities: [
          { name: 'Koulikoro', neighborhoods: [] },
          { name: 'Kangaba', neighborhoods: [] },
        ]
      },
      {
        name: 'Ségou', cities: [
          { name: 'Ségou', neighborhoods: ['Hamdallaye', 'Pelengana'] },
          { name: 'San', neighborhoods: [] },
        ]
      },
    ]
  },
  {
    name: 'Burkina Faso', code: 'BF', phoneCode: '+226', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Centre', cities: [
          { name: 'Ouagadougou', neighborhoods: ['Hamdalaye', 'Wemtenga', 'Dassasgho', 'Paspanga', 'Cissin', 'Kalgondé', 'Zogona', 'Gounghin', 'Ouidi', 'Sig-Nonghin', 'Tampouy', 'Larlé', 'Koulouba', 'Ouaga 2000', "Patte d'Oie", 'Somgandé'] },
          { name: 'Kadiogo', neighborhoods: [] }
        ]
      },
      {
        name: 'Hauts-Bassins', cities: [
          { name: 'Bobo-Dioulasso', neighborhoods: ['Secteur 1', 'Secteur 2', 'Koko', 'Dafra', 'Tounouma', 'Colsama', 'Sarfalao', 'Bindougousso', 'Accart-ville'] },
          { name: 'Houndé', neighborhoods: [] },
          { name: 'Orodara', neighborhoods: [] }
        ]
      },
      {
        name: 'Centre-Ouest', cities: [
          { name: 'Koudougou', neighborhoods: ['Secteur 1', 'Secteur 2', 'Bourkina'] },
          { name: 'Léo', neighborhoods: [] },
          { name: 'Réo', neighborhoods: [] }
        ]
      },
      {
        name: 'Boucle du Mouhoun', cities: [
          { name: 'Dédougou', neighborhoods: [] },
          { name: 'Tougan', neighborhoods: [] },
          { name: 'Nouna', neighborhoods: [] }
        ]
      },
      {
        name: 'Nord', cities: [
          { name: 'Ouahigouya', neighborhoods: ['Secteur 1', 'Secteur 2'] },
          { name: 'Gourcy', neighborhoods: [] },
          { name: 'Titao', neighborhoods: [] }
        ]
      },
      {
        name: 'Est', cities: [
          { name: 'Fada N\'Gourma', neighborhoods: [] },
          { name: 'Bogandé', neighborhoods: [] }
        ]
      },
      {
        name: 'Centre-Est', cities: [
          { name: 'Tenkodogo', neighborhoods: [] },
          { name: 'Koupéla', neighborhoods: [] },
          { name: 'Pouytenga', neighborhoods: [] }
        ]
      },
      {
        name: 'Centre-Nord', cities: [
          { name: 'Kaya', neighborhoods: [] },
          { name: 'Boulsa', neighborhoods: [] },
          { name: 'Kongoussi', neighborhoods: [] }
        ]
      },
      {
        name: 'Sahel', cities: [
          { name: 'Dori', neighborhoods: [] },
          { name: 'Djibo', neighborhoods: [] },
          { name: 'Gorom-Gorom', neighborhoods: [] }
        ]
      },
      {
        name: 'Cascades', cities: [
          { name: 'Banfora', neighborhoods: ['Secteur 1', 'Secteur 2'] },
          { name: 'Sindou', neighborhoods: [] }
        ]
      },
      {
        name: 'Sud-Ouest', cities: [
          { name: 'Gaoua', neighborhoods: [] },
          { name: 'Diébougou', neighborhoods: [] },
          { name: 'Batié', neighborhoods: [] }
        ]
      },
      {
        name: 'Plateau-Central', cities: [
          { name: 'Ziniaré', neighborhoods: [] },
          { name: 'Zorgho', neighborhoods: [] },
          { name: 'Boussé', neighborhoods: [] }
        ]
      },
      {
        name: 'Centre-Sud', cities: [
          { name: 'Manga', neighborhoods: [] },
          { name: 'Pô', neighborhoods: [] },
          { name: 'Kombissiri', neighborhoods: [] }
        ]
      }
    ]
  },
  {
    name: 'Niger', code: 'NE', phoneCode: '+227', currency: 'XOF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Niamey', cities: [
          { name: 'Niamey', neighborhoods: ['Plateau', 'Gamkallé', 'Boukoki', 'Saga', 'Koiratagui', 'Yantala', 'Nouveau Marché', 'Kirkissoye'] },
        ]
      },
      { name: 'Zinder', cities: [{ name: 'Zinder', neighborhoods: [] }] },
      { name: 'Maradi', cities: [{ name: 'Maradi', neighborhoods: [] }] },
      { name: 'Tahoua', cities: [{ name: 'Tahoua', neighborhoods: [] }] },
    ]
  },
  {
    name: 'Guinée', code: 'GN', phoneCode: '+224', currency: 'GNF', currencySymbol: 'FG',
    regions: [
      {
        name: 'Conakry', cities: [
          { name: 'Conakry', neighborhoods: ['Kaloum', 'Dixinn', 'Ratoma', 'Matoto', 'Matam', 'Kipé', 'Lambanyi', 'Hamdallaye'] },
        ]
      },
      { name: 'Kindia', cities: [{ name: 'Kindia', neighborhoods: [] }] },
      { name: 'Labé', cities: [{ name: 'Labé', neighborhoods: [] }] },
      { name: 'Kankan', cities: [{ name: 'Kankan', neighborhoods: [] }] },
    ]
  },
  {
    name: 'Ghana', code: 'GH', phoneCode: '+233', currency: 'GHS', currencySymbol: 'GH₵',
    regions: [
      {
        name: 'Greater Accra', cities: [
          { name: 'Accra', neighborhoods: ['Osu', 'Labone', 'Airport Residential', 'East Legon', 'Cantonments', 'Adabraka', 'Dansoman', 'Tema', 'Madina', 'Achimota'] },
          { name: 'Tema', neighborhoods: [] },
          { name: 'Kasoa', neighborhoods: [] },
        ]
      },
      {
        name: 'Ashanti', cities: [
          { name: 'Kumasi', neighborhoods: ['Adum', 'Bantama', 'Nhyiaeso', 'Asokwa', 'Suame'] },
          { name: 'Obuasi', neighborhoods: [] },
        ]
      },
      { name: 'Western', cities: [{ name: 'Takoradi', neighborhoods: ['Takoradi Centre', 'Effia'] }] },
      { name: 'Eastern', cities: [{ name: 'Koforidua', neighborhoods: [] }] },
    ]
  },
  {
    name: 'Nigéria', code: 'NG', phoneCode: '+234', currency: 'NGN', currencySymbol: '₦',
    regions: [
      {
        name: 'Lagos', cities: [
          { name: 'Lagos Island', neighborhoods: ['Victoria Island', 'Lekki', 'Ikoyi', 'Bar Beach'] },
          { name: 'Ikeja', neighborhoods: ['GRA Ikeja', 'Alausa', 'Ogba', 'Maryland'] },
          { name: 'Surulere', neighborhoods: ['Iganmu', 'Aguda'] },
          { name: 'Yaba', neighborhoods: [] },
          { name: 'Apapa', neighborhoods: [] },
          { name: 'Oshodi', neighborhoods: [] },
        ]
      },
      {
        name: 'Abuja', cities: [
          { name: 'Abuja', neighborhoods: ['Maitama', 'Asokoro', 'Wuse', 'Garki', 'Gwarinpa', 'Kubwa', 'Jabi'] },
        ]
      },
      { name: 'Kano', cities: [{ name: 'Kano', neighborhoods: ['Nassarawa', 'Tarauni', 'Fagge'] }] },
      { name: 'Rivers', cities: [{ name: 'Port Harcourt', neighborhoods: ['GRA Phase 1', 'GRA Phase 2', 'Rumuola'] }] },
    ]
  },
  {
    name: 'Cameroun', code: 'CM', phoneCode: '+237', currency: 'XAF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Centre', cities: [
          { name: 'Yaoundé', neighborhoods: ['Bastos', 'Nlongkak', 'Mvan', 'Mimboman', 'Essos', 'Elig-Essono', 'Biyem-Assi', 'Mvog-Ada', 'Mfoundi'] },
        ]
      },
      {
        name: 'Littoral', cities: [
          { name: 'Douala', neighborhoods: ['Akwa', 'Bonanjo', 'Bali', 'Deido', 'Makepe', 'Logbessou', 'Bonaberi', 'Ndokotti', 'Kotto', 'Japoma'] },
          { name: 'Nkongsamba', neighborhoods: [] },
        ]
      },
      { name: 'Ouest', cities: [{ name: 'Bafoussam', neighborhoods: ['Centre', 'Tougang', 'Djeleng'] }] },
      { name: 'Nord-Ouest', cities: [{ name: 'Bamenda', neighborhoods: ['Commercial Avenue', 'Up Station', 'Nkwen'] }] },
    ]
  },
  {
    name: 'Gabon', code: 'GA', phoneCode: '+241', currency: 'XAF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Estuaire', cities: [
          { name: 'Libreville', neighborhoods: ['Louis', 'Lalala', 'Akanda', 'PK5', 'PK6', 'PK8', 'Nkembo', 'Nombakélé', 'Ancien Sobraga'] },
        ]
      },
      { name: 'Haut-Ogooué', cities: [{ name: 'Franceville', neighborhoods: [] }] },
      { name: 'Moyen-Ogooué', cities: [{ name: 'Lambaréné', neighborhoods: [] }] },
      { name: 'Ogooué-Maritime', cities: [{ name: 'Port-Gentil', neighborhoods: ['Grand Village', 'Ozouri', 'Ntchengué'] }] },
    ]
  },
  {
    name: 'Congo', code: 'CG', phoneCode: '+242', currency: 'XAF', currencySymbol: 'FCFA',
    regions: [
      {
        name: 'Brazzaville', cities: [
          { name: 'Brazzaville', neighborhoods: ['Poto-Poto', 'Bacongo', 'Moungali', 'Talangaï', 'Madibou', 'Makélékélé', 'Djiri'] },
        ]
      },
      {
        name: 'Pointe-Noire', cities: [
          { name: 'Pointe-Noire', neighborhoods: ['Centre-ville', 'Mongo-Mpoukou', 'Tié-Tié', 'Mvou-Mvou', 'Loandjili'] },
        ]
      },
      { name: 'Niari', cities: [{ name: 'Dolisie', neighborhoods: [] }] },
      { name: 'Pool', cities: [{ name: 'Kinkala', neighborhoods: [] }] },
    ]
  },
  {
    name: 'RDC', code: 'CD', phoneCode: '+243', currency: 'CDF', currencySymbol: 'FC',
    regions: [
      {
        name: 'Kinshasa', cities: [
          { name: 'Kinshasa', neighborhoods: ['Gombe', 'Kintambo', 'Ngaliema', 'Lingwala', 'Barumbu', 'Kasa-Vubu', 'Kalamu', 'Lemba', 'Ngaba', 'Limete'] },
        ]
      },
      { name: 'Kongo Central', cities: [{ name: 'Matadi', neighborhoods: [] }, { name: 'Boma', neighborhoods: [] }] },
      { name: 'Haut-Katanga', cities: [{ name: 'Lubumbashi', neighborhoods: ['Kenya', 'Kampemba', 'Rwashi'] }] },
      { name: 'Nord-Kivu', cities: [{ name: 'Goma', neighborhoods: ['Himbi', 'Karisimbi', 'Goma-Centre'] }] },
    ]
  },
  {
    name: 'Tchad', code: 'TD', phoneCode: '+235', currency: 'XAF', currencySymbol: 'FCFA',
    regions: [
      {
        name: "N'Djamena", cities: [
          { name: "N'Djamena", neighborhoods: ['Moursal', 'Habbena', 'Sabangali', 'Toukra', 'Ndjari', 'Chagoua'] },
        ]
      },
      { name: 'Logone Occidental', cities: [{ name: 'Moundou', neighborhoods: [] }] },
      { name: 'Logone Oriental', cities: [{ name: 'Doba', neighborhoods: [] }] },
      { name: 'Moyen-Chari', cities: [{ name: 'Sarh', neighborhoods: [] }] },
    ]
  },
];

async function seedLocations() {
  console.log('\n🌍 Seeding comprehensive location data...\n');
  let countriesAdded = 0, regionsAdded = 0, citiesAdded = 0, neighborhoodsAdded = 0;

  for (const c of locationData) {
    // Upsert country
    let country = await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: {
        name: c.name, code: c.code,
        phoneCode: c.phoneCode, currency: c.currency, currencySymbol: c.currencySymbol
      }
    });
    if (!country.name) countriesAdded++;

    for (const r of c.regions) {
      // Upsert region
      let region = await prisma.region.findFirst({ where: { name: r.name, countryId: country.id } });
      if (!region) {
        region = await prisma.region.create({ data: { name: r.name, countryId: country.id } });
        regionsAdded++;
      }

      // Clean up default "Capitale / Principale" city if it exists
      await prisma.city.deleteMany({ where: { name: 'Capitale / Principale', regionId: region.id } });

      for (const city of r.cities) {
        let cityRecord = await prisma.city.findFirst({ where: { name: city.name, regionId: region.id } });
        if (!cityRecord) {
          cityRecord = await prisma.city.create({ data: { name: city.name, regionId: region.id } });
          citiesAdded++;
          console.log(`  ✅ Ville: ${city.name} (${r.name}, ${c.name})`);
        }

        for (const nb of city.neighborhoods) {
          const existing = await prisma.neighborhood.findFirst({ where: { name: nb, cityId: cityRecord.id } });
          if (!existing) {
            await prisma.neighborhood.create({ data: { name: nb, cityId: cityRecord.id } });
            neighborhoodsAdded++;
          }
        }
      }
    }
  }

  console.log('\n============================================');
  console.log(`✅ Countries  : ${countriesAdded} nouveaux`);
  console.log(`✅ Régions    : ${regionsAdded} nouvelles`);
  console.log(`✅ Villes     : ${citiesAdded} nouvelles`);
  console.log(`✅ Quartiers  : ${neighborhoodsAdded} nouveaux`);
  console.log('🎉 Seed terminé avec succès !');
}

seedLocations().catch(console.error).finally(() => prisma.$disconnect());
