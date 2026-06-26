import { createClient } from '@supabase/supabase-js'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRODUCTS = [
  {
    slug: 'amazon-echo-dot-5',
    id: '0de766e9-9746-4433-8f16-ad3b41c5a110',
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512446816042-444d641267d4?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'google-nest-hub-2',
    id: '5514bd6a-235f-4623-be9c-0686123b3744',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512446816042-444d641267d4?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'tp-link-tapo-l530e',
    id: 'f51fcf85-202b-4eb0-bfcb-470ee2484e9a',
    images: [
      'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'xiaomi-air-purifier-4',
    id: 'b6cafaf0-ea64-47fa-942f-748cce4aeb90',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'anker-65w-gan-charger',
    id: '3ac97a0c-925f-4ea0-b34e-bf761d2e8455',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'spigen-tempered-glass-iphone-16',
    id: 'a2b23068-1006-48c9-b40a-af5ebff25417',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'baseus-20000mah-powerbank',
    id: '7fa96889-10ba-413c-bf98-d10d397f5f53',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'samsung-45w-usb-c-cable',
    id: '2c7235af-4931-4976-a082-a9acb83f53b5',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&auto=format',
    ]
  },
]

async function downloadImage(url, filename) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) { console.error(`  FAILED ${url} — HTTP ${res.status}`); return null }
  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.length < 5000) { console.error(`  FAILED — too small (${buffer.length}B)`); return null }
  if (!existsSync('tmp')) mkdirSync('tmp')
  writeFileSync(join('tmp', filename), buffer)
  console.log(`  ✓ Downloaded ${filename} (${Math.round(buffer.length / 1024)}KB)`)
  return buffer
}

async function main() {
  let uploaded = 0, fallback = 0

  for (const p of PRODUCTS) {
    console.log(`\n${p.slug}`)
    await supabase.from('product_images').delete().eq('product_id', p.id)

    for (let i = 0; i < p.images.length; i++) {
      const url = p.images[i]
      const filename = `${p.slug}-${i + 1}.jpg`
      const storagePath = `products/${p.slug}/${filename}`

      const buffer = await downloadImage(url, filename)
      let publicUrl = url

      if (buffer) {
        const { error } = await supabase.storage
          .from('product-images')
          .upload(storagePath, buffer, { contentType: 'image/jpeg', upsert: true })
        if (!error) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath)
          publicUrl = data.publicUrl
          uploaded++
          console.log(`  ✓ Stored in Supabase`)
        } else {
          fallback++
          console.error(`  Upload error: ${error.message}`)
        }
      } else {
        fallback++
      }

      await supabase.from('product_images').insert({
        product_id: p.id, url: publicUrl,
        alt: `${p.slug} image ${i + 1}`, position: i + 1,
      })
    }
  }

  console.log(`\n${'─'.repeat(40)}`)
  console.log(`Uploaded to storage : ${uploaded}`)
  console.log(`Fallback URL kept   : ${fallback}`)
}

main().catch(console.error)
