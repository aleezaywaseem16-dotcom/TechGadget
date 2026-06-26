import { createClient } from '@supabase/supabase-js'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ALL_PRODUCTS = [

  // ── SMARTPHONES ──────────────────────────────────────────
  {
    slug: 'iphone-16-pro-max',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-2.jpg',
    ]
  },
  {
    slug: 'iphone-15',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-2.jpg',
    ]
  },
  {
    slug: 'iphone-14',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-2.jpg',
    ]
  },
  {
    slug: 'samsung-galaxy-s21-ultra',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-2.jpg',
    ]
  },
  {
    slug: 'samsung-galaxy-s25-ultra',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-2.jpg',
    ]
  },
  {
    slug: 'samsung-galaxy-a56',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-2.jpg',
    ]
  },
  {
    slug: 'samsung-galaxy-z-fold-6',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-2.jpg',
    ]
  },
  {
    slug: 'google-pixel-9-pro',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-2.jpg',
    ]
  },
  {
    slug: 'nothing-phone-2a',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-2a-3.jpg',
    ]
  },

  // ── LAPTOPS ──────────────────────────────────────────────
  {
    slug: 'macbook-air-13-m3',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'macbook-pro-16-m4-pro',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'macbook-pro-14-m3',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'dell-xps-15',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'asus-rog-zephyrus-g16',
    images: [
      'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'lenovo-ideapad-slim-5',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'microsoft-surface-laptop-5',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=600&h=600&fit=crop&auto=format',
    ]
  },

  // ── GAMING ───────────────────────────────────────────────
  {
    slug: 'razer-blackwidow-v4-pro',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'logitech-g915-tkl-wireless',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'razer-deathadder-v3-pro',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'logitech-g-pro-x-superlight-2',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'playstation-dualsense-controller',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'sony-wh-1000xm5',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
    ]
  },

  // ── SMART WATCHES ────────────────────────────────────────
  {
    slug: 'samsung-galaxy-watch-7',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch7-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch7-2.jpg',
    ]
  },
  {
    slug: 'apple-watch-series-10',
    images: [
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-10-1.jpg',
      'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-10-2.jpg',
    ]
  },
  {
    slug: 'garmin-fenix-8-solar',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'xiaomi-smart-band-9-pro',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&auto=format',
    ]
  },

  // ── AUDIO DEVICES ────────────────────────────────────────
  {
    slug: 'apple-airpods-pro-2nd-gen',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'sony-wf-1000xm5',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'sony-wh-1000xm6',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'jbl-charge-5',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'bose-soundlink-max',
    images: [
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&auto=format',
    ]
  },
  {
    slug: 'bose-quietcomfort-45',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format',
    ]
  },
]

async function downloadImage(url, filename) {
  console.log(`  Downloading ${filename}...`)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechGadget/1.0)' }
    })
    if (!res.ok) {
      console.error(`  FAILED ${url} — HTTP ${res.status}`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 5000) {
      console.error(`  FAILED ${url} — too small (${buffer.length} bytes), likely error page`)
      return null
    }
    if (!existsSync('tmp')) mkdirSync('tmp')
    writeFileSync(join('tmp', filename), buffer)
    console.log(`  ✓ Downloaded ${filename} (${Math.round(buffer.length / 1024)}KB)`)
    return buffer
  } catch (err) {
    console.error(`  ERROR downloading ${url}:`, err.message)
    return null
  }
}

async function uploadToStorage(buffer, path) {
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true })
  if (error) {
    console.error(`  Upload failed:`, error.message)
    return null
  }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

async function main() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === 'product-images')) {
    await supabase.storage.createBucket('product-images', { public: true })
    console.log('Created product-images bucket')
  }

  const { data: products } = await supabase.from('products').select('id, slug')
  const productMap = Object.fromEntries(products.map(p => [p.slug, p.id]))

  let uploaded = 0
  let fallback = 0
  let skipped = 0

  for (const product of ALL_PRODUCTS) {
    const productId = productMap[product.slug]
    if (!productId) {
      console.log(`\nSKIPPED (not in DB): ${product.slug}`)
      skipped++
      continue
    }

    console.log(`\nProcessing: ${product.slug}`)
    await supabase.from('product_images').delete().eq('product_id', productId)

    for (let i = 0; i < product.images.length; i++) {
      const url = product.images[i]
      const filename = `${product.slug}-${i + 1}.jpg`
      const storagePath = `products/${product.slug}/${filename}`

      const buffer = await downloadImage(url, filename)
      if (!buffer) {
        fallback++
        await supabase.from('product_images').insert({
          product_id: productId,
          url,
          alt: `${product.slug} image ${i + 1}`,
          position: i + 1,
        })
        console.log(`  Used original URL as fallback`)
        continue
      }

      const publicUrl = await uploadToStorage(buffer, storagePath)
      if (!publicUrl) { fallback++; continue }

      await supabase.from('product_images').insert({
        product_id: productId,
        url: publicUrl,
        alt: `${product.slug} image ${i + 1}`,
        position: i + 1,
      })
      console.log(`  ✓ In Supabase Storage`)
      uploaded++
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Uploaded to storage : ${uploaded}`)
  console.log(`Fallback (URL kept) : ${fallback}`)
  console.log(`Skipped (not in DB) : ${skipped}`)

  const { data: counts } = await supabase.from('product_images').select('product_id')
  console.log(`Total rows in DB    : ${counts?.length}`)
}

main().catch(console.error)
