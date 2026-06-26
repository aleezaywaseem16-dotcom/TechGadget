import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const fixes = [
  // Nothing Phone 2a — image 2 (GSMArena photo 3 is the correct second shot)
  {
    productId: '679b7c0e-7c23-4dab-a01d-5b9ae85788f3',
    slug: 'nothing-phone-2a',
    position: 2,
    url: 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-3.jpg',
    filename: 'nothing-2a-2.jpg',
    contentType: 'image/jpeg',
  },
  // Samsung Galaxy S25 Ultra — image 1 (Wikimedia Commons, CC licensed)
  {
    productId: '077ba1c5-7a98-4d00-9a12-a397d4b4a8f0',
    slug: 'samsung-galaxy-s25-ultra',
    position: 1,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/S25_Ultra.jpg',
    filename: 'samsung-s25-ultra-1.jpg',
    contentType: 'image/jpeg',
  },
  // Samsung Galaxy S25 Ultra — image 2 (same Wikimedia source, stored separately)
  {
    productId: '077ba1c5-7a98-4d00-9a12-a397d4b4a8f0',
    slug: 'samsung-galaxy-s25-ultra',
    position: 2,
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/S25_Ultra.jpg',
    filename: 'samsung-s25-ultra-2.jpg',
    contentType: 'image/jpeg',
  },
]

async function downloadImage(url, filename) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechGadget/1.0)' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  if (!existsSync('tmp')) mkdirSync('tmp')
  writeFileSync(join('tmp', filename), buffer)
  console.log(`  Downloaded ${filename} (${buffer.length} bytes)`)
  return buffer
}

async function main() {
  for (const fix of fixes) {
    console.log(`\nFixing: ${fix.slug} position ${fix.position}`)

    const buffer = await downloadImage(fix.url, fix.filename)

    const storagePath = `products/${fix.slug}/${fix.filename}`
    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(storagePath, buffer, { contentType: fix.contentType, upsert: true })
    if (uploadErr) { console.error('  Upload failed:', uploadErr.message); continue }

    const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath)
    console.log(`  Stored: ${data.publicUrl}`)

    // Delete any existing row for this product+position then insert
    await supabase.from('product_images')
      .delete()
      .eq('product_id', fix.productId)
      .eq('position', fix.position)

    const { error: dbErr } = await supabase.from('product_images').insert({
      product_id: fix.productId,
      url: data.publicUrl,
      alt: `${fix.slug} image ${fix.position}`,
      position: fix.position,
    })
    if (dbErr) console.error('  DB insert failed:', dbErr.message)
    else console.log(`  ✓ ${fix.slug} image ${fix.position} saved`)
  }
  console.log('\nFixup complete.')
}

main().catch(console.error)
