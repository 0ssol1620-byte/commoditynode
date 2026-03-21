const fs = require('fs');
const path = require('path');
const postsDir = path.join(__dirname, '..', '_posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

// Additional mappings for remaining sectors
const positiveToProducer = ['E&P', 'Integrated Oil', 'Gas Production', 'Coffee Production', 'LNG Export', 'Iron Ore', 'Steel Production', 'Lithium Development', 'Uranium Development', 'Sugar/Ethanol', 'Lumber Producer', 'Coking Coal', 'Cocoa Trading', 'Cocoa Farming', 'Copper Development', 'Cobalt Development', 'Ethanol', 'Ethanol Producer', 'State Uranium', 'Lithium Production', 'Natural Gas Production', 'NGL Production', 'Aluminum Production', 'Sugar Milling', 'Farming', 'Crops', 'Bauxite', 'Potash', 'Nitrogen', 'Specialty Agriculture', 'Grains', 'Natural Gas E&P', 'Natural Gas', 'Value-Added Ore', 'Aluminum Smelter', 'Aluminum Integrated'];
const positiveToProcessor = ['Ingredients', 'Blending', 'Enrichment', 'Rendering', 'Sweeteners', 'Edible Oils', 'Commodity Trading', 'Uranium Enrichment', 'Nuclear Fuel Cycle', 'Nuclear Fuel', 'Fuel Cycle', 'Agribusiness', 'Biofuels'];
const positiveToSupplier = ['Aggregates', 'Railroad', 'Railroads', 'Midstream', 'Midstream/MLP', 'NGL Midstream', 'Compression Services', 'Nuclear Components', 'Nuclear Services', 'Nuclear Technology', 'Titanium Components', 'Aerospace Metals/Parts', 'Advanced Nuclear', 'Small Modular Reactors', 'Construction Equip', 'Construction Equipment', 'Farm/Construction Equipment'];
const positiveToConsumer = ['Fertilizer', 'Fertilizers', 'Farm Equipment', 'Nuclear Utility', 'Solar', 'Renewable Utility', 'Nuclear Generation', 'Nuclear/Retail Power', 'Renewable/Global Utility', 'Renewable IPP', 'Nuclear/Regulated', 'Renewable YieldCo', 'Power Generation', 'Power Gen', 'Nuclear/Renewables', 'Utilities', 'Grid', 'Nitrogen Fertilizer', 'Phosphate/Potash', 'Crop Protection', 'Crop Chemicals', 'Diversified Fertilizer', 'Seed/Crop Science', 'Seed/Crop Protection', 'Seeds/Crop Protection', 'Seeds / Crop Protection', 'Fertilizer/Retail', 'Ag Inputs', 'Specialty Minerals', 'Nitrogen Pricing', 'Crop Protection'];
const positiveToSubstitute = ['Recycling', 'Battery Recycling', 'Metal Recycling', 'Scrap Recycling', 'Alternatives', 'Renewables', 'Synthetic Fiber', 'Synthetic Fibers', 'Solid-State Battery', 'Alt. Technology', 'Competing Feedstock', 'Sustainability'];
const positiveToRegional = ['National Board', 'Farmland REIT', 'Timberland REIT', 'Timber REIT', 'Ethanol Investor'];
const positiveToMacro = ['Finance', 'Real Estate', 'Physical Trust', 'Numismatics', 'Critical Minerals', 'Rare Earths', 'Rare Earth/Materials', 'Specialty Metals', 'Manufacturing', 'Industrial', 'Building Materials', 'Pulp & Paper', 'Packaging/Paper'];

const negativeToConsumer = ['Packaged Food', 'Hotels', 'Cruise Lines', 'Poultry', 'Livestock', 'Travel/OTA', 'Fast Food', 'Auto Parts', 'Food Processing', 'Steel', 'Steel Producer', 'Steel Production', 'Steel Manufacturing', 'Fuel Cells', 'Meat Processing', 'Animal Feed', 'Travel Platform', 'Coffee Roasting', 'Industrial', 'Industrials', 'Food Manufacturing', 'Packaged Meat', 'Appliances', 'Heavy Equipment', 'Ag Processing', 'Aluminum Rolling', 'Express / Parcel', 'Food & Coffee', 'Coffee Chain', 'Artisan Coffee', 'Coffee Capsules', 'Coffee Distribution', 'Home Improvement', 'QSR', 'Paint/Coatings', 'Chocolate', 'Snacks/Chocolate', 'Food/Chocolate', 'Chocolate Processing', 'Specialty Chocolate', 'Premium Chocolate', 'Artisan Chocolate', 'Beauty', 'Aircraft Mfg', 'Cement/Aggregates', 'Wire Manufacturing', 'Building Materials', 'Bakery', 'Flour Milling', 'Cereal', 'Food Ingredients', 'Packaged Foods', 'Meat', 'Food Import', 'Flavoring', 'B2B Coffee', 'Snacks', 'Bakeries', 'Grocery', 'Coffee/Bakery', 'Catalysts', 'Auto Catalysts', 'Auto Components', 'Industrial Components', 'Acetyls/Specialty', 'Polyurethanes', 'Vinyls/Polyethylene', 'Specialty Ingredients', 'Chlor-Alkali', 'Coatings', 'Grain Processing', 'Potato Processing', 'Meat Products', 'Household Products', 'Household/Oral Care', 'Beer/Wine/Spirits', 'Cereal/Snacks', 'Yarn Maker', 'Basics/Underwear', 'Agri-Processing', 'CPG', 'Building Products', 'Residential', 'Aerostructures', 'Catalyst Manufacturing', 'Baked Goods', 'Industrial Gas', 'Luxury Fashion', 'Denim', 'Home Goods', 'Garment Mfg', 'Solder Materials', 'Protein/Livestock', 'Protein / Livestock', 'Stainless Steel', 'Data Centers', 'Hardware/Servers', 'Industrial Tech', 'Wind Turbines', 'Wind/Power', 'Electrical Equipment', 'Electrical Components', 'Electronic Instruments', 'Power Management', 'Wire/Cable', 'Wire & Cable', 'Electrical Products', 'Electrical Contractor', 'Electrical Contractors', 'HVAC'];
const negativeToProcessor = ['Battery Manufacturing', 'Battery Cathode', 'Battery Cell Maker', 'Battery Cells', 'Battery Tech', 'Grain Trading', 'Direct Reduction', 'Green Steel', 'Metal Processing', 'EMS/Contract Mfg', 'Contract Manufacturing', 'PCB Manufacturing'];
const negativeToSubstitute = ['Renewable Fuels', 'Renewable Energy', 'Clean Energy', 'Green Hydrogen', 'Hydrogen Trucks', 'Solid-State Battery', 'Fuel Blending', 'Biofuel', 'Ethanol', 'Imaging', 'Photography', 'Synthetic Fiber'];
const negativeToRegional = ['Homebuilding', 'Real Estate', 'Commercial REIT'];
const negativeToMacro = ['Banking', 'Growth Equity', 'Physical', 'Bonds', 'Services', 'B2B', 'Labor', 'Container Shipping', 'Coal', 'Natural Gas', 'Infrastructure', 'Infrastructure Contractor', 'Grid Storage', 'Charging Infra'];

function matchSector(sector, list) {
  return list.some(s => s.toLowerCase() === sector.toLowerCase());
}

let changed = 0, totalChanges = 0;
files.forEach(f => {
  const filePath = path.join(postsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  const scriptMatch = content.match(/<script>\s*\nwindow\.COMMODITY_DATA[\s\S]*?<\/script>/);
  if (!scriptMatch) return;
  let scriptBlock = scriptMatch[0];
  let fileChanges = 0;

  // Process positive nodes
  scriptBlock = scriptBlock.replace(/(\{\s*id:\s*"[^"]+",\s*label:\s*"[^"]+",\s*type:\s*)"positive"(,\s*impact:\s*[\d.]+[^}]*sector:\s*"([^"]*)")/g, (m, pre, post, sector) => {
    let newType = 'positive';
    if (matchSector(sector, positiveToProducer)) newType = 'producer';
    else if (matchSector(sector, positiveToProcessor)) newType = 'processor';
    else if (matchSector(sector, positiveToSupplier)) newType = 'supplier';
    else if (matchSector(sector, positiveToConsumer)) newType = 'consumer';
    else if (matchSector(sector, positiveToSubstitute)) newType = 'substitute';
    else if (matchSector(sector, positiveToRegional)) newType = 'regional';
    else if (matchSector(sector, positiveToMacro)) newType = 'macro';
    if (newType !== 'positive') { fileChanges++; return pre + '"' + newType + '"' + post; }
    return m;
  });

  // Process negative nodes
  scriptBlock = scriptBlock.replace(/(\{\s*id:\s*"[^"]+",\s*label:\s*"[^"]+",\s*type:\s*)"negative"(,\s*impact:\s*-[\d.]+[^}]*sector:\s*"([^"]*)")/g, (m, pre, post, sector) => {
    let newType = 'negative';
    if (matchSector(sector, negativeToConsumer)) newType = 'consumer';
    else if (matchSector(sector, negativeToProcessor)) newType = 'processor';
    else if (matchSector(sector, negativeToSubstitute)) newType = 'substitute';
    else if (matchSector(sector, negativeToRegional)) newType = 'regional';
    else if (matchSector(sector, negativeToMacro)) newType = 'macro';
    if (newType !== 'negative') { fileChanges++; return pre + '"' + newType + '"' + post; }
    return m;
  });

  // Also handle EV-related negative types
  scriptBlock = scriptBlock.replace(/(\{\s*id:\s*"[^"]+",\s*label:\s*"[^"]+",\s*type:\s*)"negative"(,\s*impact:\s*-[\d.]+[^}]*sector:\s*"(EV[^"]*|Legacy Auto[^"]*|Ride-hail|OTA|Technology|Regulated[^"]*|Gas-[^"]*|Nuclear\/Gas[^"]*|Gas Distribution|Regulated Gas[^"]*)")/g, (m, pre, post, sector) => {
    fileChanges++;
    return pre + '"consumer"' + post;
  });

  if (fileChanges > 0) {
    content = content.replace(scriptMatch[0], scriptBlock);
    fs.writeFileSync(filePath, content);
    changed++;
    totalChanges += fileChanges;
  }
});

console.log(`Pass 2: Modified ${changed} files with ${totalChanges} type changes`);
