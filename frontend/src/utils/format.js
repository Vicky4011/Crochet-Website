export const inr=n=>'₹'+Number(n).toLocaleString('en-IN')
// Click-to-chat link with a URL-encoded, pre-filled message
export function waLink(p,number){const msg=p.status==='sold'
?`Hello! I'm interested in ${p.name}, which is currently marked as SOLD. Is it possible to make another one?`
:`Hello! I'm interested in purchasing ${p.name}. The listed price is ₹${p.price}. Could you please provide more details about this product?`
return `https://wa.me/${String(number).replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`}
