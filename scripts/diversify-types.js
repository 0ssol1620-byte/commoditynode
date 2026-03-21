const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', '_posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

// Mapping rules: sector keyword → new type
const sectorToType = {
  // Producers
  'Oil Major': 'producer', 'Mining': 'producer', 'Gold Mining': 'producer',
  'Uranium Mining': 'producer', 'Copper Mining': 'producer', 'Iron Mining': 'producer',
  'Steel Producer': 'producer', 'Coal Mining': 'producer', 'Lithium Mining': 'producer',
  'Diversified Mining': 'producer', 'Silver Mining': 'producer', 'Nickel Mining': 'producer',
  'Zinc Mining': 'producer', 'Tin Mining': 'producer', 'Cobalt Mining': 'producer',
  'Contract Drilling': 'producer', 'Royalty Streaming': 'producer', 'Royalty': 'producer',
  'Oil Producer': 'producer', 'Gas Producer': 'producer', 'Aluminum Producer': 'producer',
  'Cotton Producer': 'producer', 'Coffee Producer': 'producer',
  
  // Processors
  'Refining': 'processor', 'Smelting': 'processor', 'Agri Processing': 'processor',
  'Agri-Processing': 'processor', 'Processing': 'processor', 'Grain Trading': 'processor',
  'Battery Mfg': 'processor', 'Aluminum Smelting': 'processor', 'Steel Mill': 'processor',
  'Sugar Refining': 'processor', 'Cocoa Processing': 'processor', 'Coffee Roasting': 'processor',
  'Food Processing': 'processor', 'Meat Processing': 'processor',
  
  // Consumers
  'Airlines': 'consumer', 'Airline': 'consumer', 'Trucking': 'consumer',
  'Logistics': 'consumer', 'LTL': 'consumer', 'LTL Trucking': 'consumer',
  'Freight': 'consumer', 'Automotive': 'consumer', 'Construction': 'consumer',
  'Consumer': 'consumer', 'E-commerce': 'consumer', 'Parcel Delivery': 'consumer',
  'Farm Equipment': 'consumer', 'EV Maker': 'consumer', 'Auto Manufacturing': 'consumer',
  'Food Mfg': 'consumer', 'Beverage': 'consumer', 'Confectionery': 'consumer',
  'Luxury Retail': 'consumer', 'Jewelry': 'consumer', 'Textile': 'consumer',
  'Apparel': 'consumer', 'Homebuilder': 'consumer', 'Homebuilders': 'consumer',
  'Electronics': 'consumer', 'Semiconductor': 'consumer', 'Solar': 'consumer',
  'Packaging': 'consumer', 'Aerospace': 'consumer', 'Defense': 'consumer',
  'Chemical': 'consumer', 'Chemicals': 'consumer', 'Plastics': 'consumer',
  'Fertilizer': 'consumer', 'Utilities': 'consumer', 'Power Generation': 'consumer',
  'Retail': 'consumer', 'Restaurant': 'consumer', 'Fast Fashion': 'consumer',
  
  // Suppliers
  'Oilfield Services': 'supplier', 'Heavy Equipment': 'supplier', 'Equipment': 'supplier',
  'Mining Services': 'supplier', 'Pipelines': 'supplier', 'Pipeline': 'supplier',
  'Oil Tankers': 'supplier', 'Shipping': 'supplier', 'Infrastructure': 'supplier',
  
  // Macro
  'Macro': 'macro', 'Currency': 'macro', 'Inflation': 'macro', 'Rates': 'macro',
  'Monetary Policy': 'macro', 'Risk Premium': 'macro', 'Supply': 'macro',
  'Energy Storage': 'macro', 'Operations': 'macro', 'Geopolitics': 'macro',
  
  // Policy
  'Supply Policy': 'policy', 'Fiscal Policy': 'policy', 'Trade Policy': 'policy',
  'Regulation': 'policy', 'Climate': 'policy', 'Energy Policy': 'policy',
  'US Policy': 'policy', 'Policy': 'policy',
  
  // Substitute
  'Renewables': 'substitute', 'Alt Battery': 'substitute', 'Digital Assets': 'substitute',
  'Recycling': 'substitute', 'Alternative': 'substitute',
  
  // Regional
  'Emerging Markets': 'regional', 'China': 'regional', 'Central Asia': 'regional',
  'Africa': 'regional', 'South America': 'regional', 'Middle East': 'regional',
  'Australia': 'regional', 'India': 'regional', 'Regional': 'regional'
};

let changed = 0;
files.forEach(f => {
  const filePath = path.join(postsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find COMMODITY_DATA script block
  const scriptMatch = content.match(/<script>\s*\nwindow\.COMMODITY_DATA[\s\S]*?<\/script>/);
  if (!scriptMatch) return;
  
  let scriptBlock = scriptMatch[0];
  
  // For each node that has type "positive" or "negative", check its sector
  // and convert to a more specific type
  const nodePattern = /\{\s*id:\s*"([^"]+)"[^}]*type:\s*"(positive|negative)"[^}]*sector:\s*"([^"]*)"[^}]*\}/g;
  
  let match;
  const replacements = [];
  while ((match = nodePattern.exec(scriptBlock)) !== null) {
    const fullMatch = match[0];
    const oldType = match[2];
    const sector = match[3];
    
    let newType = null;
    // Check exact sector match first
    if (sectorToType[sector]) {
      newType = sectorToType[sector];
    } else {
      // Check partial matches
      for (const [key, type] of Object.entries(sectorToType)) {
        if (sector.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(sector.toLowerCase())) {
          newType = type;
          break;
        }
      }
    }
    
    if (newType && newType !== oldType) {
      // For negative impact nodes that get mapped to consumer/processor etc,
      // keep the negative type if they truly represent negative impact
      const impactMatch = fullMatch.match(/impact:\s*(-?[\d.]+)/);
      const impact = impactMatch ? parseFloat(impactMatch[1]) : 0;
      
      // Only change positive→producer/supplier/processor for positive impact nodes
      // and negative→consumer for negative impact nodes
      if (impact > 0 && (newType === 'producer' || newType === 'supplier' || newType === 'processor')) {
        replacements.push({ from: `type: "${oldType}"`, to: `type: "${newType}"`, in: fullMatch });
      } else if (impact < 0 && (newType === 'consumer' || newType === 'substitute')) {
        replacements.push({ from: `type: "${oldType}"`, to: `type: "${newType}"`, in: fullMatch });
      } else if (newType === 'macro' || newType === 'policy' || newType === 'regional') {
        replacements.push({ from: `type: "${oldType}"`, to: `type: "${newType}"`, in: fullMatch });
      }
    }
  }
  
  // Apply replacements carefully (replace within the specific node context)
  replacements.forEach(r => {
    const nodeWithOldType = r.in;
    const nodeWithNewType = nodeWithOldType.replace(`type: "${r.from.match(/"(\w+)"/)[1]}"`, `type: "${r.to.match(/"(\w+)"/)[1]}"`);
    scriptBlock = scriptBlock.replace(nodeWithOldType, nodeWithNewType);
    modified = true;
  });
  
  if (modified) {
    content = content.replace(scriptMatch[0], scriptBlock);
    fs.writeFileSync(filePath, content);
    changed++;
    console.log(`Diversified: ${f} (${replacements.length} type changes)`);
  }
});

console.log(`\nTotal files modified: ${changed}/${files.length}`);
