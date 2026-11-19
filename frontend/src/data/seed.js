export const catArt={'Crochet Bags':'bag','Crochet Flowers':'flower','Crochet Toys':'bunny','Keychains':'berry','Home Decor':'basket','Accessories':'ring','Customized Gifts':'heart'}
const P=(id,name,category,price,status,description,art,specs,f,b)=>({id,name,category,price,status,description,art,specs,featured:!!f,best:!!b})
export default{
categories:Object.keys(catArt),
settings:{businessName:'Loop & Lane Crochet',whatsapp:'918838724331',email:'hello@loopandlane.in',phone:'+91 88387 24331'},
products:[
P(1,'Sunday Market Tote','Crochet Bags',1450,'available','Roomy cotton tote with reinforced handles.',{t:'bag',c:'#8d6e63',bg:'#efe3d3'},['Cotton yarn, 4 ply','34 × 30 cm','Fully lined','Spot clean only'],1,1),
P(2,'Sunflower Bouquet','Crochet Flowers',650,'available','Everlasting sunflowers, six stems with wire.',{t:'flower',c:'#e2b33d',bg:'#e3e9da'},['Milk cotton yarn','6 stems, 35 cm tall','Wire stems','Never wilts'],1,1),
P(3,'Biscuit the Bunny','Crochet Toys',890,'available','Soft amigurumi bunny, safe for babies.',{t:'bunny',c:'#e9dac5',bg:'#d8e1cf'},['Velvet baby yarn','22 cm tall','Safety eyes','Hand wash'],1),
P(4,'Strawberry Keychain','Keychains',220,'available','Tiny strawberry charm with a brass ring.',{t:'berry',c:'#c9473f',bg:'#f2e2d8'},['Cotton yarn','6 cm','Brass key ring','Ready to ship'],1,1),
P(5,'Fern Plant Basket','Home Decor',780,'available','Chunky basket that fits a 5-inch pot.',{t:'basket',c:'#b79a78',bg:'#e5ede0'},['Jute-blend yarn','18 cm wide','Holds up to 2 kg','Wipe clean'],0,1),
P(6,'Sage Scrunchie','Accessories',180,'available','Gentle on hair, with a cushioned core.',{t:'ring',c:'#89977b',bg:'#f3e9da'},['Cotton yarn','Fits all hair types','Sage, rose, ivory','Machine wash']),
P(7,'Name Heart Hanging','Customized Gifts',540,'available','Personalised heart with a name of your choice.',{t:'heart',c:'#d98f86',bg:'#ebe3d4'},['Cotton yarn','12 cm','Up to 8 letters','5-day making time']),
P(8,'Mustard Mini Bag','Crochet Bags',1100,'sold','A one-of-a-kind cross-body in warm mustard.',{t:'bag',c:'#d4a63a',bg:'#f1e5d0'},['Cotton yarn','22 × 18 cm','Magnetic clasp','Made to order on request'])]}
